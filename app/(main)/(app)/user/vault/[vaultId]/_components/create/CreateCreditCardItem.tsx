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
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react"
import { useRouter } from "next/navigation";
import createCreditCard from "@/app/actions/credit-card/createCreditCard";

export default function CreateCreditCardItem({ vaultId, cancel }: { vaultId: string, cancel: () => void }) {
    const router = useRouter();
    const [cardHolderName, setCardHolderName] = useState<string>("")
    const [cardNumber, setCardNumber] = useState<string>("")
    const [cvv, setCvv] = useState<number>(0)
    const [expiryDate, setExpiryDate] = useState<string>("")
    const [billingAddress1, setBillingAddress1] = useState<string>("")
    const [billingAddress2, setBillingAddress2] = useState<string>("")
    const [zipCode, setZipCode] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [state, setState] = useState<string>("")
    const [country, setCountry] = useState<string>("")

    const { mutate, error, isPending } = useMutation({
        mutationFn: () => createCreditCard({ vaultId, cardHolderName, cardNumber, cvv, expiryDate, billingAddress1, billingAddress2, zipCode, city, state, country }),
        onMutate: () => {
            toast.loading("Adding credit card item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Credit card item added successfully");
            cancel();
            router.refresh();
        },
        onError: () => {
            toast.dismiss();
            toast.error("Failed to add credit card item." + error?.message)
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
            <div className="flex w-full h-full bg-transparent backdrop-blur-sm opacity-100"></div>
            <Field className="size-full flex flex-col items-center justify-center border-r border-muted z-999 px-8 gap-8 bg-background overflow-y-scroll">
                <FieldSet>
                    <FieldLegend>Create Credit Card Item</FieldLegend>
                    <FieldDescription>Create a new credit card item.</FieldDescription>
                </FieldSet>

                <FieldGroup className="hidden lg:grid grid-cols-2 gap-4 w-full">
                    <Field>
                        <FieldLabel>Card Holder Name</FieldLabel>
                        <Input type="text" placeholder="Name of credit card item" id="name" value={cardHolderName} onChange={(e) => { setCardHolderName(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Card Number</FieldLabel>
                        <Input type="text" placeholder="1234 5678 9012 3456" id="cardNumber" value={cardNumber} onChange={(e) => { setCardNumber(e.target.value) }} className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>CVV</FieldLabel>
                        <Input type="text" placeholder="123" id="cvv" value={cvv} onChange={(e) => { setCvv(Number(e.target.value)) }} className="h-12" />
                    </Field>

                    <Field>
                        <FieldLabel>Expiry Date</FieldLabel>
                        <Input type="text" placeholder="12/24" id="expiryDate" value={expiryDate} onChange={(e) => { setExpiryDate(e.target.value) }} className="h-12" />
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

                <FieldSeparator />
                <Field orientation="horizontal">
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
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
                </Field>
            </Field>
        </motion.div>
    )
}