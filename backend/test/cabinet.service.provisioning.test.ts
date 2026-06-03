import assert from 'node:assert/strict';
import test from 'node:test';
import { CabinetStatus } from '../src/generated/prisma';
import { prisma } from '../src/lib/prisma';
import { updateCabinet, updateHeartbeat } from '../src/services/cabinet.service';

test('updateCabinet rejects invalid provisioning status transitions', async (t) => {
  const originals = {
    cabinetFindUnique: prisma.cabinet.findUnique,
  };
  t.after(() => {
    (prisma.cabinet.findUnique as unknown) = originals.cabinetFindUnique;
  });

  (prisma.cabinet.findUnique as unknown) = async () => ({ id: 'cabinet-1', status: CabinetStatus.ACTIVE });

  await assert.rejects(
    () => updateCabinet('cabinet-1', { status: CabinetStatus.PENDING_PROVISION }),
    /Invalid cabinet status transition/,
  );
});

test('updateHeartbeat promotes pending provision cabinet to active', async (t) => {
  const calls: { cabinetUpdate?: unknown } = {};
  const originals = {
    cabinetFindUnique: prisma.cabinet.findUnique,
    cabinetUpdate: prisma.cabinet.update,
    lockerLogCreate: prisma.lockerLog.create,
  };
  t.after(() => {
    (prisma.cabinet.findUnique as unknown) = originals.cabinetFindUnique;
    (prisma.cabinet.update as unknown) = originals.cabinetUpdate;
    (prisma.lockerLog.create as unknown) = originals.lockerLogCreate;
  });

  (prisma.cabinet.findUnique as unknown) = async () => ({ id: 'cabinet-1', status: CabinetStatus.PENDING_PROVISION });
  (prisma.cabinet.update as unknown) = async (args: unknown) => {
    calls.cabinetUpdate = args;
    return { id: 'cabinet-1', status: CabinetStatus.ACTIVE, lastHeartbeatAt: new Date() };
  };
  (prisma.lockerLog.create as unknown) = async () => ({ id: 'log-1' });

  const cabinet = await updateHeartbeat('cabinet-1');

  assert.equal(cabinet.status, CabinetStatus.ACTIVE);
  assert.deepEqual((calls.cabinetUpdate as { data: { status: CabinetStatus } }).data.status, CabinetStatus.ACTIVE);
});
