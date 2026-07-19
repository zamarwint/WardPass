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
import type { SecureNoteItem } from "@/lib/types/VaultItemType";
import { Textarea } from "@/components/ui/textarea";

export default function SecureNoteItem({ secureNoteItem }: { secureNoteItem: SecureNoteItem }) {
    return (
        <Field className="w-full min-h-full flex flex-col items-start justify-start border-r border-muted px-8 py-8 gap-8 bg-background">
            <FieldSet>
                <FieldTitle className="text-primary text-6xl font-bold">{secureNoteItem.title}</FieldTitle>
                <FieldDescription className="text-muted-foreground text-xl">View your <span className="font-bold">{secureNoteItem.itemType}</span> details.</FieldDescription>
            </FieldSet>

            <FieldGroup className="hidden lg:flex gap-4 w-full">
                <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input type="text" placeholder="Name of secure note item" id="name" value={secureNoteItem.title!} readOnly className="h-12" />
                </Field>
                <Field>
                    <FieldLabel>Note</FieldLabel>
                    <Textarea placeholder="Note" id="note" value={secureNoteItem.content!} readOnly className="min-h-[300px]" />
                </Field>
            </FieldGroup>

            <FieldSet>
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
            </FieldSet>
        </Field>
    )
}