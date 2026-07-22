import bcrypt from 'bcrypt';
import {AdminRole} from '../generated/prisma';
import {BadRequestError , NotFoundError} from '../lib/errors'
import {prisma} from '../lib/prisma';

const adminInclude = {
    cabinetAssignments: {
        include: {cabinet: {select: {id:true,name:true}}},
    },
} as const;

export async function listAdmins(){
    return prisma.admin.findMany({include:adminInclude , orderBy:{createdAt:'asc'} });
}

export async function createAdmin(input: {email:string ; name:string ; password:string ; role?:AdminRole}) {
    const existing = await prisma.admin.findUnique({where:{email:input.email}});
    if(existing){throw new BadRequestError('Emaill already in use!')};

    const passwordHash = await bcrypt.hash(input.password, 10);
    return prisma.admin.create({
        data: {email:input.email, name:input.name , passwordHash, role:input.role?? AdminRole.CABINET_ADMIN},
        include: adminInclude,
    });
}

export async function updateAdmin(id:string , input: {email?:string, name?:string , password?:string}) {
    const admin = await prisma.admin.findUnique({where:{id}});
    if(!admin) throw new NotFoundError('Admin not found!');

    if(input.email && input.email !== admin.email){
        const existing = await prisma.admin.findUnique({where:{email:input.email}});
        if(existing) throw new BadRequestError('Email already in use!');
    }

    const data: Record<string, unknown> = {};
    if(input.email) data.email = input.email;
    if(input.name) data.name = input.name;
    if(input.password) data.passwordHash = await bcrypt.hash(input.password, 10);

    return prisma.admin.update({where:{id} , data , include:adminInclude});
}

export async function deleteAdmin(id: string, currentAdminId:
string) {
    if (id === currentAdminId) throw new BadRequestError('Cannot delete yourself');

    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundError('Admin not found');
    if (admin.role === 'SUPER_ADMIN') {
        const count = await prisma.admin.count({ where: { role: 'SUPER_ADMIN' } });
        if (count <= 1) throw new BadRequestError('Cannot delete last SUPER_ADMIN');
    }

    return prisma.admin.delete({ where: { id } });
}

export async function setAdminCabinets(adminId: string, cabinetIds: string[]) {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundError('Admin not found');

    await prisma.adminCabinet.deleteMany({ where: { adminId } });
    if (cabinetIds.length > 0) {
        await prisma.adminCabinet.createMany({
            data: cabinetIds.map((cabinetId) => ({ adminId, cabinetId
            })),
        });
    }

    return prisma.admin.findUnique({ where: { id: adminId }, include: adminInclude });
}