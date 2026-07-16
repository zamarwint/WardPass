import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VaultItem } from "@/lib/types/VaultType";

export default function SecureNoteItem({ vaultItem }: { vaultItem: VaultItem }) {
    return (
        <div className="w-full min-h-full my-8 py-6 text-md rounded-xl">
            <Label>Login Name</Label>
            <Input type="text" placeholder="Login Name" className="my-2" />
            <Label>Password</Label>
            <Input type="password" placeholder="Password" className="my-2" />
            <Label>URL</Label>
            <Input type="text" placeholder="URL" className="my-2" />
            <Label>Notes</Label>
            <Input type="text" placeholder="Notes" className="my-2" />
        </div>
    )
}