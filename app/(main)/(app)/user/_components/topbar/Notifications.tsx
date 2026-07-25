import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { toast } from "sonner"

const changingPasswords = `
Whenever you change your account password, you must also change your vault password.
This is because the vault password is encrypted with the account password.\n\n
If you forget your account password, you will not be able to decrypt your vault password.\n\n
If you forget your vault password, you will not be able to access your vaults.\n\n
So please remember to change your vault password when changing your account password.
`

const numberOfVaultandVaultItems = `
You can only have up to 3 vaults with 3 vault items at this moment.
This is because this is a free service and we don't have the budget to provide more than that.
We hope you understand. To provide more than that, please consider donating to the project.
`

export default function Notifications() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="mr-2">
                    <Bell size={32} className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-geist">
                <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info(changingPasswords, {
                    description: "Tip: Changing Account and Vault Password",
                    dismissible: true
                })}>
                    Tip: Changing Account and Vault Password
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info(numberOfVaultandVaultItems, {
                    description: "NB: Number of Vaults and Vault Items",
                    dismissible: true
                })}>
                    NB: Number of Vaults and Vault Items
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}