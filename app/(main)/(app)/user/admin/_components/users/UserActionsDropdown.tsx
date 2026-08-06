import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";

export function UserActionsDropdown({ userId }: { userId: string }) {
    // const [openBanUser, setOpenBanUser] = useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <EllipsisVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer" onClick={() => { }}>Ban User</DropdownMenuItem>
            </DropdownMenuContent>
            {/* TODO: Implement user actions dialogs and functions */}
        </DropdownMenu>
    )
}