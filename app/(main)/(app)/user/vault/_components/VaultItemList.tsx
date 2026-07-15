import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Vault } from "@/lib/types/VaultType";
import { LayoutList, PlusIcon } from "lucide-react";
import VaultTopBar from "./VaultTopBar";

const SvgCircle = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute -z-10 size-full">
        <circle cx="50" cy="50" r="50" className="fill-muted" />
    </svg>
);

export default function VaultItemList({ vaultName, vaultItems }: { vaultName: string, vaultItems: Vault[] }) {
    let totalItems = 0;

    vaultItems?.forEach((item) => {
        totalItems += item.loginItems?.length || 0;
        totalItems += item.secureNoteItems?.length || 0;
        totalItems += item.creditCardItems?.length || 0;
        totalItems += item.identities?.length || 0;
    })

    return (
        <div className="size-full flex flex-col items-center justify-center">
            <VaultTopBar vaultName={vaultName} />
            <div className="size-full flex items-center justify-center">
                <div className="w-1/2 h-full border-r border-muted flex flex-col items-center justify-start">
                    <Button variant="outline" size="lg" className="w-[80%] my-8 py-6 text-md rounded-xl"> <PlusIcon size={24} className="text-primary" /> Add New Item</Button>
                    <Separator className="bg-muted" />
                    {totalItems === 0 ?
                        <div className="text-muted-foreground mt-4">No items found. Create a new item to continue.</div>
                        : <div>
                            {vaultItems?.map(item => (
                                item.loginItems?.map(loginItem => (
                                    <div key={loginItem.id} className="text-muted-foreground mt-4">{loginItem.name}</div>
                                ))
                            ))}
                            {vaultItems?.map(item => (
                                item.secureNoteItems?.map(secureNoteItem => (
                                    <div key={secureNoteItem.id} className="text-muted-foreground mt-4">{secureNoteItem.title}</div>
                                ))
                            ))}
                            {vaultItems?.map(item => (
                                item.creditCardItems?.map(creditCardItem => (
                                    <div key={creditCardItem.id} className="text-muted-foreground mt-4">{creditCardItem.cardHolderName}</div>
                                ))
                            ))}
                            {vaultItems?.map(item => (
                                item.identities?.map(identityItem => (
                                    <div key={identityItem.id} className="text-muted-foreground mt-4">{identityItem.name}</div>
                                ))
                            ))}
                            <div className="text-muted-foreground mt-4">Total items: {totalItems}</div>
                        </div>
                    }
                </div>
                <div className="size-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative flex items-center justify-center w-32 h-32">
                            <SvgCircle />
                            <LayoutList size={80} className="text-primary relative z-10" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <h1 className="text-2xl font-semibold text-foreground">No item selected</h1>
                            <p className="text-muted-foreground text-center">Select an item to view details.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}