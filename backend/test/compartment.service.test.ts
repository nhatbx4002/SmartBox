import assert from 'node:assert/strict';
import test from 'node:test';
import { CabinetStatus, CompartmentAvailability, CompartmentSize } from '../src/generated/prisma';
import { prisma } from '../src/lib/prisma';
import { createCompartment, deleteCompartment } from '../src/services/compartment.service';

test('createCompartment rejects duplicate lock pin on the same MCP device', async (t) => {
  const originals = {
    cabinetFindUnique: prisma.cabinet.findUnique,
    compartmentFindFirst: prisma.compartment.findFirst,
  };
  t.after(() => {
    (prisma.cabinet.findUnique as unknown) = originals.cabinetFindUnique;
    (prisma.compartment.findFirst as unknown) = originals.compartmentFindFirst;
  });

  (prisma.cabinet.findUnique as unknown) = async () => ({ id: 'cabinet-1', status: CabinetStatus.ACTIVE });
  (prisma.compartment.findFirst as unknown) = async (args: {
    where?: { mcp23017PinLock?: number; lockMcpDeviceId?: string };
  }) => {
    if (args.where?.lockMcpDeviceId === 'mcp-1' && args.where.mcp23017PinLock === 4) {
      return { id: 'existing-compartment' };
    }
    return null;
  };

  await assert.rejects(
    () =>
      createCompartment('cabinet-1', {
        name: 'A3',
        size: CompartmentSize.SMALL,
        rowIndex: 0,
        colIndex: 2,
        lockMcpDeviceId: 'mcp-1',
        sensorMcpDeviceId: 'mcp-1',
        mcp23017PinLock: 4,
        mcp23017PinSensor: 5,
      }),
    /Lock pin already used/,
  );
});

test('createCompartment creates compartment and increments cabinet configVersion', async (t) => {
  const originals = {
    cabinetFindUnique: prisma.cabinet.findUnique,
    cabinetUpdate: prisma.cabinet.update,
    compartmentFindFirst: prisma.compartment.findFirst,
    compartmentCreate: prisma.compartment.create,
  };
  t.after(() => {
    (prisma.cabinet.findUnique as unknown) = originals.cabinetFindUnique;
    (prisma.cabinet.update as unknown) = originals.cabinetUpdate;
    (prisma.compartment.findFirst as unknown) = originals.compartmentFindFirst;
    (prisma.compartment.create as unknown) = originals.compartmentCreate;
  });

  (prisma.cabinet.findUnique as unknown) = async () => ({ id: 'cabinet-1', status: CabinetStatus.ACTIVE });
  (prisma.compartment.findFirst as unknown) = async () => null;
  (prisma.compartment.create as unknown) = async () => ({
    id: 'comp-3',
    cabinetId: 'cabinet-1',
    name: 'A3',
    status: CompartmentAvailability.AVAILABLE,
  });
  (prisma.cabinet.update as unknown) = async () => ({
    id: 'cabinet-1',
    configVersion: 2,
    compartments: [{ id: 'comp-3', name: 'A3' }],
  });

  const result = await createCompartment('cabinet-1', {
    name: 'A3',
    size: CompartmentSize.SMALL,
    rowIndex: 0,
    colIndex: 2,
    lockMcpDeviceId: 'mcp-1',
    sensorMcpDeviceId: 'mcp-1',
    mcp23017PinLock: 4,
    mcp23017PinSensor: 5,
  });

  assert.equal(result.configVersion, 2);
  assert.equal(result.compartment.id, 'comp-3');
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
