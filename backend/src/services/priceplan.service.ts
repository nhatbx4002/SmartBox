import {CompartmentSize, Prisma , RentalType} from '../generated/prisma'
import { NotFoundError} from '../lib/errors'
import {prisma} from '../lib/prisma'

export async function listPricePlans(filters?: {size?: CompartmentSize; isActive?: boolean}){
    const where: Prisma.PricePlanWhereInput = {};
    if(filters?.size) where.size = filters?.size;
    if(filters?.isActive !== undefined) where.isActive = filters?.isActive;
    return prisma.pricePlan.findMany({where, orderBy: {price: 'asc'}});
}

export async function getPricePlan(id: string){
    const plan = await prisma.pricePlan.findUnique({
        where : {id}
    })
    if(!plan) throw new NotFoundError('Price plan not found!');
    return plan;
}

export async function createPricePlan(data: {
    name: string;
    size: CompartmentSize;
    rentalType: RentalType;
    price: number;
    maxOpens?: number | null;
    durationDays: number;
    description?: string;
    isActive?: boolean;
}) {
    return prisma.pricePlan.create({
        data: {
            name: data.name,
            size: data.size,
            rentalType: data.rentalType,
            price: data.price,
            maxOpens: data.maxOpens ?? null,
            durationDays: data.durationDays,
            description: data.description,
            isActive: data.isActive ?? true,
        },
    });
}

export async function updatePricePlan(id: string, data: {
    name?: string;
    size?: CompartmentSize;
    rentalType?: RentalType;
    price?: number;
    maxOpens?: number | null;
    durationDays?: number;
    description?: string;
    isActive?: boolean;
}) {
    const plan = await prisma.pricePlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundError('Price plan not found');

    return prisma.pricePlan.update({
        where: { id },
        data: {
            ...data,
            maxOpens: data.maxOpens ?? undefined,
        },
    });
}

export async function deletePricePlan(id: string) {
    const plan = await prisma.pricePlan.findUnique({ where: { id }
    });
    if (!plan) throw new NotFoundError('Price plan not found');
    return prisma.pricePlan.update({ where: { id }, data: {isActive: false } });
}