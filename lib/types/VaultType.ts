import { CreditCardItem, IdentityItem, LoginItem, SecureNoteItem } from "./VaultItemType"

export type Vault = {
    id: string | null
    name: string | null
    slug: string | null
    icon: string | null
    iconColor: string | null

    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null

    loginItems?: LoginItem[]
    secureNoteItems?: SecureNoteItem[]
    creditCardItems?: CreditCardItem[]
    identities?: IdentityItem[]
}

export enum VaultItemEnum {
    LOGIN,
    SECURE_NOTE,
    CREDIT_CARD,
    IDENTITY
}