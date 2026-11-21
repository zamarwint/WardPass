"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2Icon, PlusIcon } from "lucide-react";
import { PasswordInput } from "@/components/PasswordInput";
import { VaultItemType } from "@/lib/types/VaultType";
import { useCreateVaultItem } from "@/lib/mutations/CoreCreateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CreditCardJSONRaw } from "@/lib/types/RawVaultItemType";
import { creditCardSchema } from "@/lib/validations/vaultItemSchemas";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateCreditCardItem({ open, onOpenChange, vaultId }: { open: boolean, onOpenChange: (open: boolean) => void, vaultId: string }) {
    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof creditCardSchema>>({
        resolver: zodResolver(creditCardSchema),
        mode: "onChange",
        defaultValues: {
            cardHolderName: "",
            cardNumber: "",
            cvv: "",
            expiryDate: "",
            billingAddress1: "",
            billingAddress2: "",
            zipCode: "",
            city: "",
            state: "",
            country: ""
        }
    })

    const { mutate, isPending } = useCreateVaultItem<CreditCardJSONRaw>(
        vaultId,
        VaultItemType.CREDIT_CARD,
        () => {
            form.reset();
            onOpenChange(false);
        }
    );

    {/* SUBMISSION */}
    const onSubmit = (values: z.infer<typeof creditCardSchema>) => {
        mutate({
            ...values,
            cvv: Number(values.cvv),
            expiryDate: String(values.expiryDate),
        });
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>Create Credit Card Item</DrawerTitle>
                    <DrawerDescription>Create a new credit card item.</DrawerDescription>
                </DrawerHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 size-full p-4">
                    <FieldGroup className="grid grid-cols-2 gap-4">
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
                        <Button type="submit" className="font-bold" disabled={isPending || form.formState.isSubmitting}>
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
                </form>
            </DrawerContent>
        </Drawer>
    )
}