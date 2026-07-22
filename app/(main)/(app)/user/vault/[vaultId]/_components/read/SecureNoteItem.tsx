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
import { Textarea } from "@/components/ui/textarea";
import { VaultItem } from "@/lib/types/VaultType";

export default function SecureNoteItem({ secureNoteItem }: { secureNoteItem: VaultItem }) {
    return (
        <Field className="w-full min-h-full flex flex-col items-start justify-start border-r border-muted px-8 py-8 gap-8 bg-background overflow-y-scroll">
            <FieldSet>
                <FieldTitle className="text-primary text-6xl font-bold">{JSON.parse(secureNoteItem.encryptedData!).title}</FieldTitle>
                <FieldDescription className="text-muted-foreground text-xl">View your <span className="font-bold">{secureNoteItem.itemType}</span> details.</FieldDescription>
            </FieldSet>

            <FieldGroup className="hidden lg:flex gap-4 w-full">
                <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input type="text" placeholder="Name of secure note item" id="name" value={JSON.parse(secureNoteItem.encryptedData!).title!} readOnly className="h-12" />
                </Field>
                <Field>
                    <FieldLabel>Note</FieldLabel>
                    <Textarea placeholder="Note" id="note" value={JSON.parse(secureNoteItem.encryptedData!).content!} readOnly className="min-h-75" />
                </Field>
            </FieldGroup>

            <FieldGroup>
                <FieldSeparator />
                <Field orientation="horizontal">
                    <FieldLabel>Created At</FieldLabel>
                    <FieldContent>
                        <FieldDescription>{secureNoteItem.createdAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                    </FieldContent>
                </Field>
                <Field orientation="horizontal">
                    <FieldLabel>Updated At</FieldLabel>
                    <FieldContent>
                        <FieldDescription>{secureNoteItem.updatedAt?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</FieldDescription>
                    </FieldContent>
                </Field>
            </FieldGroup>
        </Field>
    )
}