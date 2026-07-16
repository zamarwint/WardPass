import { CreditCardItem, IdentityItem, LoginItem, SecureNoteItem } from "./VaultItemType"

export type Vault = {
    id: string
    name: string
    slug: string
    icon: string
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

export type VaultItem = LoginItem | SecureNoteItem | CreditCardItem | IdentityItem;