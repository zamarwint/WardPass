import { Vault, LoginItem, SecureNoteItem, CreditCardItem, Identity, VaultItem } from "./dummyModels";
import { Briefcase, CreditCard, User } from "lucide-react";

// TEST VAULES
export const vaults: Vault[] = [
    {
        id: 0,
        name: "Personal",
        icon: User
    },
    {
        id: 0,
        name: "Work",
        icon: Briefcase
    },
    {
        id: 0,
        name: "Finance",
        icon: CreditCard
    },
]

export const googleAccount: LoginItem = {
    ...vaults[0],
    username: "johndoe@gmail.com",
    password: "913213219329312",
    url: "http://google.com",
    note: "My google account."
}

export const groceriesList: SecureNoteItem = {
    ...vaults[0],
    title: "Groceries List",
    content: "\nNeed to buy milk, eggs, and sausages."
}

export const capitolOneCard: CreditCardItem = {
    ...vaults[0],
    cardNumber: "3231232132132112",
    cardHolderName: "John Doe",
    expiryDate: "12/25",
    cvv: "123",
    billingAddress: "123 Main St",
    country: "USA"
}