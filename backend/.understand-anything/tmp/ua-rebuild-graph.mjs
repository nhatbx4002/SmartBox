#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, normalize, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = resolve(process.argv[2] ?? process.cwd());
const pluginRoot = resolve("C:/Users/bnhat/.understand-anything/repo/understand-anything-plugin");
const core = await import(pathToFileURL(join(pluginRoot, "packages/core/dist/index.js")).href);
const {
  LanguageRegistry,
  FrameworkRegistry,
  TreeSitterPlugin,
  PluginRegistry,
  builtinLanguageConfigs,
  registerAllParsers,
  createIgnoreFilter,
  detectLayers,
  generateHeuristicTour,
  buildFingerprintStore,
} = core;

const outDir = join(projectRoot, ".understand-anything");
const tmpDir = join(outDir, "tmp");
mkdirSync(tmpDir, { recursive: true });

const languageRegistry = LanguageRegistry.createDefault();
const frameworkRegistry = FrameworkRegistry.createDefault();
const registry = new PluginRegistry(languageRegistry);
const tsPlugin = new TreeSitterPlugin(builtinLanguageConfigs.filter((config) => config.treeSitter));
await tsPlugin.init();
registry.register(tsPlugin);
registerAllParsers(registry);

const ignoreFilter = createIgnoreFilter(projectRoot);
const allFiles = scan(projectRoot).sort((a, b) => a.localeCompare(b));
const files = allFiles.filter((file) => !ignoreFilter.isIgnored(file));
const manifestPath = join(projectRoot, "package.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const manifestMap = Object.fromEntries(
  files
    .filter((file) => ["package.json", "pyproject.toml", "go.mod", "pom.xml", "Cargo.toml"].includes(basename(file)))
    .map((file) => [file, readFileSync(join(projectRoot, file), "utf8")]),
);
const gitCommitHash = git(["rev-parse", "HEAD"]) || "unknown";
const analyzedAt = new Date().toISOString();
const frameworks = frameworkRegistry.detectFrameworks(manifestMap).map((framework) => framework.id);

const nodes = [];
const edges = [];
const nodeIds = new Set();
const edgeKeys = new Set();
const importMap = {};
const fileRecords = [];
const sourceFilePaths = [];

for (const filePath of files) {
  const content = readFileSync(join(projectRoot, filePath), "utf8");
  const language = detectLanguage(filePath);
  const fileCategory = categorize(filePath);
  const analysis = analyze(filePath, content);
  const type = nodeType(filePath, fileCategory);
  const id = `${type}:${filePath}`;
  const sizeLines = lineCount(content);
  const complexity = complexityFor(sizeLines);
  fileRecords.push({ path: filePath, language, sizeLines, fileCategory });
  if (fileCategory === "code" || fileCategory === "script") sourceFilePaths.push(filePath);

  addNode({ id, type, name: basename(filePath), filePath, summary: summary(filePath, content, analysis), tags: tags(filePath, language, fileCategory, frameworks), complexity });

  for (const fn of analysis?.functions ?? []) {
    const fnId = `function:${filePath}:${fn.name}`;
    addNode({ id: fnId, type: "function", name: fn.name, filePath, lineRange: fn.lineRange, summary: `Function ${fn.name}.`, tags: ["function", language].filter(Boolean), complexity });
    addEdge(id, fnId, "contains", 1);
  }

  for (const cls of analysis?.classes ?? []) {
    const clsId = `class:${filePath}:${cls.name}`;
    addNode({ id: clsId, type: "class", name: cls.name, filePath, lineRange: cls.lineRange, summary: `Class or type ${cls.name}.`, tags: ["class", language].filter(Boolean), complexity });
    addEdge(id, clsId, "contains", 1);
  }

  for (const endpoint of expressEndpoints(content)) {
    const epId = `endpoint:${filePath}:${endpoint.method}:${endpoint.path}`;
    addNode({ id: epId, type: "endpoint", name: `${endpoint.method.toUpperCase()} ${endpoint.path}`, filePath, lineRange: [endpoint.line, endpoint.line], summary: `Express route handler for ${endpoint.method.toUpperCase()} ${endpoint.path}.`, tags: ["endpoint", "express"], complexity: "simple" });
    addEdge(id, epId, "contains", 1);
    addEdge(id, epId, "routes", 0.5);
  }

  for (const model of prismaModels(content, filePath)) {
    const modelId = `schema:${filePath}:${model.name}`;
    addNode({ id: modelId, type: "schema", name: model.name, filePath, lineRange: [model.line, model.line], summary: `Prisma model ${model.name}.`, tags: ["prisma", "schema"], complexity: "simple" });
    addEdge(id, modelId, "contains", 1);
    addEdge(id, modelId, "defines_schema", 0.8);
  }

  importMap[filePath] = internalImports(filePath, content, analysis);
}

for (const [from, targets] of Object.entries(importMap)) {
  for (const target of targets) addEdge(fileNodeId(from), fileNodeId(target), "imports", 0.7);
}

