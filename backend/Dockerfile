FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
RUN npm install
COPY tsconfig.json ./
COPY src ./src/
RUN npx prisma generate
RUN npm run build

FROM node:22-slim AS production
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init wget openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m -s /bin/sh nodeapp
COPY --from=builder --chown=nodeapp:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeapp:nodejs /app/src/generated ./dist/generated
COPY --from=builder --chown=nodeapp:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodeapp:nodejs /app/package.json ./
RUN npm prune --production
USER nodeapp
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O http://localhost:3001/api/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/index.js"]