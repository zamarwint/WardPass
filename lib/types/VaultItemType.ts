import { VaultItem } from "./VaultType";

// Vault Item JSON Types with the VaultItem Type attached.
export type LoginJSON = VaultItem & {
  name: string;
  url?: string;
  username?: string;
  email: string;
  password: string;
  note?: string;
};

export type SecureNoteJSON = VaultItem & {
  title: string;
  content: string;
};

export type CreditCardJSON = VaultItem & {
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

export type IdentityJSON = VaultItem & {
  // PERSONAL DETAILS
  name: string;
  email: string;
  phoneNumber: number;

  // LOCATION DETAILS
  address1?: string;
  address2?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  floor?: string;
  county?: string;
  poBox?: number;

  // ID DETAILS
  socialSecurityNumber?: number;
  passportNumber?: number;
  licenseNumber?: number;

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
