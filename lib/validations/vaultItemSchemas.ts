import { z } from "zod";
import { passwordSchema } from "./authSchemas";

export const loginItemSchema = z.object({
  name: z
    .string()
    .min(3, "Name of login item must be at least 3 characters.")
    .max(50, "Name of login item must not exceed 50 characters."),
  url: z.url("Please enter a valid url."),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters.")
    .max(20, "Username must not exceed 20 characters.")
    .lowercase("Username must be lowercase letters."),
  email: z.email("Please enter a vaild email address."),
  password: passwordSchema,
  note: z
    .string()
    .max(
      100,
      "Notes for login items must not exceed 100 characters. Please create a secure note if you would like to write more.",
    ),
});

export const secureNoteSchema = z.object({
  title: z
    .string()
    .min(4, "Title of Secure note must be at least 4 characters.")
    .max(50, "Title of Secure note must not exceed 50 characters."),
  content: z
    .string()
    .min(10, "Secure note content must be at least 10 characters.")
    .max(2000, "Secure note content must not exceed 2000 characters."),
});

export const creditCardSchema = z.object({
  cardHolderName: z
    .string()
    .min(3, "Name of card holder must be at least 3 characters.")
    .max(50, "Name of card holder must not exceed 50 characters."),
  cardNumber: z.creditCard("Please enter a valid credit card number."),
  cvv: z
    .string()
    .min(3, "CVV must be 3 characters.")
    .max(3, "CVV must be 3 characters."),
  expiryDate: z.string("Please enter a valid date."),
  billingAddress1: z
    .string()
    .min(10, "Please enter a billing address.")
    .max(30, "Billing addresses must not exceed 30 characters."),
  billingAddress2: z
    .string()
    .max(30, "Billing addresses must not exceed 30 characters."),
  zipCode: z
    .string()
    .min(5, "Zip / Postal codes must be at least 5 characters.")
    .max(10, "Zip / Postal codes must not exceed 10 characters."),
  city: z
    .string()
    .min(3, "City names must be at least 3 characters.")
    .max(30, "City names must not exceed 30 characters."),
  state: z.string().max(30, "State names must not exceed 30 characters."),
  country: z
    .string()
    .min(4, "Country names must be at least 4 characters.")
    .max(40, "Country names must not exceed 40 characters."),
});

export const identitySchema = z.object({
  // PERSONAL DETAILS
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(50, "Name must not exceed 50 characters."),
  email: z.email("Please enter a vaild email address."),
  phoneNumber: z
    .number()
    .min(1000, "Phone numbers must be at least 4 digits long.")
    .max(999999999999999, "Phone numbers must not exceed 15 digits."),

  // LOCATION DETAILS
  address1: z
    .string()
    .max(30, "Addresses must not exceed 30 characters.")
    .optional(),
  address2: z.string().max(30, "Addresses must not exceed 30 characters.").optional(),
  zipCode: z
    .string()
    .max(7, "Zip / Postal codes must not exceed 7 characters.")
    .optional(),
  city: z.string().max(30, "City names must not exceed 30 characters.").optional(),
  state: z.string().max(30, "State names must not exceed 30 characters.").optional(),
  country: z.string().max(40, "Country names must not exceed 40 characters.").optional(),
  floor: z.string().max(20, "Floor names must not exceed 20 characters.").optional(),
  county: z.string().max(40, "County names must not exceed 40 characters.").optional(),
  poBox: z
    .number()
    .min(1, "PO Box must be between 1 to 6 digits.")
    .max(999999, "PO Box must not exceed 6 digits.")
    .optional(),

  // IDS (min max are different from zod strings)
  socialSecurityNumber: z
    .number()
    .min(100000000, "SSN must be 9 digits.")
    .max(999999999, "SSN must be 9 digits.")
    .optional(),
  passportNumber: z
    .number()
    .min(1, "Please enter a valid passport number.")
    .max(999999999, "Passport number must not exceed 9 digits.")
    .optional(),
  licenseNumber: z
    .number()
    .min(100000000000000, "Driver's license must be at least 15 digits.")
    .max(99999999999999999999, "Driver's license must not exceed 20 digits.")
    .optional(),

  // WORK DETAILS
  companyName: z.string("Please enter a valid company name.").max(20),
  occupation: z.string("Please enter a valid job title").max(50),

  // SOCIALS (must make them optional)
  x: z.url("Please enter a valid X url.").or(z.literal("")).optional(),
  linkedin: z
    .url("Please enter a valid LinkedIn url.")
    .or(z.literal(""))
    .optional(),
  instagram: z
    .url("Please enter a valid Instagram url.")
    .or(z.literal(""))
    .optional(),
  tiktok: z
    .url("Please enter a valid TikTok url.")
    .or(z.literal(""))
    .optional(),
  facebook: z
    .url("Please enter a valid Facebook url.")
    .or(z.literal(""))
    .optional(),
  github: z
    .url("Please enter a valid GitHub url.")
    .or(z.literal(""))
    .optional(),
  other: z.url("Please enter a valid url.").or(z.literal("")).optional(),
});
