import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import PasswordInput from "@/app/(main)/(auth)/_components/PasswordInput";
import type { LoginItem } from "@/lib/types/VaultItemType";

export default function LoginItem({ vaultItem }: { vaultItem: LoginItem }) {
    return (
        <Field className="w-full min-h-full flex flex-col items-start justify-start border-r border-muted px-8 py-8 gap-8 bg-background">
            <FieldSet>
                <FieldTitle className="text-primary text-6xl font-bold">{vaultItem.name}</FieldTitle>
                <FieldDescription className="text-muted-foreground text-xl">View your <span className="font-bold">{vaultItem.itemType}</span> details.</FieldDescription>
            </FieldSet>

            {/* grid grid-cols-1 md:grid-cols-2 gap-4 w-full */}
            <FieldGroup>
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input type="text" placeholder="Name of login item" id="name" value={vaultItem.name!} readOnly className="h-12" />
                </Field>
                <Field>
                    <FieldLabel>URL</FieldLabel>
                    <Input type="text" placeholder="https://example.com" id="url" value={vaultItem.url!} readOnly className="h-12" />
                </Field>
                <Field>
                    <FieldLabel>Username</FieldLabel>
                    <Input type="text" placeholder="Username" id="username" value={vaultItem.username!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" placeholder="Email" id="email" value={vaultItem.email!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Password</FieldLabel>
                    <PasswordInput disabled placeholder="Password" id="password" value={vaultItem.password!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Note</FieldLabel>
                    <Input type="text" placeholder="Note" id="note" value={vaultItem.note!} readOnly className="h-12" />
                </Field>

                <FieldSet>
                    <Field orientation="horizontal">
                        <FieldLabel>Created At</FieldLabel>
                        <FieldContent>
                            <FieldDescription>{vaultItem.createdAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                        <FieldLabel>Updated At</FieldLabel>
                        <FieldContent>
                            <FieldDescription>{vaultItem.updatedAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                        </FieldContent>
                    </Field>
                </FieldSet>
            </FieldGroup>
        </Field>
    )
}