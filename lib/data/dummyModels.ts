// STRUCTURE OF HOW I WANT THE DATABASE TO BE LIKE, NOT THE FINAL STRUCTURE.

import { LucideIcon } from "lucide-react"

export interface Vault {
    id: number,
    name: string,
    icon: LucideIcon,
    iconColor?: string,
}

export enum VaultItem {
    LOGIN,
    SECURE_NOTE,
    CREDIT_CARD,
    IDENTITY
}

export type LoginItem = Vault & {
    id: number,
    username: string,
    password: string,
    url?: string,
    note?: string,
    vaultId?: string
}

export type SecureNoteItem = Vault & {
    id: number,
    title?: string,
    content: string,
    vaultId?: string
}

export type CreditCardItem = Vault & {
    id: number,
    cardNumber: string,
    cardHolderName: string,
    expiryDate: string,
    cvv: string,
    billingAddress?: string,
    country: string,
    vaultId?: string
}

export type Identity = Vault & {
    id: number,
    personalDetails: {
        fullName: string,
        email: string,
        phoneNumber: string,
    },
    addressDetails: {
        organizationName: string,
        address1: string,
        address2?: string,
        zipCode: string,
        city: string,
        state: string,
        country: string,
        additionalDetails?: {
            floor: string,
            county: string,
            poBox: string
        }
    },
    idDetails?: {
        socialSecurityNumber: string,
        passportNumber: string,
        licenseNumber: string
    }
    workDetails?: {
        companyName: string,
        occupation: string,
    },
    socials?: {
        x: string,
        linkedin: string,
        instagram: string,
        tiktok: string,
        facebook: string,
        github: string,
        other: string
    }
}