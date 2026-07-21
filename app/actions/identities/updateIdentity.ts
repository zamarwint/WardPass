'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function updateIdentity({
    id,
    vaultId,
    name,
    email,
    phoneNumber,
    organizationName,
    address1,
    address2,
    zipCode,
    city,
    state,
    country,
    floor,
    county,
    poBox,
    socialSecurityNumber,
    passportNumber,
    licenseNumber,
    companyName,
    occupation,
    x,
    linkedin,
    instagram,
    tiktok,
    facebook,
    github,
    other
}: {
    id: string,
    vaultId: string,
    name: string,
    email: string,
    phoneNumber: string,
    organizationName: string,
    address1: string,
    address2?: string,
    zipCode: string,
    city: string,
    state?: string,
    country: string,
    floor?: string,
    county?: string,
    poBox?: string,
    socialSecurityNumber?: string,
    passportNumber?: string,
    licenseNumber?: string,
    companyName?: string,
    occupation?: string,
    x?: string,
    linkedin?: string,
    instagram?: string,
    tiktok?: string,
    facebook?: string,
    github?: string,
    other?: string
}) {
    const session = await getUserSession();
    if (!session) return;

    const updatedIdentity = await prisma.identityItem.update({
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            organizationName: true,
            address1: true,
            address2: true,
            zipCode: true,
            city: true,
            state: true,
            country: true,
            floor: true,
            county: true,
            poBox: true,
            socialSecurityNumber: true,
            passportNumber: true,
            licenseNumber: true,
            companyName: true,
            occupation: true,
            x: true,
            linkedin: true,
            instagram: true,
            tiktok: true,
            facebook: true,
            github: true,
            other: true
        },
        where: {
            id: id,
            vaultId: vaultId
        },
        data: {
            name,
            email,
            phoneNumber,
            organizationName,
            address1,
            address2,
            zipCode,
            city,
            state,
            country,
            floor,
            county,
            poBox,
            socialSecurityNumber,
            passportNumber,
            licenseNumber,
            companyName,
            occupation,
            x,
            linkedin,
            instagram,
            tiktok,
            facebook,
            github,
            other
        }
    })

    return updatedIdentity;
}