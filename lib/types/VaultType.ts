export type Vault = {
    id: string
    name: string
    slug: string
    icon: string
    iconColor: string | null

    // Decrypted vault metadata
    salt: string | null
    encryptedKey: string | null
    keyIv: string | null
    verificationHash: string | null
    hashIv: string | null

    createdAt: Date
    updatedAt: Date
    userId: string

    vaultItems?: VaultItem[]
}

export type VaultItem = {
    id: string
    itemType: VaultItemType
    encryptedData: string | null
    iv: string | null

    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null

    vaultId: string
}

export enum VaultItemType {
    LOGIN = "LOGIN",
    SECURE_NOTE = "SECURE_NOTE",
    CREDIT_CARD = "CREDIT_CARD",
    IDENTITY = "IDENTITY"
}