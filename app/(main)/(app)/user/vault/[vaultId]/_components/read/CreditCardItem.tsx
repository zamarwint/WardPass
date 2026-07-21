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
import type { CreditCardItem } from "@/lib/types/VaultItemType";
import PasswordCopyInput from "../../../../_components/PasswordCopyInput";

export default function CreditCardItem({ creditCardItem }: { creditCardItem: CreditCardItem }) {
    return (
        <Field className="w-full min-h-full flex flex-col items-start justify-start border-r border-muted px-8 py-8 gap-8 bg-background overflow-y-scroll">
            <FieldSet>
                <FieldTitle className="text-primary text-6xl font-bold">{creditCardItem.cardHolderName}</FieldTitle>
                <FieldDescription className="text-muted-foreground text-xl">View your <span className="font-bold">{creditCardItem.itemType}</span> details.</FieldDescription>
            </FieldSet>

            <FieldGroup className="hidden lg:grid grid-cols-2 gap-4 w-full">
                <Field>
                    <FieldLabel>Card Holder Name</FieldLabel>
                    <Input type="text" placeholder="Card holder name" id="cardHolderName" value={creditCardItem.cardHolderName!} readOnly className="h-12" />
                </Field>
                <Field>
                    <FieldLabel>Card Number</FieldLabel>
                    <PasswordCopyInput placeholder="Card number" id="cardNumber" value={creditCardItem.cardNumber!} readOnly className="h-12" />
                </Field>
                <Field>
                    <FieldLabel>CVV</FieldLabel>
                    <PasswordCopyInput placeholder="CVV" id="cvv" value={creditCardItem.cvv!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Expiry Date</FieldLabel>
                    <PasswordCopyInput placeholder="Expiry Date" id="expiryDate" value={creditCardItem.expiryDate!.toString()} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Billing Address Line 1</FieldLabel>
                    <Input type="text" placeholder="Billing Address Line 1" id="billingAddress1" value={creditCardItem.billingAddress1!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Billing Address Line 2</FieldLabel>
                    <Input type="text" placeholder="Billing Address Line 2" id="billingAddress2" value={creditCardItem.billingAddress2!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Zip Code</FieldLabel>
                    <Input type="text" placeholder="Zip Code" id="zipCode" value={creditCardItem.zipCode!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>City</FieldLabel>
                    <Input type="text" placeholder="City" id="city" value={creditCardItem.city!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>State</FieldLabel>
                    <Input type="text" placeholder="State" id="state" value={creditCardItem.state!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Country</FieldLabel>
                    <Input type="text" placeholder="Country" id="country" value={creditCardItem.country!} readOnly className="h-12" />
                </Field>
            </FieldGroup>

            <FieldGroup>
                <FieldSeparator />
                <Field orientation="horizontal">
                    <FieldLabel>Created At</FieldLabel>
                    <FieldContent>
                        <FieldDescription>{creditCardItem.createdAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                    </FieldContent>
                </Field>
                <Field orientation="horizontal">
                    <FieldLabel>Updated At</FieldLabel>
                    <FieldContent>
                        <FieldDescription>{creditCardItem.updatedAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                    </FieldContent>
                </Field>
            </FieldGroup>
        </Field>
    )
}