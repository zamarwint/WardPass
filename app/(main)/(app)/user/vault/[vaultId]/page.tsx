"use client";

import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Globe, IdCard, LayoutList, NotebookPen, PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVaultItems } from "@/app/actions/vault/getVaultItems";
import { useState, useEffect, useMemo } from "react";
import { VaultItem } from "@/lib/types/VaultType";
import { useVaultStore } from "@/stores/vault";
import { deriveKey, fromBase64 } from "@/lib/crypto/argon2";
import { decryptVaultKey, verifyVaultKey, decryptData } from "@/lib/crypto/aes";
import { UnlockVaultModal } from "../_components/UnlockVaultModal";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LoginItem from "./_components/read/LoginItem";
import SecureNoteItem from "./_components/read/SecureNoteItem";
import CreditCardItem from "./_components/read/CreditCardItem";
import IdentityItem from "./_components/read/IdentityItem";
import { SvgCircle } from "../_components/SVG";
import CreateLoginItem from "./_components/create/CreateLoginItem";

import LoginDropdown from "./_components/dropdowns/LoginDropdown";
import CreateSecureNoteItem from "./_components/create/CreateSecureNoteItem";
import SecureNoteDropdown from "./_components/dropdowns/SecureNoteDropdown";
import CreateCreditCardItem from "./_components/create/CreateCreditCardItem";
import CreateIdentityItem from "./_components/create/CreateIdentityItem";
import CreditCardDropdown from "./_components/dropdowns/CreditCardDropdown";
import IdentityDropdown from "./_components/dropdowns/IdentityDropdown";

