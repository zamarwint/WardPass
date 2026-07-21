"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react"
import { CreditCardItem } from "@/lib/types/VaultItemType";
import updateCreditCard from "@/app/actions/credit-card/updateCreditCard";
import { PasswordInput } from "@/app/(main)/(auth)/_components/PasswordInput";

export default function UpdateCreditCardItem({ creditCardItem, cancel }: { creditCardItem: CreditCardItem, cancel: () => void }) {
    const queryClient = useQueryClient();

    const [cardHolderName, setCardHolderName] = useState<string>(creditCardItem.cardHolderName!)
    const [cardNumber, setCardNumber] = useState<string>(creditCardItem.cardNumber!)
    const [cvv, setCvv] = useState<number>(creditCardItem.cvv!)
    const [expiryDate, setExpiryDate] = useState<string>(creditCardItem.expiryDate!)
    const [billingAddress1, setBillingAddress1] = useState<string>(creditCardItem.billingAddress1!)
    const [billingAddress2, setBillingAddress2] = useState<string>(creditCardItem.billingAddress2!)
    const [zipCode, setZipCode] = useState<string>(creditCardItem.zipCode!)
    const [city, setCity] = useState<string>(creditCardItem.city!)
    const [state, setState] = useState<string>(creditCardItem.state!)
    const [country, setCountry] = useState<string>(creditCardItem.country!)

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => updateCreditCard({ id: creditCardItem.id as string, vaultId: creditCardItem.vaultId as string, cardHolderName, cardNumber, cvv, expiryDate, billingAddress1, billingAddress2, zipCode, city, state, country }),
        onMutate: () => {
            toast.loading("Updating credit card item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Credit card item updated successfully");
            cancel();
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", creditCardItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: () => {
            toast.dismiss();
            toast.error("Failed to update credit card item." + error?.message)
        }
    })

    const handleSubmit = () => {
        mutate();
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, x: 1000 },
                visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex w-screen h-screen items-center justify-center z-998 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
            <div className="flex w-full h-full bg-transparent backdrop-blur-sm opacity-100 cursor-pointer" onClick={cancel}></div>
            <Field className="size-full flex flex-col items-start justify-start border-r border-muted z-999 px-8 py-8 gap-8 bg-background overflow-y-scroll">
                <FieldSet>
                    <FieldLegend>Update Credit Card</FieldLegend>
                    <FieldDescription>Update {creditCardItem.cardHolderName}.</FieldDescription>
                </FieldSet>

                <FieldGroup className="hidden lg:grid grid-cols-2 gap-4 w-full">
                    <Field>
                        <FieldLabel>Card Holder Name</FieldLabel>
                        <Input type="text" placeholder="Name of credit card item" id="name" value={cardHolderName} onChange={(e) => { setCardHolderName(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Card Number</FieldLabel>
                        <PasswordInput placeholder="Card Number" id="cardNumber" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value) }} className="h-12" maxLength={16} />
                    </Field>
                    <Field>
                        <FieldLabel>CVV</FieldLabel>
                        <PasswordInput placeholder="CVV" id="cvv" value={cvv} onChange={(e) => { setCvv(Number(e.target.value)) }} className="h-12" maxLength={3} />
                    </Field>

                    <Field>
                        <FieldLabel>Expiry Date</FieldLabel>
                        <PasswordInput placeholder="Expiry Date" id="expiryDate" value={expiryDate} onChange={(e) => { setExpiryDate(e.target.value) }} className="h-12" maxLength={5} />
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

                <FieldSeparator />
                <Field orientation="horizontal">
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
                    <Button disabled={isPending || !cardHolderName || !cardNumber || !cvv || !expiryDate || !billingAddress2 || !zipCode || !city || !country || (cardHolderName == creditCardItem.cardHolderName && cardNumber == creditCardItem.cardNumber && cvv == creditCardItem.cvv && expiryDate == creditCardItem.expiryDate && billingAddress1 == creditCardItem.billingAddress1 && billingAddress2 == creditCardItem.billingAddress2 && zipCode == creditCardItem.zipCode && city == creditCardItem.city && state == creditCardItem.state && country == creditCardItem.country)} onClick={handleSubmit} className="font-bold">
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
                </Field>
            </Field>
        </motion.div>
    )
}