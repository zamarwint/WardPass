"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/PasswordInput";
import { useState } from "react";
import { Loader2Icon, PenIcon } from "lucide-react";
import { CreditCardJSON } from "@/lib/types/VaultItemType";
import { useUpdateVaultItem } from "@/lib/mutations/CoreUpdateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export default function UpdateCreditCardItem({ open, onOpenChange, creditCardItem }: { open: boolean, onOpenChange: (open: boolean) => void, creditCardItem: CreditCardJSON }) {
    const [cardHolderName, setCardHolderName] = useState<string>(creditCardItem.cardHolderName)
    const [cardNumber, setCardNumber] = useState<string>(creditCardItem.cardNumber)
    const [cvv, setCvv] = useState<string>(creditCardItem.cvv.toString())
    const [expiryDate, setExpiryDate] = useState<string>(creditCardItem.expiryDate)
    const [billingAddress1, setBillingAddress1] = useState<string>(creditCardItem.billingAddress1)
    const [billingAddress2, setBillingAddress2] = useState<string>(creditCardItem.billingAddress2!)
    const [zipCode, setZipCode] = useState<string>(creditCardItem.zipCode)
    const [city, setCity] = useState<string>(creditCardItem.city)
    const [state, setState] = useState<string>(creditCardItem.state!)
    const [country, setCountry] = useState<string>(creditCardItem.country)

    const data = {
        cardHolderName, cardNumber, cvv: Number(cvv), expiryDate,
        billingAddress1, billingAddress2, zipCode, city, state, country
    };
    const { mutate, isPending } = useUpdateVaultItem(creditCardItem.id, creditCardItem.vaultId, data)

    const handleSubmit = () => {
        mutate();
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>Update Credit Card</DrawerTitle>
                    <DrawerDescription>Update {creditCardItem.cardHolderName}.</DrawerDescription>
                </DrawerHeader>

                <FieldGroup className="hidden lg:grid grid-cols-2 gap-4 p-4">
                    <Field>
                        <FieldLabel>Card Holder Name</FieldLabel>
                        <Input type="text" placeholder="Name of credit card item" id="name" value={cardHolderName} onChange={(e) => { setCardHolderName(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Card Number</FieldLabel>
                        <PasswordInput placeholder="Card Number" id="cardNumber" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value) }} className="h-12" maxLength={16} number={true} />
                    </Field>
                    <Field>
                        <FieldLabel>CVV</FieldLabel>
                        <PasswordInput placeholder="CVV" id="cvv" value={cvv} onChange={(e) => { setCvv(e.target.value) }} className="h-12" maxLength={3} number={true} />
                    </Field>

                    <Field>
                        <FieldLabel>Expiry Date</FieldLabel>
                        <PasswordInput placeholder="Expiry Date" id="expiryDate" value={expiryDate} onChange={(e) => { setExpiryDate(e.target.value) }} className="h-12" maxLength={5} number={true} />
                    </Field>

                    <Field>
                        <FieldLabel>Billing Address 1</FieldLabel>
                        <Input type="text" placeholder="Billing Address 1" id="billingAddress1" value={billingAddress1} onChange={(e) => { setBillingAddress1(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Billing Address 2</FieldLabel>
                        <Input type="text" placeholder="Billing Address 2" id="billingAddress2" value={billingAddress2} onChange={(e) => { setBillingAddress2(e.target.value) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Zip Code</FieldLabel>
                        <Input type="text" placeholder="Zip Code" id="zipCode" value={zipCode} onChange={(e) => { setZipCode(e.target.value) }} className="h-12" />
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
                    <Button disabled={isPending || !cardHolderName || !cardNumber || !cvv || !expiryDate || !billingAddress2 || !zipCode || !city || !country} onClick={handleSubmit} className="font-bold">
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <PenIcon className="size-4" />
                                <span>Update Credit Card</span>
                            </>
                        )}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}