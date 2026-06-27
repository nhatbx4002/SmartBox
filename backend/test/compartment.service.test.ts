import assert from 'node:assert/strict';
import test from 'node:test';
import { CabinetStatus, CompartmentAvailability, CompartmentSize } from '../src/generated/prisma';
import { prisma } from '../src/lib/prisma';
import { createCompartment, deleteCompartment } from '../src/services/compartment.service';

test('createCompartment rejects duplicate lock pin on the same MCP device', async (t) => {
  const originals = {
    cabinetFindUnique: prisma.cabinet.findUnique,
    mcpDeviceFindFirst: prisma.mcpDevice.findFirst,
    compartmentFindFirst: prisma.compartment.findFirst,
  };
  t.after(() => {
    (prisma.cabinet.findUnique as unknown) = originals.cabinetFindUnique;
    (prisma.mcpDevice.findFirst as unknown) = originals.mcpDeviceFindFirst;
    (prisma.compartment.findFirst as unknown) = originals.compartmentFindFirst;
  });

  (prisma.cabinet.findUnique as unknown) = async () => ({ id: 'cabinet-1', status: CabinetStatus.ACTIVE });
  (prisma.mcpDevice.findFirst as unknown) = async () => ({ id: 'mcp-1', cabinetId: 'cabinet-1' });
  (prisma.compartment.findFirst as unknown) = async (args: {
    where?: { OR?: Array<{ lockMcpDeviceId?: string; mcp23017PinLock?: number }> };
  }) => {
    const or = args.where?.OR ?? [];
    for (const condition of or) {
      if (condition.lockMcpDeviceId === 'mcp-1' && condition.mcp23017PinLock === 4) {
        return { id: 'existing-compartment' };
      }
    }
    return null;
  };

  await assert.rejects(
    () =>
      createCompartment('cabinet-1', {
        name: 'A3',
        size: CompartmentSize.SMALL,
        lockMcpDeviceId: 'mcp-1',
        sensorMcpDeviceId: 'mcp-1',
        mcp23017PinLock: 4,
        mcp23017PinSensor: 5,
      }),
    /Pin already in use/,
  );
});

test('createCompartment creates compartment and increments cabinet configVersion', async (t) => {
  const originals = {
    cabinetFindUnique: prisma.cabinet.findUnique,
    cabinetUpdate: prisma.cabinet.update,
    mcpDeviceFindFirst: prisma.mcpDevice.findFirst,
    compartmentFindFirst: prisma.compartment.findFirst,
    transaction: prisma.$transaction,
  };
  t.after(() => {
    (prisma.cabinet.findUnique as unknown) = originals.cabinetFindUnique;
    (prisma.cabinet.update as unknown) = originals.cabinetUpdate;
    (prisma.mcpDevice.findFirst as unknown) = originals.mcpDeviceFindFirst;
    (prisma.compartment.findFirst as unknown) = originals.compartmentFindFirst;
    (prisma.$transaction as unknown) = originals.transaction;
  });

  (prisma.cabinet.findUnique as unknown) = async () => ({ id: 'cabinet-1', status: CabinetStatus.ACTIVE });
  (prisma.mcpDevice.findFirst as unknown) = async () => ({ id: 'mcp-1', cabinetId: 'cabinet-1' });
  (prisma.compartment.findFirst as unknown) = async () => null;
  (prisma.$transaction as unknown) = async (fn: (tx: unknown) => unknown) => {
    return fn({
      compartment: {
        create: async () => ({
          id: 'comp-3',
          cabinetId: 'cabinet-1',
          name: 'A3',
          status: CompartmentAvailability.AVAILABLE,
        }),
      },
      cabinet: {
        update: async () => ({
          id: 'cabinet-1',
          configVersion: 2,
        }),
      },
    });
  };

  (prisma.cabinet.findUnique as unknown) = async () => ({ id: 'cabinet-1', status: CabinetStatus.ACTIVE, mcpDevices: [], compartments: [] });

  const result = await createCompartment('cabinet-1', {
    name: 'A3',
    size: CompartmentSize.SMALL,
    lockMcpDeviceId: 'mcp-1',
    sensorMcpDeviceId: 'mcp-1',
    mcp23017PinLock: 4,
    mcp23017PinSensor: 5,
  });

  assert.equal(result.configVersion, 2);
  assert.equal(result.compartment.id, 'comp-3');
});

test('createCompartment allows multiple compartments without sensors', async (t) => {
  const calls: unknown[] = [];
  const originals = {
    cabinetFindUnique: prisma.cabinet.findUnique,
    cabinetUpdate: prisma.cabinet.update,
    mcpDeviceFindFirst: prisma.mcpDevice.findFirst,
    compartmentFindFirst: prisma.compartment.findFirst,
    transaction: prisma.$transaction,
  };
  t.after(() => {
    (prisma.cabinet.findUnique as unknown) = originals.cabinetFindUnique;
    (prisma.cabinet.update as unknown) = originals.cabinetUpdate;
    (prisma.mcpDevice.findFirst as unknown) = originals.mcpDeviceFindFirst;
    (prisma.compartment.findFirst as unknown) = originals.compartmentFindFirst;
    (prisma.$transaction as unknown) = originals.transaction;
  });

  (prisma.cabinet.findUnique as unknown) = async () => ({ id: 'cabinet-1', status: CabinetStatus.CONFIGURING, mcpDevices: [], compartments: [] });
  (prisma.mcpDevice.findFirst as unknown) = async () => ({ id: 'mcp-1', cabinetId: 'cabinet-1' });
  (prisma.compartment.findFirst as unknown) = async (args: unknown) => {
    calls.push(args);
    return null;
  };
  (prisma.$transaction as unknown) = async (fn: (tx: unknown) => unknown) => {
    return fn({
      compartment: {
        create: async (args: { data: { mcp23017PinSensor: number; sensorMcpDeviceId?: string | null } }) => ({
          id: 'comp-4',
          cabinetId: 'cabinet-1',
          name: 'A4',
          status: CompartmentAvailability.AVAILABLE,
          ...args.data,
        }),
      },
      cabinet: {
        update: async () => ({
          id: 'cabinet-1',
          configVersion: 2,
          compartments: [{ id: 'comp-4', name: 'A4' }],
        }),
      },
    });
  };

  const result = await createCompartment('cabinet-1', {
    name: 'A4',
    size: CompartmentSize.SMALL,
    lockMcpDeviceId: 'mcp-1',
    sensorMcpDeviceId: null,
    mcp23017PinLock: 6,
  });

  assert.equal(result.compartment.mcp23017PinSensor, 0);
  assert.equal(result.compartment.sensorMcpDeviceId, null);
  assert.equal(calls.length, 2);
});

test('deleteCompartment rejects occupied compartments', async (t) => {
  const originals = {
    compartmentFindUnique: prisma.compartment.findUnique,
  };
  t.after(() => {
    (prisma.compartment.findUnique as unknown) = originals.compartmentFindUnique;
  });

  (prisma.compartment.findUnique as unknown) = async () => ({
    id: 'comp-1',
    cabinetId: 'cabinet-1',
    status: CompartmentAvailability.OCCUPIED,
  });

  await assert.rejects(() => deleteCompartment('comp-1'), /Cannot delete occupied compartment/);
});
