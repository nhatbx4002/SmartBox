import 'dotenv/config';
import bcrypt from 'bcrypt';
import {
  AdminRole,
  CompartmentSize,
  PrismaClient,
  RentalType,
} from '../src/generated/prisma';

const prisma = new PrismaClient();

const smallPlans = [
  { id: 'small-1-day', name: '1 ngay', size: CompartmentSize.SMALL, rentalType: RentalType.ONCE, price: 10000, maxOpens: 2, durationDays: 1 },
  { id: 'small-7-days', name: '7 ngay', size: CompartmentSize.SMALL, rentalType: RentalType.ONCE, price: 15000, maxOpens: 2, durationDays: 7 },
  { id: 'small-5-opens-30-days', name: '5 luot / 30 ngay', size: CompartmentSize.SMALL, rentalType: RentalType.DAILY, price: 50000, maxOpens: 5, durationDays: 30 },
  { id: 'small-10-opens-90-days', name: '10 luot / 90 ngay', size: CompartmentSize.SMALL, rentalType: RentalType.DAILY, price: 90000, maxOpens: 10, durationDays: 90 },
  { id: 'small-1-month', name: '1 thang', size: CompartmentSize.SMALL, rentalType: RentalType.MONTHLY, price: 150000, maxOpens: null, durationDays: 30 },
  { id: 'small-3-months', name: '3 thang', size: CompartmentSize.SMALL, rentalType: RentalType.MONTHLY, price: 400000, maxOpens: null, durationDays: 90 },
  { id: 'small-6-months', name: '6 thang', size: CompartmentSize.SMALL, rentalType: RentalType.MONTHLY, price: 700000, maxOpens: null, durationDays: 180 },
];

const largePlans = [
  { id: 'large-1-day', name: '1 ngay', size: CompartmentSize.LARGE, rentalType: RentalType.ONCE, price: 15000, maxOpens: 2, durationDays: 1 },
  { id: 'large-7-days', name: '7 ngay', size: CompartmentSize.LARGE, rentalType: RentalType.ONCE, price: 20000, maxOpens: 2, durationDays: 7 },
  { id: 'large-5-opens-30-days', name: '5 luot / 30 ngay', size: CompartmentSize.LARGE, rentalType: RentalType.DAILY, price: 80000, maxOpens: 5, durationDays: 30 },
  { id: 'large-10-opens-90-days', name: '10 luot / 90 ngay', size: CompartmentSize.LARGE, rentalType: RentalType.DAILY, price: 140000, maxOpens: 10, durationDays: 90 },
  { id: 'large-1-month', name: '1 thang', size: CompartmentSize.LARGE, rentalType: RentalType.MONTHLY, price: 250000, maxOpens: null, durationDays: 30 },
  { id: 'large-3-months', name: '3 thang', size: CompartmentSize.LARGE, rentalType: RentalType.MONTHLY, price: 650000, maxOpens: null, durationDays: 90 },
  { id: 'large-6-months', name: '6 thang', size: CompartmentSize.LARGE, rentalType: RentalType.MONTHLY, price: 1100000, maxOpens: null, durationDays: 180 },
];

async function seedPlans() {
  for (const plan of [...smallPlans, ...largePlans]) {
    await prisma.pricePlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }
}

async function seedLocationsAndCabinets() {
  const bachKhoa = await prisma.location.upsert({
    where: { id: 'loc-bach-khoa' },
    update: {},
    create: {
      id: 'loc-bach-khoa',
      name: 'SmartBox Truong DH Bach Khoa',
      address: '268 Ly Thuong Kiet, P.14, Q.10, TP.HCM',
      latitude: 10.7795,
      longitude: 106.6989,
    },
  });

  await prisma.location.upsert({
    where: { id: 'loc-dormitory' },
    update: {},
    create: {
      id: 'loc-dormitory',
      name: 'SmartBox Ky Tuc Xa',
      address: 'Khu A, DHQG TP.HCM',
      latitude: 10.8781,
      longitude: 106.8067,
    },
  });

  const cabinetA = await prisma.cabinet.upsert({
    where: { id: 'cabinet-a' },
    update: {},
    create: {
      id: 'cabinet-a',
      locationId: bachKhoa.id,
      name: 'Tu A',
      mcp23017Bus: 1,
      mcp23017Address: 32,
    },
  });

  await seedCompartments(cabinetA.id);
}

async function seedCompartments(cabinetId: string) {
  const compartment = await prisma.compartment.upsert({
    where: { cabinetId_name: { cabinetId, name: 'A1' } },
    update: {},
    create: {
      name: 'A1',
      cabinetId,
      size: CompartmentSize.SMALL,
      mcp23017PinLock: 0,
      mcp23017PinSensor: 12,
    },
  });

  await prisma.compartmentStatus.upsert({
    where: { compartmentId: compartment.id },
    update: {},
    create: { compartmentId: compartment.id },
  });
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@smartbox.io';
  const password = process.env.ADMIN_PASSWORD || 'SmartBox@2026';
  const name = process.env.ADMIN_NAME || 'SmartBox Admin';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name, role: AdminRole.SUPER_ADMIN },
    create: { email, passwordHash, name, role: AdminRole.SUPER_ADMIN },
  });
}

async function main() {
  await seedPlans();
  await seedLocationsAndCabinets();
  await seedAdmin();
  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
