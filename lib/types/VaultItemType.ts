export type LoginItem = {
    id: string | null
    itemType: "LOGIN"
    name: string | null
    url: string | null
    username: string | null
    email: string | null
    password: string | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
    vaultId: string | null
}

export type SecureNoteItem = {
    id: string | null
    itemType: "SECURE_NOTE"
    title: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    vaultId: string | null
}

export type CreditCardItem = {
    id: string | null
    itemType: "CREDIT_CARD"
    cardNumber: string | null
    cardHolderName: string | null
    expiryDate: string | null
    cvv: number | null
    billingAddress1: string | null
    billingAddress2: string | null
    zipCode: string | null
    city: string | null
    state: string | null
    country: string | null
    createdAt: Date | null
    updatedAt: Date | null
    vaultId: string | null
}

export type IdentityItem = {
    id: string | null
    itemType: "IDENTITY"
    name: string | null
    email: string | null
    phoneNumber: string | null
    organizationName: string | null
    address1: string | null
    address2: string | null
    zipCode: string | null
    city: string | null
    state: string | null
    country: string | null
    floor: string | null
    county: string | null
    poBox: string | null
    socialSecurityNumber: string | null
    passportNumber: string | null
    licenseNumber: string | null
    companyName: string | null
    occupation: string | null
    x: string | null
    linkedin: string | null
    instagram: string | null
    tiktok: string | null
    facebook: string | null
    github: string | null
    other: string | null
    createdAt: Date | null
    updatedAt: Date | null
    vaultId: string | null
}