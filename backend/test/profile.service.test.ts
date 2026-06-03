import assert from 'node:assert/strict';
import test from 'node:test';
import { validateMcpDevices } from '../src/services/profile.service';

test('validateMcpDevices reports missing expected MCP devices', async () => {
  const result = await validateMcpDevices(
    {
      id: 'profile-1',
      name: 'SmartBox-24-v1',
      provisionKey: 'smartbox-24-prod',
      provisionSecret: null,
      mode: 'ALLOW_NEW',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      templateRows: 1,
      templateCols: 2,
      templateSizes: '[["SMALL","LARGE"]]',
      mcpDevices: [
        { id: 'mcp-1', profileId: 'profile-1', bus: 1, address: 32, role: 'SENSOR', name: 'Sensor MCP' },
        { id: 'mcp-2', profileId: 'profile-1', bus: 1, address: 33, role: 'LOCK', name: 'Lock MCP' },
      ],
    } as any,
    [{ bus: 1, address: 32 }],
  );

  assert.equal(result.valid, false);
  assert.deepEqual(result.missing, ['Missing LOCK MCP at 1:33']);
});
