"use client";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { EmailDeliveryNotWorkingBanner } from "@/components/Banners";

export const Manual = () => {
    return (
        <Dialog>
            <DialogTrigger render={
                <SidebarMenuButton size="lg" className="w-full font-bold flex justify-start text-left">
                    WardPass Manual
                </SidebarMenuButton>
            }>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="font-bold">WARDPASS MANUAL</DialogTitle>
                <DialogDescription>
                    Welcome to WardPass! So excited that you are here!
                </DialogDescription>
                <DialogDescription>
                    <strong> TIP:</strong> To edit or delete a vault, right click on the vault in the sidebar. To edit or trash a vault item, click on the three dots on the vault item. To delete a vault item you must navigate to the trash bin the under User Dropdown area.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export const ChangingPasswords = () => {
    return (
        <Dialog>
            <DialogTrigger render={
                <SidebarMenuButton size="lg" className="w-full flex justify-start text-left">
                    <strong>TIP:</strong> Changing Account and Vault Password
                </SidebarMenuButton>
            }>
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
                <DialogDescription>
                    NB: You can create different passwords for vaults. However, if do this, please note that the vault whose password is not your master password will not auto-lock on sign-in.
                    You will have to unlock it using its own password.
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export const NumberOfVaultandVaultItems = () => {
    return (
        <Dialog>
            <DialogTrigger render={
                <SidebarMenuButton size="lg" className="w-full flex justify-start text-left">
                    <strong>NB:</strong> Number of Vaults and Vault Items
                </SidebarMenuButton>
            }>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="font-bold">NUMBER OF VAULTS AND VAULT ITEMS</DialogTitle>
                <DialogDescription>
                    You can only have up to 5 vaults with 5 vault items at this moment.
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
            <DialogTrigger render={
                <SidebarMenuButton size="lg" className="w-full flex justify-start text-left">
                    <strong>TIP:</strong> Keyboard Shortcuts
                </SidebarMenuButton>
            }>
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
                        <li>6. <kbd>CTRL</kbd> + <kbd>B</kbd> - Toggle sidebar.</li>
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function Notifications() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon-lg">
                    <Bell />
                </Button>
            }>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Alerts!</DropdownMenuLabel>
                    <DropdownMenuItem render={<EmailDeliveryNotWorkingBanner />} />
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Main Notifications</DropdownMenuLabel>
                    <DropdownMenuItem render={<Manual />} />
                    <DropdownMenuItem render={<ChangingPasswords />} />
                    <DropdownMenuItem render={<NumberOfVaultandVaultItems />} />
                    <DropdownMenuItem render={<KeyboardShortcuts />} />
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}