for (const file of files) {
  const content = readFileSync(join(projectRoot, file), "utf8");
  for (const call of callGraph(file, content).slice(0, 40)) {
    const source = findFunction(file, call.caller);
    const target = findFunction(file, call.callee);
    if (source && target && source !== target) addEdge(source, target, "calls", 0.8);
  }
}

for (const testFile of files.filter((file) => /(^|\/)(test|tests|__tests__)\//i.test(file) || /\.(test|spec)\./i.test(file))) {
  for (const target of importMap[testFile] ?? []) addEdge(fileNodeId(target), fileNodeId(testFile), "tested_by", 0.5);
}

const graph = {
  version: "1.0.0",
  project: {
    name: manifest.name ?? basename(projectRoot),
    languages: [...new Set(fileRecords.map((file) => file.language).filter((language) => language !== "unknown"))].sort(),
    frameworks,
    description: manifest.description ?? "Backend service for the SmartBox application.",
    analyzedAt,
    gitCommitHash,
  },
  nodes,
  edges,
  layers: [],
  tour: [],
};
graph.layers = layersFor(graph);
graph.tour = generateHeuristicTour(graph).map((step, index) => ({ ...step, order: index + 1 }));

const review = validate(graph);
writeFileSync(join(outDir, "knowledge-graph.json"), JSON.stringify(graph, null, 2));
writeFileSync(join(outDir, "meta.json"), JSON.stringify({ lastAnalyzedAt: analyzedAt, gitCommitHash, version: "1.0.0", analyzedFiles: files.length }, null, 2));
writeFileSync(join(outDir, "fingerprints.json"), JSON.stringify(buildFingerprintStore(projectRoot, sourceFilePaths, registry, gitCommitHash), null, 2));
writeFileSync(join(tmpDir, "review.json"), JSON.stringify(review, null, 2));
console.log(JSON.stringify({
  project: graph.project.name,
  analyzedFiles: files.length,
  nodeTypes: countBy(nodes, "type"),
  edgeTypes: countBy(edges, "type"),
  layers: graph.layers.map((layer) => layer.name),
  tourSteps: graph.tour.length,
  issues: review.issues.length,
  warnings: review.warnings.length,
  output: join(outDir, "knowledge-graph.json"),
}, null, 2));

function scan(root, current = root) {
  const result = [];
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    const absolute = join(current, entry.name);
    const rel = posix(relative(root, absolute));
    if (rel === ".git" || rel.startsWith(".git/")) continue;
    if (rel === ".understand-anything" || rel.startsWith(".understand-anything/")) continue;
    if (entry.isDirectory()) result.push(...scan(root, absolute));
    else if (entry.isFile()) result.push(rel);
  }
  return result;
}
function git(args) { try { return execFileSync("git", ["-C", projectRoot, ...args], { encoding: "utf8" }).trim(); } catch { return ""; } }
function analyze(file, content) { try { return registry.analyzeFile(file, content); } catch { return null; } }
function callGraph(file, content) { try { return registry.extractCallGraph(file, content) ?? []; } catch { return []; } }
function detectLanguage(file) { return file.endsWith(".prisma") ? "prisma" : languageRegistry.getForFile(file)?.id ?? "unknown"; }
function categorize(file) {
  const ext = extname(file).toLowerCase();
  const name = basename(file).toLowerCase();
  if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].includes(ext)) return "code";
  if ([".md", ".rst", ".txt"].includes(ext)) return "docs";
  if ([".json", ".yaml", ".yml", ".toml", ".env", ".prisma", ".graphql", ".proto"].includes(ext) || name === "dockerfile") return "config";
  if ([".sql", ".csv"].includes(ext)) return "data";
  if ([".sh", ".ps1", ".bat"].includes(ext)) return "script";
  if ([".html", ".css", ".scss"].includes(ext)) return "markup";
  return "code";
}
function nodeType(file, category) {
  if (file.endsWith(".prisma") || [".graphql", ".proto"].includes(extname(file).toLowerCase())) return "schema";
  if (category === "docs") return "document";
  if (category === "config") return "config";
  return "file";
}
function tags(file, language, category, frameworkIds) {
  const result = [category, language, ...frameworkIds].filter(Boolean);
  for (const [part, tag] of [["/routes/", "routes"], ["/services/", "services"], ["/middleware/", "middleware"], ["/jobs/", "jobs"], ["/lib/", "utilities"], ["/test/", "test"]]) if (file.includes(part)) result.push(tag);
  return [...new Set(result)];
}
function summary(file, content, analysis) {
  if (file === "package.json") return "Node package manifest defining backend scripts and dependencies.";
  if (file === "tsconfig.json") return "TypeScript compiler configuration for the backend project.";
  if (file.endsWith(".prisma")) return "Prisma schema defining the database datasource, client generator, and data models.";
  const functions = (analysis?.functions ?? []).map((fn) => fn.name).slice(0, 8);
  const classes = (analysis?.classes ?? []).map((cls) => cls.name).slice(0, 8);
  const parts = [];
  if (functions.length) parts.push(`functions: ${functions.join(", ")}`);
  if (classes.length) parts.push(`classes/types: ${classes.join(", ")}`);
  return parts.length ? `Source file containing ${parts.join("; ")}.` : `File starting with: ${(content.split(/\r?\n/).find((line) => line.trim()) ?? "").trim().slice(0, 120)}`;
}
function internalImports(file, content, analysis) {
  const sources = new Set((analysis?.imports ?? []).map((imp) => imp.source));
  for (const match of content.matchAll(/require\(["']([^"']+)["']\)/g)) sources.add(match[1]);
  return [...sources].filter((source) => source.startsWith(".")).map((source) => resolveImport(posix(normalize(join(dirname(file), source))))).filter(Boolean).sort();
}
function resolveImport(base) {
  for (const suffix of ["", ".ts", ".tsx", ".js", ".jsx", ".json", ".prisma", "/index.ts", "/index.tsx", "/index.js"]) {
    const candidate = `${base}${suffix}`;
    if (existsSync(join(projectRoot, candidate)) && statSync(join(projectRoot, candidate)).isFile()) return candidate;
  }
  return null;
}
function expressEndpoints(content) {
  return [...content.matchAll(/\b(?:router|app)\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/g)].map((match) => ({ method: match[1], path: match[2], line: content.slice(0, match.index).split(/\r?\n/).length }));
}
function prismaModels(content, file) {
  if (!file.endsWith(".prisma")) return [];
  return [...content.matchAll(/^\s*model\s+(\w+)\s+\{/gm)].map((match) => ({ name: match[1], line: content.slice(0, match.index).split(/\r?\n/).length }));
}
function addNode(node) { if (!nodeIds.has(node.id)) { nodeIds.add(node.id); nodes.push(node); } }
function addEdge(source, target, type, weight) { if (!source || !target || !nodeIds.has(source) || !nodeIds.has(target)) return; const key = `${source}|${target}|${type}`; if (!edgeKeys.has(key)) { edgeKeys.add(key); edges.push({ source, target, type, direction: "forward", weight }); } }
function fileNodeId(file) { return nodes.find((node) => node.filePath === file && ["file", "config", "document", "schema", "service", "pipeline", "resource"].includes(node.type))?.id ?? null; }
function findFunction(file, name) { return nodes.find((node) => node.type === "function" && node.filePath === file && node.name === name)?.id ?? null; }
function layersFor(graph) {
  const base = new Map(detectLayers({ ...graph, nodes: graph.nodes.filter((node) => node.type === "file") }).map((layer) => [layer.name, { ...layer, nodeIds: [...layer.nodeIds] }]));
  const ensure = (name, description) => base.get(name) ?? base.set(name, { id: `layer:${name.toLowerCase().replace(/\s+/g, "-")}`, name, description, nodeIds: [] }).get(name);
  for (const node of graph.nodes.filter((node) => ["config", "schema", "document", "endpoint"].includes(node.type))) {
    const layer = node.type === "config" ? ensure("Configuration Layer", "Application configuration and environment settings") : node.type === "schema" ? ensure("Data Layer", "Data models, database access, and persistence") : node.type === "document" ? ensure("Documentation Layer", "Project documentation") : ensure("API Layer", "HTTP endpoints, route handlers, and API controllers");
    if (!layer.nodeIds.includes(node.id)) layer.nodeIds.push(node.id);
  }
  return [...base.values()].filter((layer) => layer.nodeIds.length);
}
function validate(graph) {
  const issues = [];
  const warnings = [];
  const known = new Set(graph.nodes.map((node) => node.id));
  for (const edge of graph.edges) { if (!known.has(edge.source)) issues.push(`Missing edge source ${edge.source}`); if (!known.has(edge.target)) issues.push(`Missing edge target ${edge.target}`); }
  const assigned = new Set(graph.layers.flatMap((layer) => layer.nodeIds));
  for (const node of graph.nodes.filter((item) => ["file", "config", "document", "service", "pipeline", "table", "schema", "resource", "endpoint"].includes(item.type))) if (!assigned.has(node.id)) issues.push(`Unlayered file-level node ${node.id}`);
  const connected = new Set(graph.edges.flatMap((edge) => [edge.source, edge.target]));
  for (const node of graph.nodes) if (!connected.has(node.id)) warnings.push(`Node ${node.id} has no edges`);
  return { issues, warnings, stats: { totalNodes: graph.nodes.length, totalEdges: graph.edges.length, totalLayers: graph.layers.length, tourSteps: graph.tour.length, nodeTypes: countBy(graph.nodes, "type"), edgeTypes: countBy(graph.edges, "type") } };
}
function countBy(items, key) { return items.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] ?? 0) + 1; return acc; }, {}); }
function lineCount(content) { return content.endsWith("\n") ? content.split(/\r?\n/).length - 1 : content.split(/\r?\n/).length; }
function complexityFor(lines) { return lines <= 100 ? "simple" : lines <= 300 ? "moderate" : "complex"; }
function posix(value) { return value.replace(/\\/g, "/"); }
