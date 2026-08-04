"use client";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const ChangingPasswords = () => {
    return (
        <Dialog>
            <DialogTrigger>
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
            <DialogTrigger>
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
                    by donating monthly or yearly using the <Link href="https://www.buymeacoffee.com/zwbless">link</Link> provided.
                    When you have done so, we will increase the number of vaults and vault items you can have accordingly.
                </DialogDescription>
                <DialogDescription>
                    Thank you for using WardPass!
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
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
                <div className="text-sm">
                    <ChangingPasswords />
                    <Separator className="my-1" />
                    <NumberOfVaultandVaultItems />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}