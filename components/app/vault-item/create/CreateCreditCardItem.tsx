"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { VaultItemType } from "@/lib/types/VaultType";
import { useCreateVaultItem } from "@/lib/mutations/CoreCreateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export default function CreateCreditCardItem({ open, onOpenChange, vaultId }: { open: boolean, onOpenChange: (open: boolean) => void, vaultId: string }) {
    const [cardHolderName, setCardHolderName] = useState<string>("")
    const [cardNumber, setCardNumber] = useState<string>("")
    const [cvv, setCvv] = useState<string>("")
    const [expiryDate, setExpiryDate] = useState<string>("")
    const [billingAddress1, setBillingAddress1] = useState<string>("")
    const [billingAddress2, setBillingAddress2] = useState<string>("")
    const [zipCode, setZipCode] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [state, setState] = useState<string>("")
    const [country, setCountry] = useState<string>("")

    const data = {
        cardHolderName, cardNumber, cvv: Number(cvv), expiryDate,
        billingAddress1, billingAddress2, zipCode, city, state, country
    };
    const { mutate, isPending } = useCreateVaultItem(vaultId, data, VaultItemType.CREDIT_CARD);

    const handleSubmit = () => {
        mutate();

        // EMPTY VALUES
        setCardHolderName("");
        setCardNumber("");
        setCvv("");
        setExpiryDate("");
        setBillingAddress1("");
        setBillingAddress2("");
        setZipCode("");
        setCity("");
        setState("");
        setCountry("");
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>Create Credit Card Item</DrawerTitle>
                    <DrawerDescription>Create a new credit card item.</DrawerDescription>
                </DrawerHeader>

                <FieldGroup className="grid grid-cols-2 gap-4 p-4">
                    <Field>
                        <FieldLabel>Card Holder Name</FieldLabel>
                        <Input type="text" placeholder="Name of credit card item" id="name" value={cardHolderName} onChange={(e) => { setCardHolderName(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Card Number</FieldLabel>
                        <PasswordInput placeholder="1234 5678 9012 3456" id="cardNumber" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value) }} className="h-12" maxLength={16} number={true} />
                    </Field>
                    <Field>
                        <FieldLabel>CVV</FieldLabel>
                        <PasswordInput placeholder="123" id="cvv" value={cvv} onChange={(e) => { setCvv(e.target.value) }} className="h-12" maxLength={3} number={true} />
                    </Field>

                    <Field>
                        <FieldLabel>Expiry Date</FieldLabel>
                        <PasswordInput placeholder="12/24" id="expiryDate" value={expiryDate} onChange={(e) => { setExpiryDate(e.target.value) }} className="h-12" maxLength={5} number={true} />
                    </Field>

                    <Field>
                        <FieldLabel>Billing Address 1</FieldLabel>
                        <Input type="text" placeholder="Address line 1" id="billingAddress1" value={billingAddress1} onChange={(e) => { setBillingAddress1(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Billing Address 2</FieldLabel>
                        <Input type="text" placeholder="Address line 2" id="billingAddress2" value={billingAddress2} onChange={(e) => { setBillingAddress2(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Zip Code</FieldLabel>
                        <Input type="text" placeholder="12345" id="zipCode" value={zipCode} onChange={(e) => { setZipCode(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>City</FieldLabel>
                        <Input type="text" placeholder="City" id="city" value={city} onChange={(e) => { setCity(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>State</FieldLabel>
                        <Input type="text" placeholder="State" id="state" value={state} onChange={(e) => { setState(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Country</FieldLabel>
                        <Input type="text" placeholder="Country" id="country" value={country} onChange={(e) => { setCountry(e.target.value) }} className="h-12" />
                    </Field>
                </FieldGroup>

                <DrawerFooter className="flex flex-row">
                    <DrawerClose>Cancel</DrawerClose>
                    <Button onClick={handleSubmit} className="font-bold" disabled={isPending || !cardHolderName || !cardNumber || !cvv || !expiryDate || !billingAddress1 || !zipCode || !city || !country}>
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Adding...</span>
                            </>
                        ) : (
                            <>
                                <PlusIcon className="size-4" />
                                <span>Add Credit Card</span>
                            </>
                        )}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}