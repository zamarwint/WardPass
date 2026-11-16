"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/PasswordInput";
import { Loader2Icon, PenIcon } from "lucide-react";
import { CreditCardJSON } from "@/lib/types/VaultItemType";
import { useUpdateVaultItem } from "@/lib/mutations/CoreUpdateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CreditCardJSONRaw } from "@/lib/types/RawVaultItemType";
import { Controller, useForm } from "react-hook-form";
import { creditCardSchema } from "@/lib/validations/vaultItemSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

export default function UpdateCreditCardItem({ open, onOpenChange, creditCardItem }: { open: boolean, onOpenChange: (open: boolean) => void, creditCardItem: CreditCardJSON }) {
    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof creditCardSchema>>({
        resolver: zodResolver(creditCardSchema),
        mode: "onChange",
        defaultValues: {
            cardHolderName: creditCardItem.cardHolderName,
            cardNumber: creditCardItem.cardNumber,
            cvv: creditCardItem.cvv.toString(),
            expiryDate: creditCardItem.expiryDate,
            billingAddress1: creditCardItem.billingAddress1,
            billingAddress2: creditCardItem.billingAddress2,
            zipCode: creditCardItem.zipCode,
            city: creditCardItem.city,
            state: creditCardItem.state,
            country: creditCardItem.country
        }
    })

    const data: CreditCardJSONRaw = {
        cardHolderName: form.getValues().cardHolderName,
        cardNumber: form.getValues().cardNumber,
        cvv: Number(form.getValues().cvv),
        expiryDate: String(form.getValues().expiryDate),
        billingAddress1: form.getValues().billingAddress1,
        billingAddress2: form.getValues().billingAddress2,
        zipCode: form.getValues().zipCode,
        city: form.getValues().city,
        state: form.getValues().state,
        country: form.getValues().country
    };

    const { mutate, isPending } = useUpdateVaultItem(creditCardItem.id, creditCardItem.vaultId, data)

    const onSubmit = () => {
        mutate();
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>Update Credit Card</DrawerTitle>
                    <DrawerDescription>Update {creditCardItem.cardHolderName}.</DrawerDescription>
                </DrawerHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 size-full p-4">
                    <FieldGroup className="hidden lg:grid grid-cols-2 gap-4">
                        <Controller
                            name="cardHolderName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="cardHolderName">Card Holder Name</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Card Holder Name"
                                        id="cardHolderName"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="cardNumber"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="cardNumber">Card Number</FieldLabel>
                                    <PasswordInput
                                        {...field}
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        id="cardNumber"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="cvv"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="123"
                                        id="cvv"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="expiryDate"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="expiryDate">Expiry Date</FieldLabel>
                                    <Input
                                        {...field}
                                        type="month"
                                        placeholder="12/24"
                                        id="expiryDate"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="billingAddress1"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="billingAddress1">Billing Address 1</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Address line 1"
                                        id="billingAddress1"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="billingAddress2"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="billingAddress2">Billing Address 2</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Address line 2"
                                        id="billingAddress2"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="zipCode"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="zipCode">Zip Code</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="12345"
                                        id="zipCode"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="city"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="city">City</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="City"
                                        id="city"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="state"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="state">State</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="State"
                                        id="state"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="country"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="country">Country</FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Country"
                                        id="country"
                                        aria-invalid={fieldState.invalid}
                                        className="h-12"
                                        autoComplete="off"
                                        maxLength={50}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <DrawerFooter className="flex flex-row">
                        <DrawerClose>Cancel</DrawerClose>
                        <Button type="submit" disabled={isPending || form.formState.isSubmitting} className="font-bold">
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
                </form>
            </DrawerContent>
        </Drawer>
    )
}