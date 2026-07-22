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
    FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react"
import updateVaultItem from "@/app/actions/vault-item/updateVaultItem";
import PasswordCopyInput from "../../../../_components/PasswordCopyInput";
import { useVaultStore } from "@/stores/vault";
import { encryptData } from "@/lib/crypto/aes";
import { VaultItem } from "@/lib/types/VaultType";

export default function UpdateIdentityItem({ identityItem, cancel }: { identityItem: VaultItem, cancel: () => void }) {
    const queryClient = useQueryClient();

    const [name, setName] = useState<string>(JSON.parse(identityItem.encryptedData!).name)
    const [email, setEmail] = useState<string>(JSON.parse(identityItem.encryptedData!).email)
    const [phoneNumber, setPhoneNumber] = useState<string>(JSON.parse(identityItem.encryptedData!).phoneNumber)

    // Organization Details
    const [organizationName, setOrganizationName] = useState<string>(JSON.parse(identityItem.encryptedData!).organizationName!)
    const [address1, setAddress1] = useState<string>(JSON.parse(identityItem.encryptedData!).address1!)
    const [address2, setAddress2] = useState<string>(JSON.parse(identityItem.encryptedData!).address2 as string)
    const [city, setCity] = useState<string>(JSON.parse(identityItem.encryptedData!).city!)
    const [state, setState] = useState<string>(JSON.parse(identityItem.encryptedData!).state as string)
    const [zipCode, setZipCode] = useState<string>(JSON.parse(identityItem.encryptedData!).zipCode!)
    const [country, setCountry] = useState<string>(JSON.parse(identityItem.encryptedData!).country!)
    const [floor, setFloor] = useState<string>(JSON.parse(identityItem.encryptedData!).floor as string)
    const [county, setCounty] = useState<string>(JSON.parse(identityItem.encryptedData!).county as string)
    const [poBox, setPoBox] = useState<string>(JSON.parse(identityItem.encryptedData!).poBox as string)

    // ID Details
    const [socialSecurityNumber, setSocialSecurityNumber] = useState<string>(JSON.parse(identityItem.encryptedData!).socialSecurityNumber as string)
    const [passportNumber, setPassportNumber] = useState<string>(JSON.parse(identityItem.encryptedData!).passportNumber as string)
    const [licenseNumber, setLicenseNumber] = useState<string>(JSON.parse(identityItem.encryptedData!).licenseNumber as string)

    // Work Details
    const [companyName, setCompanyName] = useState<string>(JSON.parse(identityItem.encryptedData!).companyName as string)
    const [occupation, setOccupation] = useState<string>(JSON.parse(identityItem.encryptedData!).occupation as string)

    // Social Details
    const [x, setX] = useState<string>(JSON.parse(identityItem.encryptedData!).x as string)
    const [linkedin, setLinkedin] = useState<string>(JSON.parse(identityItem.encryptedData!).linkedin as string)
    const [instagram, setInstagram] = useState<string>(JSON.parse(identityItem.encryptedData!).instagram as string)
    const [tiktok, setTiktok] = useState<string>(JSON.parse(identityItem.encryptedData!).tiktok as string)
    const [facebook, setFacebook] = useState<string>(JSON.parse(identityItem.encryptedData!).facebook as string)
    const [github, setGithub] = useState<string>(JSON.parse(identityItem.encryptedData!).github as string)
    const [other, setOther] = useState<string>(JSON.parse(identityItem.encryptedData!).other as string)

    const { mutate, isPending } = useMutation({
        mutationFn: () => {
            const vaultKey = useVaultStore.getState().getVaultKey();
            const payload = JSON.stringify({ name, email, phoneNumber, organizationName, address1, address2, city, state, zipCode, country, floor, county, poBox, socialSecurityNumber, passportNumber, licenseNumber, companyName, occupation, x, linkedin, instagram, tiktok, facebook, github, other });
            const { ciphertext, iv } = encryptData(payload, vaultKey);
            return updateVaultItem({ id: identityItem.id as string, vaultId: identityItem.vaultId as string, encryptedData: ciphertext, iv });
        }, onMutate: () => {
            toast.loading("Updating identity item...")
        },
        onSuccess: () => {
            toast.dismiss();
            toast.success("Identity item updated successfully");
            cancel();
            queryClient.invalidateQueries({
                queryKey: ["vaultItems", identityItem.vaultId],
                refetchType: 'active'
            });
        },
        onError: (err) => {
            toast.dismiss();
            toast.error("Failed to update identity item." + err)
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
                    <FieldLegend>Update Identity</FieldLegend>
                    <FieldDescription>Update {JSON.parse(identityItem.encryptedData!).name}.</FieldDescription>
                </FieldSet>

                <FieldGroup className="hidden lg:flex flex-col gap-4 w-full">
                    {/* Personal details */}
                    <FieldTitle className="text-2xl font-semibold">Personal Details</FieldTitle>
                    <FieldSeparator />

                    <FieldGroup className="hidden lg:grid grid-cols-2">
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Input type="text" placeholder="Name of identity item" id="name" value={name} onChange={(e) => { setName(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input type="email" placeholder="Email" id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Phone Number</FieldLabel>
                            <Input type="tel" placeholder="+1 234 567 890" id="phoneNumber" value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value) }} className="h-12" />
                        </Field>
                    </FieldGroup>

                    {/* Organization details */}
                    <FieldTitle className="text-2xl font-semibold pt-8">Organization Details</FieldTitle>
                    <FieldSeparator />

                    <FieldGroup className="hidden lg:grid grid-cols-2">
                        <Field>
                            <FieldLabel>Organization Name</FieldLabel>
                            <Input type="text" placeholder="Organization Name" id="organizationName" value={organizationName} onChange={(e) => { setOrganizationName(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Address Line 1</FieldLabel>
                            <Input type="text" placeholder="Address Line 1" id="address1" value={address1} onChange={(e) => { setAddress1(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Address Line 2</FieldLabel>
                            <Input type="text" placeholder="Address Line 2" id="address2" value={address2} onChange={(e) => { setAddress2(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>ZIP Code</FieldLabel>
                            <Input type="text" placeholder="ZIP Code" id="zipCode" value={zipCode} onChange={(e) => { setZipCode(e.target.value) }} className="h-12" />
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
                        <Field>
                            <FieldLabel>Floor</FieldLabel>
                            <Input type="text" placeholder="Floor" id="floor" value={floor} onChange={(e) => { setFloor(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>County</FieldLabel>
                            <Input type="text" placeholder="County" id="county" value={county} onChange={(e) => { setCounty(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>PO Box</FieldLabel>
                            <Input type="text" placeholder="PO Box" id="poBox" value={poBox} onChange={(e) => { setPoBox(e.target.value) }} className="h-12" />
                        </Field>
                    </FieldGroup>

                    {/* ID details */}
                    <FieldTitle className="text-2xl font-semibold pt-8">ID Details</FieldTitle>
                    <FieldSeparator />

                    <FieldGroup className="hidden lg:grid grid-cols-2">
                        <Field>
                            <FieldLabel>Social Security Number</FieldLabel>
                            <PasswordCopyInput placeholder="Social Security Number" id="socialSecurityNumber" value={socialSecurityNumber} onChange={(e) => { setSocialSecurityNumber(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Passport Number</FieldLabel>
                            <PasswordCopyInput placeholder="Passport Number" id="passportNumber" value={passportNumber} onChange={(e) => { setPassportNumber(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>License Number</FieldLabel>
                            <PasswordCopyInput placeholder="License Number" id="licenseNumber" value={licenseNumber} onChange={(e) => { setLicenseNumber(e.target.value) }} className="h-12" />
                        </Field>
                    </FieldGroup>

                    {/* Work details */}
                    <FieldTitle className="text-2xl font-semibold pt-8">Work Details</FieldTitle>
                    <FieldSeparator />

                    <FieldGroup className="hidden lg:grid grid-cols-2">
                        <Field>
                            <FieldLabel>Company Name</FieldLabel>
                            <Input type="text" placeholder="Company Name" id="companyName" value={companyName} onChange={(e) => { setCompanyName(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Occupation</FieldLabel>
                            <Input type="text" placeholder="Occupation" id="occupation" value={occupation} onChange={(e) => { setOccupation(e.target.value) }} className="h-12" />
                        </Field>
                    </FieldGroup>

                    {/* Social details */}
                    <FieldTitle className="text-2xl font-semibold pt-8">Social Details</FieldTitle>
                    <FieldSeparator />

                    <FieldGroup className="hidden lg:grid grid-cols-2">
                        <Field>
                            <FieldLabel>X</FieldLabel>
                            <Input type="text" placeholder="X" id="x" value={x} onChange={(e) => { setX(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Linkedin</FieldLabel>
                            <Input type="text" placeholder="Linkedin" id="linkedin" value={linkedin} onChange={(e) => { setLinkedin(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Instagram</FieldLabel>
                            <Input type="text" placeholder="Instagram" id="instagram" value={instagram} onChange={(e) => { setInstagram(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Tiktok</FieldLabel>
                            <Input type="text" placeholder="Tiktok" id="tiktok" value={tiktok} onChange={(e) => { setTiktok(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Facebook</FieldLabel>
                            <Input type="text" placeholder="Facebook" id="facebook" value={facebook} onChange={(e) => { setFacebook(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Github</FieldLabel>
                            <Input type="text" placeholder="Github" id="github" value={github} onChange={(e) => { setGithub(e.target.value) }} className="h-12" />
                        </Field>
                        <Field>
                            <FieldLabel>Other</FieldLabel>
                            <Input type="text" placeholder="Other" id="other" value={other} onChange={(e) => { setOther(e.target.value) }} className="h-12" />
                        </Field>
                    </FieldGroup>
                </FieldGroup>

                <FieldSeparator />
                <Field orientation="horizontal">
                    <Button variant="outline" onClick={cancel}>Cancel</Button>
                    <Button disabled={isPending || !name || !email || !phoneNumber || !organizationName || !address1 || !zipCode || !city || !country || (name === JSON.parse(identityItem.encryptedData!).name && email === JSON.parse(identityItem.encryptedData!).email && phoneNumber === JSON.parse(identityItem.encryptedData!).phoneNumber && organizationName === JSON.parse(identityItem.encryptedData!).organizationName && address1 === JSON.parse(identityItem.encryptedData!).address1 && city === JSON.parse(identityItem.encryptedData!).city && zipCode === JSON.parse(identityItem.encryptedData!).zipCode && country === JSON.parse(identityItem.encryptedData!).country)} onClick={handleSubmit} className="font-bold">
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <PenIcon className="size-4" />
                                <span>Update Identity</span>
                            </>
                        )}
                    </Button>
                </Field>
            </Field>
        </motion.div>
    )
}