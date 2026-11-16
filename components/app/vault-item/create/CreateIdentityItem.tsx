"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2Icon, PlusIcon } from "lucide-react";
import { VaultItemType } from "@/lib/types/VaultType";
import { useCreateVaultItem } from "@/lib/mutations/CoreCreateMutations";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { identitySchema } from "@/lib/validations/vaultItemSchemas";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdentityJSONRaw } from "@/lib/types/RawVaultItemType";

export default function CreateIdentityItem({ open, onOpenChange, vaultId }: { open: boolean, onOpenChange: (open: boolean) => void, vaultId: string }) {
    // 2. Create form instance with resolver
    const form = useForm<z.infer<typeof identitySchema>>({
        resolver: zodResolver(identitySchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: undefined,
            address1: "",
            address2: "",
            zipCode: "",
            city: "",
            state: "",
            country: "",
            floor: "",
            county: "",
            poBox: undefined,
            socialSecurityNumber: undefined,
            passportNumber: undefined,
            licenseNumber: undefined,
            companyName: "",
            occupation: "",
            x: "",
            linkedin: "",
            instagram: "",
            tiktok: "",
            facebook: "",
            github: "",
            other: "",
        }
    })

    const data: IdentityJSONRaw = {
        name: form.getValues().name,
        email: form.getValues().email,
        phoneNumber: form.getValues().phoneNumber,
        address1: form.getValues().address1,
        address2: form.getValues().address2,
        zipCode: form.getValues().zipCode,
        city: form.getValues().city,
        state: form.getValues().state,
        country: form.getValues().country,
        floor: form.getValues().floor,
        county: form.getValues().county,
        poBox: form.getValues().poBox,
        socialSecurityNumber: form.getValues().socialSecurityNumber,
        passportNumber: form.getValues().passportNumber,
        licenseNumber: form.getValues().licenseNumber,
        companyName: form.getValues().companyName,
        occupation: form.getValues().occupation,
        x: form.getValues().x,
        linkedin: form.getValues().linkedin,
        instagram: form.getValues().instagram,
        tiktok: form.getValues().tiktok,
        facebook: form.getValues().facebook,
        github: form.getValues().github,
        other: form.getValues().other
    };
    const { mutate, isPending } = useCreateVaultItem(vaultId, data, VaultItemType.IDENTITY);

    const onSubmit = () => {
        mutate();

        form.setValues({
            name: "",
            email: "",
            phoneNumber: undefined,
            address1: "",
            address2: "",
            zipCode: "",
            city: "",
            state: "",
            country: "",
            floor: "",
            county: "",
            poBox: undefined,
            socialSecurityNumber: undefined,
            passportNumber: undefined,
            licenseNumber: undefined,
            companyName: "",
            occupation: "",
            x: "",
            linkedin: "",
            instagram: "",
            tiktok: "",
            facebook: "",
            github: "",
            other: "",
        })
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-[50vw]">
                <DrawerHeader>
                    <DrawerTitle>Create Identity Item</DrawerTitle>
                    <DrawerDescription>Create a new Identity item.</DrawerDescription>
                </DrawerHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 size-full p-4 overflow-y-scroll">
                    <FieldGroup className="flex flex-col gap-4 overflow-y-scroll">
                        {/* Personal details */}

                        <FieldTitle className="text-2xl font-semibold">Personal Details</FieldTitle>

                        <FieldGroup className="hidden lg:grid grid-cols-2">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">Name</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Name of identity item"
                                            id="name"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Email"
                                            id="email"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="phoneNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Phone Number</FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            value={field.value ?? ""}
                                            type="tel"
                                            placeholder="+1 234 567 890"
                                            id="phoneNumber"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* Location details */}
                        <FieldTitle className="text-2xl font-semibold pt-8">Location Details</FieldTitle>

                        <FieldGroup className="hidden lg:grid grid-cols-2">
                            <Controller
                                name="address1"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="address1">Address 1</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Address line 1"
                                            id="address1"
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
                                name="address2"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="address2">Address 2</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Address line 2"
                                            id="address2"
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

                            <Controller
                                name="floor"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="floor">Floor</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Floor"
                                            id="floor"
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
                                name="county"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="county">County</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="County"
                                            id="county"
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
                                name="poBox"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="floor">PO Box</FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            value={field.value ?? ""}
                                            type="number"
                                            placeholder="PO Box"
                                            id="pobox"
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

                        {/* ID details */}
                        <FieldTitle className="text-2xl font-semibold pt-8">ID Details</FieldTitle>

                        <FieldGroup className="hidden lg:grid grid-cols-2">
                            <Controller
                                name="socialSecurityNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="socialSecurityNumber">Social Security Number</FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            value={field.value ?? ""}
                                            type="number"
                                            placeholder="SSN"
                                            id="socialSecurityNumber"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="passportNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="passportNumber">Passport Number</FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            value={field.value ?? ""}
                                            type="number"
                                            placeholder="Passport Number"
                                            id="passportNumber"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="licenseNumber"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="licenseNumber">License Number</FieldLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            value={field.value ?? ""}
                                            type="number"
                                            placeholder="License Number"
                                            id="licenseNumber"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* Work details */}
                        <FieldTitle className="text-2xl font-semibold pt-8">Work Details</FieldTitle>

                        <FieldGroup className="hidden lg:grid grid-cols-2">
                            <Controller
                                name="companyName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Company Name"
                                            id="companyName"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="occupation"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="occupation">Occupation</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Occupation"
                                            id="occupation"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {/* Social details */}
                        <FieldTitle className="text-2xl font-semibold pt-8">Social Details</FieldTitle>

                        <FieldGroup className="hidden lg:grid grid-cols-2">
                            <Controller
                                name="x"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>X</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="https://x.com/johndoe"
                                            id="x"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="linkedin"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Linkedin</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="https://linkedin.com/in/johndoe"
                                            id="linkedin"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="instagram"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Instagram</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="https://instagram.com/johndoe"
                                            id="instagram"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="tiktok"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>TikTok</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="https://tiktok.com/johndoe"
                                            id="tiktok"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="facebook"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Facebook</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="https://facebook.com/johndoe"
                                            id="facebook"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="github"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Github</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="https://github.com/johndoe"
                                            id="github"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="other"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Other URL</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="https://example.com"
                                            id="other"
                                            aria-invalid={fieldState.invalid}
                                            className="h-12"
                                            autoComplete="off"
                                            maxLength={31}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
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
                                    <span>Add Identity</span>
                                </>
                            )}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    )
}