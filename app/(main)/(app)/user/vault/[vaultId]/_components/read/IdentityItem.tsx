import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

export default function IdentityItem({ identityItem }: { identityItem: any }) {
    return (
        <Field className="w-full min-h-full flex flex-col items-start justify-start border-r border-muted px-8 py-8 gap-8 bg-background overflow-y-scroll">
            <FieldSet>
                <FieldTitle className="text-primary text-6xl font-bold">{identityItem.name}</FieldTitle>
                <FieldDescription className="text-muted-foreground text-xl">View your <span className="font-bold">{identityItem.itemType}</span> details.</FieldDescription>
            </FieldSet>

            <FieldGroup className="hidden lg:flex flex-col gap-4 w-full">
                {/* Personal Details */}
                <FieldTitle className="text-2xl font-semibold">Personal Details</FieldTitle>
                <FieldSeparator />
                <FieldGroup className="hidden lg:grid grid-cols-2">
                    <Field>
                        <FieldLabel>Name</FieldLabel>
                        <Input type="text" placeholder="Name of identity item" id="name" value={identityItem.name} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input type="email" placeholder="Email" id="email" value={identityItem.email} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Phone Number</FieldLabel>
                        <Input type="tel" placeholder="+1 234 567 890" id="phoneNumber" value={identityItem.phoneNumber} readOnly className="h-12" />
                    </Field>
                </FieldGroup>

                {/* Organization Details */}
                <FieldTitle className="text-2xl font-semibold pt-8">Organization Details</FieldTitle>
                <FieldSeparator />
                <FieldGroup className="hidden lg:grid grid-cols-2">
                    <Field>
                        <FieldLabel>Organization Name</FieldLabel>
                        <Input type="text" placeholder="Organization Name" id="organizationName" value={identityItem.organizationName} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Address Line 1</FieldLabel>
                        <Input type="text" placeholder="Address Line 1" id="address1" value={identityItem.address1} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Address Line 2</FieldLabel>
                        <Input type="text" placeholder="Address Line 2" id="address2" value={identityItem.address2} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>ZIP Code</FieldLabel>
                        <Input type="text" placeholder="ZIP Code" id="zipCode" value={identityItem.zipCode} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>City</FieldLabel>
                        <Input type="text" placeholder="City" id="city" value={identityItem.city} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>State</FieldLabel>
                        <Input type="text" placeholder="State" id="state" value={identityItem.state} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Country</FieldLabel>
                        <Input type="text" placeholder="Country" id="country" value={identityItem.country} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Floor</FieldLabel>
                        <Input type="text" placeholder="Floor" id="floor" value={identityItem.floor} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>County</FieldLabel>
                        <Input type="text" placeholder="County" id="county" value={identityItem.county} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>PO Box</FieldLabel>
                        <Input type="text" placeholder="PO Box" id="poBox" value={identityItem.poBox} readOnly className="h-12" />
                    </Field>
                </FieldGroup>

                {/* ID Details */}
                <FieldTitle className="text-2xl font-semibold pt-8">ID Details</FieldTitle>
                <FieldSeparator />
                <FieldGroup className="hidden lg:grid grid-cols-2">
                    <Field>
                        <FieldLabel>Social Security Number</FieldLabel>
                        <Input type="text" placeholder="Social Security Number" id="socialSecurityNumber" value={identityItem.socialSecurityNumber} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Passport Number</FieldLabel>
                        <Input type="text" placeholder="Passport Number" id="passportNumber" value={identityItem.passportNumber} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>License Number</FieldLabel>
                        <Input type="text" placeholder="License Number" id="licenseNumber" value={identityItem.licenseNumber} readOnly className="h-12" />
                    </Field>
                </FieldGroup>

                {/* Work details */}
                <FieldTitle className="text-2xl font-semibold pt-8">Work details</FieldTitle>
                <FieldSeparator />
                <FieldGroup className="hidden lg:grid grid-cols-2">
                    <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input type="text" placeholder="Company Name" id="companyName" value={identityItem.companyName} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Occupation</FieldLabel>
                        <Input type="text" placeholder="Occupation" id="occupation" value={identityItem.occupation} readOnly className="h-12" />
                    </Field>
                </FieldGroup>

                {/* Social details */}
                <FieldTitle className="text-2xl font-semibold pt-8">Social details</FieldTitle>
                <FieldSeparator />
                <FieldGroup className="hidden lg:grid grid-cols-2">
                    <Field>
                        <FieldLabel>X</FieldLabel>
                        <Input type="text" placeholder="X" id="x" value={identityItem.x} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Linkedin</FieldLabel>
                        <Input type="text" placeholder="Linkedin" id="linkedin" value={identityItem.linkedin} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Instagram</FieldLabel>
                        <Input type="text" placeholder="Instagram" id="instagram" value={identityItem.instagram} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Tiktok</FieldLabel>
                        <Input type="text" placeholder="Tiktok" id="tiktok" value={identityItem.tiktok} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Facebook</FieldLabel>
                        <Input type="text" placeholder="Facebook" id="facebook" value={identityItem.facebook} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Github</FieldLabel>
                        <Input type="text" placeholder="Github" id="github" value={identityItem.github} readOnly className="h-12" />
                    </Field>
                    <Field>
                        <FieldLabel>Other</FieldLabel>
                        <Input type="text" placeholder="Other" id="other" value={identityItem.other} readOnly className="h-12" />
                    </Field>
                </FieldGroup>
            </FieldGroup>

            <FieldGroup>
                <FieldSeparator />
                <Field orientation="horizontal">
                    <FieldLabel>Created At</FieldLabel>
                    <FieldContent>
                        <FieldDescription>{identityItem.createdAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                    </FieldContent>
                </Field>
                <Field orientation="horizontal">
                    <FieldLabel>Updated At</FieldLabel>
                    <FieldContent>
                        <FieldDescription>{identityItem.updatedAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                    </FieldContent>
                </Field>
            </FieldGroup>
        </Field>
    )
}