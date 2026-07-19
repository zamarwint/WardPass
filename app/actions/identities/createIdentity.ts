'use server';

import { prisma } from '@/utils/db';
import { getUserSession } from '../getSession';

export default async function createIdentity({
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

    const newIdentity = await prisma.identityItem.create({
        data: {
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
        }
    })

    return newIdentity;
}