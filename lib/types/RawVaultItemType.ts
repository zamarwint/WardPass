export type LoginJSONRaw = {
  name: string;
  url?: string;
  username?: string;
  email: string;
  password: string;
  note?: string;
};

export type SecureNoteJSONRaw = {
  title: string;
  content: string;
};

export type CreditCardJSONRaw = {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: number;
  billingAddress1: string;
  billingAddress2?: string;
  zipCode: string;
  city: string;
  state?: string;
  country: string;
};

export type IdentityJSONRaw = {
  // PERSONAL DETAILS
  name: string;
  email: string;
  phoneNumber: string;

  // ORGANIZATION DETAILS
  organizationName?: string;
  address1?: string;
  address2?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  floor?: string;
  county?: string;
  poBox?: string;

  // ID DETAILS
  socialSecurityNumber?: string;
  passportNumber?: string;
  licenseNumber?: string;

  // WORK DETAILS
  companyName?: string;
  occupation?: string;

  // SOCIAL DETAILS
  x?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  github?: string;
  other?: string;
};
