export type LoginJSON = {
    name: string
    url?: string
    username?: string
    email: string
    password: string
    note?: string
}

export type SecureNoteJSON = {
    title: string
    content: string
}

export type CreditCardJSON = {
    cardNumber: string
    cardHolderName: string
    expiryDate: string
    cvv: number
    billingAddress1: string
    billingAddress2?: string
    zipCode: string
    city: string
    state?: string
    country: string
}

export type IdentityJSON = {
    // PERSONAL DETAILS
    name: string
    email: string
    phoneNumber: string

    // ORGANIZATION DETAILS
    organizationName?: string
    address1?: string
    address2?: string
    zipCode?: string
    city?: string
    state?: string
    country?: string
    floor?: string
    county?: string
    poBox?: string

    // ID DETAILS
    socialSecurityNumber?: string
    passportNumber?: string
    licenseNumber?: string

    // WORK DETAILS
    companyName?: string
    occupation?: string

    // SOCIAL DETAILS
    x?: string
    linkedin?: string
    instagram?: string
    tiktok?: string
    facebook?: string
    github?: string
    other?: string
}