// THE PURPOSE OF THIS PAGE IS TO DISPLAY ALL THE VAULT ITEMS IN A LIST ON THE LEFT SIDE, AND WHEN SELECTED, DISPLAY THE ITEM DETAILS ON THE RIGHT SIDE. 
// LIKE LOGIN ITEMS, SECURE NOTE ITEMS, CREDIT CARD ITEMS, AND IDENTITY ITEMS
export default function VaultIDPage() {
    const { vaultId } = useParams();
    const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

    // DROPDOWN
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);

    // ALL CRUD COMPONENT STATE MANAGEMENT
    const [createLogin, setCreateLogin] = useState<boolean>(false);
    const [createSecureNote, setCreateSecureNote] = useState<boolean>(false);
    const [createCreditCard, setCreateCreditCard] = useState<boolean>(false);
    const [createIdentity, setCreateIdentity] = useState<boolean>(false);

    // UNSELECT ITEMS
    const unSelectItems = () => {
        setSelectedItem(null);
    }

    const store = useVaultStore();
    const [isAutoUnlocking, setIsAutoUnlocking] = useState(false);

    // GET CURRENT VAULT ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
    const { data: vaultItems, isLoading: vaultItemsLoading, error: vaultItemsError } = useQuery({
        queryKey: ["vaultItems", vaultId],
        queryFn: () => getVaultItems(vaultId as string),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5
    })

    // AUTO-UNLOCK
    useEffect(() => {
        if (!vaultItems || store.isUnlocked || !store.masterPassword) return;

        let isMounted = true;
        const autoUnlock = async () => {
            setIsAutoUnlocking(true);
            try {
                // Yield to allow UI to show loading state
                await new Promise((resolve) => setTimeout(resolve, 50));
                const saltBytes = fromBase64(vaultItems.salt!);
                const derivedKey = await deriveKey(store.masterPassword!, saltBytes);
                const vaultKey = decryptVaultKey(vaultItems.encryptedKey!, vaultItems.keyIv!, derivedKey);

                if (verifyVaultKey(vaultItems.verificationHash!, vaultItems.hashIv!, vaultKey) && isMounted) {
                    store.unlock(vaultKey);
                } else {
                    store.setMasterPassword(""); // invalid password
                }
            } catch (err) {
                console.error("Auto unlock failed", err);
                if (isMounted) store.setMasterPassword("");
            } finally {
                if (isMounted) setIsAutoUnlocking(false);
            }
        };

        autoUnlock();
        return () => { isMounted = false; };
    }, [vaultItems, store.isUnlocked, store.masterPassword, store]);

    if (vaultItemsError) {
        toast.error("There was an error loading your vault. Please try refreshing the page." + vaultItemsError?.message);
        redirect("/user/vault");
    }

    const needsUnlock = vaultItems && !store.isUnlocked && !isAutoUnlocking;

    const decryptedVaultItems = useMemo(() => {
        if (!vaultItems || !store.isUnlocked) return null;
        try {
            const key = store.getVaultKey();
            const decryptItem = (item: VaultItem) => {
                if (!item.encryptedData || !item.iv) return item;
                const json = decryptData(item.encryptedData, item.iv, key);
                return { ...item, ...JSON.parse(json) };
            };
            return {
                ...vaultItems,
                vaultItems: vaultItems.vaultItems?.map(decryptItem)
            };
        } catch (err) {
            console.error("Failed to decrypt items", err);
            return null;
        }
    }, [vaultItems, store]);

    return (
        <>
            {needsUnlock && <UnlockVaultModal open={true} vault={vaultItems} />}
            {/* ALL CRUD COMPONENTS */}

            {/* LOGIN COMPONENTS */}
            {createLogin && <CreateLoginItem vaultId={vaultId as string} cancel={() => setCreateLogin(!createLogin)} />}

            {/* SECURE NOTE COMPONENTS */}
            {createSecureNote && <CreateSecureNoteItem vaultId={vaultId as string} cancel={() => setCreateSecureNote(!createSecureNote)} />}

            {/* CREDIT CARD COMPONENTS */}
            {createCreditCard && <CreateCreditCardItem vaultId={vaultId as string} cancel={() => setCreateCreditCard(!createCreditCard)} />}

            {/* IDENTITY COMPONENTS */}
            {createIdentity && <CreateIdentityItem vaultId={vaultId as string} cancel={() => setCreateIdentity(!createIdentity)} />}

            <div className="size-full flex items-center justify-center overflow-hidden">
                <div className="w-1/3 h-full border-r border-muted flex flex-col items-center justify-start overflow-hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg" className="w-[80%] my-8 py-6 text-md rounded-xl">
                                <PlusIcon size={24} className="text-primary mr-2" />
                                <span className="text-foreground">Add New Item</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setCreateLogin(true)} className="cursor-pointer">Login Item</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCreateSecureNote(true)} className="cursor-pointer">Secure Note</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCreateCreditCard(true)} className="cursor-pointer">Credit Card</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setCreateIdentity(true)} className="cursor-pointer">Identity</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Separator className="bg-muted" />
                    <div className="w-[90%] mt-4 flex-1 overflow-y-auto pb-8" onDoubleClick={unSelectItems}>
                        {vaultItemsLoading ? <div>Loading...</div> : (!decryptedVaultItems || decryptedVaultItems.vaultItems!.length === 0) ?
                            <div className="text-muted-foreground mt-4 text-center">No items found. Create a new item to continue.</div>
                            : <div className="size-full text-left mt-4">
                                {decryptedVaultItems.vaultItems?.map((item: VaultItem) => (
                                    item.itemType === 'LOGIN' && <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                        <div className="flex gap-3 p-2">
                                            <div className="w-18.75 h-12.5 flex items-center justify-center bg-background rounded-xl">
                                                <Globe className="size-[80%] text-primary" />
                                            </div>
                                            <div className="size-full flex flex-col items-start justify-center">
                                                <h1 className="text-primary font-bold">{JSON.parse(item.encryptedData!).name}</h1>
                                                <p className="font-mono text-sm">{JSON.parse(item.encryptedData!).email}</p>
                                            </div>
                                        </div>
                                        {selectedItem?.id === item.id && <LoginDropdown open={openDropdown} onOpenChange={() => setOpenDropdown(!openDropdown)} loginItem={item} />}
                                    </div>
                                ))}
                                {decryptedVaultItems.vaultItems?.map((item: VaultItem) => (
                                    item.itemType === 'SECURE_NOTE' && <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                        <div className="flex flex-col gap-3 p-2 w-[90%]">
                                            <div className="size-full flex flex-col items-start justify-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <NotebookPen className="size=[80%] text-primary" />
                                                    <h1 className="font-bold">{JSON.parse(item.encryptedData!).title}</h1>
                                                </div>
                                                <p className="text-md text-muted-foreground font-medium line-clamp-1 w-[80%]">{JSON.parse(item.encryptedData!).content}</p>
                                            </div>
                                            <div className="flex flex-col">
                                                <Separator />
                                                <div className="flex items-center justify-between w-full pt-2">
                                                    <p className="text-xs font-medium text-muted-foreground">LAST UPDATED</p>
                                                    <p className="text-xs font-mono text-muted-foreground">{item.updatedAt?.toDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedItem?.id === item.id && <SecureNoteDropdown open={openDropdown} onOpenChange={() => setOpenDropdown(!openDropdown)} secureNoteItem={item} />}
                                    </div>
                                ))}
                                {decryptedVaultItems.vaultItems?.map((item: VaultItem) => (
                                    item.itemType === 'CREDIT_CARD' && <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                        <div className="flex flex-col gap-2 p-2 w-full">
                                            <CreditCard className="size=[80%] text-primary" />
                                            <div className="size-full flex flex-col items-start justify-center gap-1">
                                                <h1 className="font-bold">{JSON.parse(item.encryptedData!).cardHolderName}</h1>
                                                <p className="text-md text-muted-foreground font-medium line-clamp-1">{JSON.parse(item.encryptedData!).billingAddress1}</p>
                                            </div>
                                        </div>
                                        {selectedItem?.id === item.id && <CreditCardDropdown open={openDropdown} onOpenChange={() => setOpenDropdown(!openDropdown)} creditCardItem={item} />}
                                    </div>
                                ))}
                                {decryptedVaultItems.vaultItems?.map((item: VaultItem) => (
                                    item.itemType === 'IDENTITY' && <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                        <div className="flex gap-3 p-2">
                                            <div className="w-18.75 h-12.5 flex items-center justify-center bg-background rounded-full">
                                                <IdCard className="size-[70%] text-primary" />
                                            </div>
                                            <div className="size-full flex flex-col items-start justify-center">
                                                <h1 className="font-bold">{JSON.parse(item.encryptedData!).name}</h1>
                                                <p className="font-mono text-sm">{JSON.parse(item.encryptedData!).phoneNumber}</p>
                                            </div>
                                        </div>
                                        {selectedItem?.id === item.id && <IdentityDropdown open={openDropdown} onOpenChange={() => setOpenDropdown(!openDropdown)} identityItem={item} />}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex-1 h-full flex items-center justify-center overflow-y-auto">
                    {vaultItemsLoading ? <div>Loading...</div> : !selectedItem ? (
                        <div className="flex flex-col items-center gap-1">
                            <SvgCircle>
                                <LayoutList size={80} className="text-primary relative z-10" />
                            </SvgCircle>
                            <h1 className="text-2xl font-semibold text-foreground mt-2">No item selected</h1>
                            <p className="text-muted-foreground text-center">Select an item to view details.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center size-full">
                            {selectedItem?.itemType === "LOGIN" && <LoginItem loginItem={selectedItem as VaultItem} />}
                            {selectedItem?.itemType === "SECURE_NOTE" && <SecureNoteItem secureNoteItem={selectedItem as VaultItem} />}
                            {selectedItem?.itemType === "CREDIT_CARD" && <CreditCardItem creditCardItem={selectedItem as VaultItem} />}
                            {selectedItem?.itemType === "IDENTITY" && <IdentityItem identityItem={selectedItem as VaultItem} />}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}