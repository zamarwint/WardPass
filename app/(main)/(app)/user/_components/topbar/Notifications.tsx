"use client";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";

export const ChangingPasswords = () => {
    return (
        <Dialog>
            <DialogTrigger className="text-left px-2">
                Tip: Changing Account and Vault Password
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="font-bold">CHANGING ACCOUNT AND VAULT PASSWORDS</DialogTitle>
                <DialogDescription>
                    Whenever you change your account password, you must also change your vault password.
                    This is because the vault password is encrypted with the account password.
                </DialogDescription>
                <DialogDescription>
                    If you forget your account password, you will not be able to decrypt your vault password.
                    If you forget your vault password, you will not be able to access your vaults.
                    So please remember to change your vault password when changing your account password.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export const NumberOfVaultandVaultItems = () => {
    return (
        <Dialog>
            <DialogTrigger className="text-left px-2">
                NB: Number of Vaults and Vault Items
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="font-bold">NUMBER OF VAULTS AND VAULT ITEMS</DialogTitle>
                <DialogDescription>
                    You can only have up to 3 vaults with 3 vault items at this moment.
                    This is because WardPass is a free service.
                </DialogDescription>
                <DialogDescription>
                    We hope you understand. If you want more vaults and vault items, please consider supporting this project
                    by donating monthly or yearly using the <Link href="#">link</Link> provided.
                    When you have done so, we will increase the number of vaults and vault items you can have accordingly.
                </DialogDescription>
                <DialogDescription>
                    Thank you for using WardPass!
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}

export const KeyboardShortcuts = () => {
    // As stated in the plan.
    return (
        <Dialog>
            <DialogTrigger className="text-left px-2">
                Tip: Keyboard Shortcuts
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="font-bold">KEYBOARD SHORTCUTS</DialogTitle>
                <DialogDescription>
                    Here are some keyboard shortcuts that you can use to navigate WardPass:
                </DialogDescription>
                <div className="w-fit px-2 py-1 rounded-md">
                    <ul>
                        <li>1. <kbd>Esc</kbd> - Go back to landing page.</li>
                        <li>2. <kbd>Alt</kbd> + <kbd>V</kbd> - Go to the vaults page.</li>
                        <li>3. <kbd>Alt</kbd> + <kbd>T</kbd> - Change theme.</li>
                        <li>4. <kbd>Alt</kbd> + <kbd>P</kbd> - Open promotional message.</li>
                        <li>5. <kbd>Alt</kbd> + <kbd>U</kbd> - Open user settings.</li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function Notifications() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                    <Bell size={32} className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-geist">
                <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="text-sm">
                    <DropdownMenuItem asChild>
                        <ChangingPasswords />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <NumberOfVaultandVaultItems />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <KeyboardShortcuts />
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}