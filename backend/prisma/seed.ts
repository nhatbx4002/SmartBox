import { CompartmentSize, PrismaClient, RentalType } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const smallPlans = [
    { id: 'small-1-day', name: '1 ngày', size: CompartmentSize.SMALL, rentalType: RentalType.ONCE, price: 10000, maxOpens: 2, durationDays: 1 },
    { id: 'small-7-days', name: '7 ngày', size: CompartmentSize.SMALL, rentalType: RentalType.ONCE, price: 15000, maxOpens: 2, durationDays: 7 },
    { id: 'small-5-opens-30-days', name: '5 lượt / 30 ngày', size: CompartmentSize.SMALL, rentalType: RentalType.DAILY, price: 50000, maxOpens: 5, durationDays: 30 },
    { id: 'small-10-opens-90-days', name: '10 lượt / 90 ngày', size: CompartmentSize.SMALL, rentalType: RentalType.DAILY, price: 90000, maxOpens: 10, durationDays: 90 },
    { id: 'small-1-month', name: '1 tháng', size: CompartmentSize.SMALL, rentalType: RentalType.MONTHLY, price: 150000, maxOpens: null, durationDays: 30 },
    { id: 'small-3-months', name: '3 tháng', size: CompartmentSize.SMALL, rentalType: RentalType.MONTHLY, price: 400000, maxOpens: null, durationDays: 90 },
    { id: 'small-6-months', name: '6 tháng', size: CompartmentSize.SMALL, rentalType: RentalType.MONTHLY, price: 700000, maxOpens: null, durationDays: 180 },
];

const largePlans = [
    { id: 'large-1-day', name: '1 ngày', size: CompartmentSize.LARGE, rentalType: RentalType.ONCE, price: 15000, maxOpens: 2, durationDays: 1 },
    { id: 'large-7-days', name: '7 ngày', size: CompartmentSize.LARGE, rentalType: RentalType.ONCE, price: 20000, maxOpens: 2, durationDays: 7 },
    { id: 'large-5-opens-30-days', name: '5 lượt / 30 ngày', size: CompartmentSize.LARGE, rentalType: RentalType.DAILY, price: 80000, maxOpens: 5, durationDays: 30 },
    { id: 'large-10-opens-90-days', name: '10 lượt / 90 ngày', size: CompartmentSize.LARGE, rentalType: RentalType.DAILY, price: 140000, maxOpens: 10, durationDays: 90 },
    { id: 'large-1-month', name: '1 tháng', size: CompartmentSize.LARGE, rentalType: RentalType.MONTHLY, price: 250000, maxOpens: null, durationDays: 30 },
    { id: 'large-3-months', name: '3 tháng', size: CompartmentSize.LARGE, rentalType: RentalType.MONTHLY, price: 650000, maxOpens: null, durationDays: 90 },
    { id: 'large-6-months', name: '6 tháng', size: CompartmentSize.LARGE, rentalType: RentalType.MONTHLY, price: 1100000, maxOpens: null, durationDays: 180 },
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

async function seedLocation() {
    await prisma.location.upsert({
        where: { id: 'loc-bach-khoa' },
        update: {},
        create: {
            id: 'loc-bach-khoa',
            name: 'SmartBox Trường ĐH Bách Khoa',
            address: '268 Lý Thường Kiệt, P.14, Q.10, TP.HCM',
            latitude: 10.7795,
            longitude: 106.6989,
        },
    });
}

async function main() {
    const email = process.env.ADMIN_EMAIL || 'admin@smartbox.io';
    const password = process.env.ADMIN_PASSWORD || 'SmartBox@2026';
    const name = process.env.ADMIN_NAME || 'SmartBox Admin';

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.admin.upsert({
        where: { email },
        update: { passwordHash, name },
        create: { email, passwordHash, name, role: 'SUPER_ADMIN' },
    });

    await seedPlans();
    await seedLocation();

    console.log('Seed completed:', email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());