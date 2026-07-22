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
import PasswordCopyInput from "../../../../_components/PasswordCopyInput";
import { VaultItem } from "@/lib/types/VaultType";

export default function LoginItem({ loginItem }: { loginItem: VaultItem }) {
    return (
        <Field className="w-full min-h-full flex flex-col items-start justify-start border-r border-muted px-8 py-8 gap-8 bg-background overflow-y-scroll">
            <FieldSet>
                <FieldTitle className="text-primary text-6xl font-bold">{JSON.parse(loginItem.encryptedData!).name}</FieldTitle>
                <FieldDescription className="text-muted-foreground text-xl">View your <span className="font-bold">{loginItem.itemType}</span> details.</FieldDescription>
            </FieldSet>

            <FieldGroup className="hidden lg:grid grid-cols-2 gap-4 w-full">
                <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input type="text" placeholder="Name of login item" id="name" value={JSON.parse(loginItem.encryptedData!).name!} readOnly className="h-12" />
                </Field>
                <Field>
                    <FieldLabel>URL</FieldLabel>
                    <Input type="text" placeholder="https://example.com" id="url" value={JSON.parse(loginItem.encryptedData!).url!} readOnly className="h-12" />
                </Field>
                <Field>
                    <FieldLabel>Username</FieldLabel>
                    <Input type="text" placeholder="Username" id="username" value={JSON.parse(loginItem.encryptedData!).username!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" placeholder="Email" id="email" value={JSON.parse(loginItem.encryptedData!).email!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Password</FieldLabel>
                    <PasswordCopyInput placeholder="Password" id="password" value={JSON.parse(loginItem.encryptedData!).password!} readOnly className="h-12" />
                </Field>

                <Field>
                    <FieldLabel>Note</FieldLabel>
                    <Input type="text" placeholder="Note" id="note" value={JSON.parse(loginItem.encryptedData!).note!} readOnly className="h-12" />
                </Field>
            </FieldGroup>

            <FieldGroup>
                <FieldSeparator />
                <Field orientation="horizontal">
                    <FieldLabel>Created At</FieldLabel>
                    <FieldContent>
                        <FieldDescription>{loginItem.createdAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                    </FieldContent>
                </Field>
                <Field orientation="horizontal">
                    <FieldLabel>Updated At</FieldLabel>
                    <FieldContent>
                        <FieldDescription>{loginItem.updatedAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                    </FieldContent>
                </Field>
            </FieldGroup>
        </Field>
    )
}