"use client";

import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Globe, IdCard, LayoutList, NotebookPen, PlusIcon, XIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { VaultItem, VaultItemType } from "@/lib/types/VaultType";
import { useVaultStore } from "@/stores/vault";
import { deriveKey, fromBase64 } from "@/lib/crypto/argon2";
import { decryptVaultKey, verifyVaultKey, decryptData } from "@/lib/crypto/aes";
import { UnlockVaultModal } from "@/components/app/UnlockVaultModal";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LoginItem from "@/components/app/vault-item/read/LoginItem";
import SecureNoteItem from "@/components/app/vault-item/read/SecureNoteItem";
import CreditCardItem from "@/components/app/vault-item/read/CreditCardItem";
import IdentityItem from "@/components/app/vault-item/read/IdentityItem";
import { SvgCircle } from "@/components/app/SVG";
import CreateLoginItem from "@/components/app/vault-item/create/CreateLoginItem";

import LoginDropdown from "@/components/app/vault-item/dropdowns/LoginDropdown";
import CreateSecureNoteItem from "@/components/app/vault-item/create/CreateSecureNoteItem";
import SecureNoteDropdown from "@/components/app/vault-item/dropdowns/SecureNoteDropdown";
import CreateCreditCardItem from "@/components/app/vault-item/create/CreateCreditCardItem";
import CreateIdentityItem from "@/components/app/vault-item/create/CreateIdentityItem";
import CreditCardDropdown from "@/components/app/vault-item/dropdowns/CreditCardDropdown";
import IdentityDropdown from "@/components/app/vault-item/dropdowns/IdentityDropdown";
import { CreditCardJSON, IdentityJSON, LoginJSON, SecureNoteJSON } from "@/lib/types/VaultItemType";
import { useGetVaultPageData } from "@/lib/queries/VaultQueries";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CustomLoadingState } from "@/components/LoadingStates";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

// THE PURPOSE OF THIS PAGE IS TO DISPLAY ALL THE VAULT ITEMS IN A VAULT IN A LIST ON THE LEFT SIDE, AND WHEN SELECTED, DISPLAY THE ITEM DETAILS ON THE RIGHT SIDE. 
// LIKE LOGIN ITEMS, SECURE NOTE ITEMS, CREDIT CARD ITEMS, AND IDENTITY ITEMS
export default function ActiveVault() {
    const params = useParams();
    const vaultId = params.vaultId as string;

    const [selectedItemType, setSelectedItemType] = useState<VaultItemType>(VaultItemType.LOGIN);
    const [selectedItem, setSelectedItem] = useState<SecureNoteJSON | CreditCardJSON | IdentityJSON | LoginJSON | null>(null);

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

    // GET CURRENT VAULT ITEMS AND TRASHED VAULT ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
    // CHECKING TO SEE IF VAULT ITEM LIMIT IS REACHED IN BOTH THE CURRENT VAULT AND THE TRASH.
    const { data: vaultItems, isLoading: vaultItemsLoading, error: vaultItemsError } = useGetVaultPageData(vaultId);

    const isVaultLimit = vaultItems && (vaultItems.vaultItems.length + vaultItems.trashedCount) >= 3

    // AUTO-UNLOCK
    useEffect(() => {
        if (!vaultItems || store.isVaultUnlocked(vaultId) || !store.masterPassword) return;

        let isMounted = true;
        const autoUnlock = async () => {
            setIsAutoUnlocking(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 50));
                const saltBytes = fromBase64(vaultItems.salt!);
                const derivedKey = await deriveKey(store.masterPassword!, saltBytes);
                const vaultKey = decryptVaultKey(vaultItems.encryptedKey!, vaultItems.keyIv!, derivedKey);

                if (verifyVaultKey(vaultItems.verificationHash!, vaultItems.hashIv!, vaultKey) && isMounted) {
                    store.unlock(vaultId, vaultKey); // ← vaultId added
                } else {
                    store.setMasterPassword("");
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
    }, [vaultItems, vaultId, store.vaultKeys, store.masterPassword]);

    if (vaultItemsError) {
        toast.error("There was an error loading your vault. Please try refreshing the page." + vaultItemsError?.message);
        redirect("/strongroom");
    }

    // ✅ isVaultUnlocked(id) replaces the old boolean store.isUnlocked
    const needsUnlock = vaultItems && !store.isVaultUnlocked(vaultId) && !isAutoUnlocking;

    const decryptedVaultItems = useMemo(() => {
        if (!vaultItems || !store.isVaultUnlocked(vaultId)) return null;
        try {
            // ✅ getVaultKey now takes the vaultId
            const key = store.getVaultKey(vaultId);
            const decryptItem = (item: VaultItem) => {
                if (!item.encryptedData || !item.iv) return item;
                const json = decryptData(item.encryptedData, item.iv, key);
                return { ...item, ...JSON.parse(json) };
            };
            return {
                ...vaultItems,
                vaultItems: vaultItems.vaultItems?.map(decryptItem),
            };
        } catch (err) {
            console.error("Failed to decrypt items", err);
            return null;
        }
        // ✅ Depend on store.vaultKeys (the whole Record) — a new object
        //    reference is produced on every unlock/lock, so React sees the change
    }, [vaultItems, vaultId, store.vaultKeys]);

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

            {/* VAULT PAGE CONTAINER */}
            <ResizablePanelGroup orientation="horizontal" className="size-full flex items-center justify-center overflow-hidden">
                {/* VAULT ITEMS LIST AREA */}
                <ResizablePanel defaultSize={40} className="size-full h-screen">
                    <div className="size-full border-r border-muted flex flex-col items-center justify-start overflow-hidden select-none">
                        {/* CREATE VAULT ITEM BUTTON */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={isVaultLimit || vaultItemsLoading} variant="outline" size="lg" className="w-[80%] my-8 py-6 text-md rounded-xl">
                                    {
                                        vaultItemsLoading ? (
                                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                                <span className="shimmer shimmer-duration-1000"> Loading... </span>
                                            </CustomLoadingState>
                                        ) : isVaultLimit ? (
                                            <>
                                                <XIcon size={24} className="text-foreground mr-2" />
                                                Vault Item Limit Reached
                                            </>
                                        ) : (

                                            <>
                                                <PlusIcon size={24} className="text-primary mr-2" />
                                                Add New Item
                                            </>
                                        )
                                    }
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

                        {/* VAULT ITEM TYPE FILTER TOGGLES */}
                        <div className="w-full h-fit p-4 overflow-x-auto no-scrollbar flex items-center justify-center">
                            <ToggleGroup type="single" value={selectedItemType} onValueChange={(value) => setSelectedItemType(value as VaultItemType)} className="w-full h-fit flex items-center justify-around overflow-x-scroll no-scrollbar">
                                <ToggleGroupItem value="LOGIN">LOGIN</ToggleGroupItem>
                                <ToggleGroupItem value="SECURE_NOTE">SECURE NOTE</ToggleGroupItem>
                                <ToggleGroupItem value="CREDIT_CARD">CREDIT CARD</ToggleGroupItem>
                                <ToggleGroupItem value="IDENTITY">IDENTITY</ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <Separator className="bg-muted" />

                        {/* VAULT ITEMS LIST */}
                        <div className="size-full overflow-y-auto pb-8 flex items-center justify-center no-scrollbar" onDoubleClick={unSelectItems}>
                            {vaultItemsLoading ? (
                                <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                    <span className="shimmer shimmer-duration-1000"> Loading... </span>
                                </CustomLoadingState>
                            ) : (!decryptedVaultItems || decryptedVaultItems.vaultItems!.length === 0) ?
                                (
                                    <div className="text-muted-foreground mt-4 text-center max-w-fit">No items found. Create a new item to continue.</div>
                                ) : (
                                    <div className="size-full text-left p-4 flex flex-col items-start justify-start no-scrollbar">
                                        {/* LOGIN ITEM */}
                                        {selectedItemType === VaultItemType.LOGIN && decryptedVaultItems.vaultItems?.map((item) => (
                                            item.itemType === VaultItemType.LOGIN && !item ? (
                                                <div key={item.id} className="text-muted-foreground mt-4 text-center max-w-fit">No items found. Create a new item to continue.</div>
                                            ) : (
                                                item.itemType === VaultItemType.LOGIN &&
                                                <div key={item.id} className={cn("w-full min-h-fit max-h-24 text-md flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in", selectedItem?.id === item.id ? "btn-teritary" : "btn-ghost")} onClick={() => setSelectedItem(item)}>
                                                    <div className="flex w-full gap-3 p-2">
                                                        <div className="w-18.75 h-12.5 flex items-center justify-center bg-background rounded-xl">
                                                            <Globe className="size-[80%] text-primary" />
                                                        </div>
                                                        <div className="size-full flex flex-col items-start justify-center">
                                                            <h1 className="text-primary font-bold">{item.name}</h1>
                                                            <p className="font-mono text-sm">{item.email}</p>
                                                        </div>
                                                    </div>
                                                    {selectedItem?.id === item.id && <LoginDropdown open={openDropdown} onOpenChange={() => setOpenDropdown(!openDropdown)} loginItem={item} />}
                                                </div>
                                            )
                                        ))}

                                        {/* SECURE NOTE ITEM */}
                                        {selectedItemType === VaultItemType.SECURE_NOTE && decryptedVaultItems.vaultItems?.map((item) => (
                                            item.itemType === VaultItemType.SECURE_NOTE && !item ? (
                                                <div key={item.id} className="text-muted-foreground mt-4 text-center max-w-fit">No items found. Create a new item to continue.</div>
                                            ) : (
                                                item.itemType === VaultItemType.SECURE_NOTE &&
                                                <div key={item.id} className={cn("w-full min-h-fit max-h-24 text-md flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in", selectedItem?.id === item.id ? "btn-teritary" : "btn-ghost")} onClick={() => setSelectedItem(item)}>
                                                    <div className="flex flex-col gap-3 p-2 w-[90%]">
                                                        <div className="size-full flex flex-col items-start justify-center gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <NotebookPen className="size=[80%] text-primary" />
                                                                <h1 className="font-bold">{item.title}</h1>
                                                            </div>
                                                            <p className="text-md text-muted-foreground font-medium line-clamp-1 w-[80%]">{item.content}</p>
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
                                            )
                                        ))}

                                        {/* CREDIT CARD ITEM */}
                                        {selectedItemType === VaultItemType.CREDIT_CARD && decryptedVaultItems.vaultItems?.map((item) => (
                                            item.itemType === VaultItemType.CREDIT_CARD && !item ? (
                                                <div key={item.id} className="text-muted-foreground mt-4 text-center max-w-fit">No items found. Create a new item to continue.</div>
                                            ) : (
                                                item.itemType === VaultItemType.CREDIT_CARD &&
                                                <div key={item.id} className={cn("w-full min-h-fit max-h-24 text-md rounded-lg flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in", selectedItem?.id === item.id ? "btn-teritary" : "btn-ghost")} onClick={() => setSelectedItem(item)}>
                                                    <div className="flex flex-col gap-2 p-2 w-full">
                                                        <CreditCard className="size=[80%] text-primary" />
                                                        <div className="size-full flex flex-col items-start justify-center gap-1">
                                                            <h1 className="font-bold">{item.cardHolderName}</h1>
                                                            <p className="text-md text-muted-foreground font-medium line-clamp-1">{item.cardNumber}</p>
                                                        </div>
                                                    </div>
                                                    {selectedItem?.id === item.id && <CreditCardDropdown open={openDropdown} onOpenChange={() => setOpenDropdown(!openDropdown)} creditCardItem={item} />}
                                                </div>
                                            )
                                        ))}

                                        {/* IDENTITY ITEM */}
                                        {selectedItemType === VaultItemType.IDENTITY && decryptedVaultItems.vaultItems?.map((item) => (
                                            item.itemType === VaultItemType.IDENTITY && !item ? (
                                                <div key={item.id} className="text-muted-foreground mt-4 text-center max-w-fit">No items found. Create a new item to continue.</div>
                                            ) : (
                                                item.itemType === VaultItemType.IDENTITY &&
                                                <div key={item.id} className={cn("w-full min-h-fit max-h-24 text-md rounded-lg flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in", selectedItem?.id === item.id ? "btn-teritary" : "btn-ghost")} onClick={() => setSelectedItem(item)}>
                                                    <div className="flex gap-3 p-2">
                                                        <div className="w-18.75 h-12.5 flex items-center justify-center bg-background rounded-full">
                                                            <IdCard className="size-[70%] text-primary" />
                                                        </div>
                                                        <div className="size-full flex flex-col items-start justify-center">
                                                            <h1 className="font-bold">{item.name}</h1>
                                                            <p className="font-mono text-sm">{item.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                    {selectedItem?.id === item.id && <IdentityDropdown open={openDropdown} onOpenChange={() => setOpenDropdown(!openDropdown)} identityItem={item} />}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* SELECTED ITEMS AREA */}
                <ResizablePanel defaultSize={60} className="size-full h-screen">
                    <div className="size-full flex items-center justify-center overflow-y-auto">
                        {vaultItemsLoading ?
                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                <span className="shimmer shimmer-duration-1000"> Loading... </span>
                            </CustomLoadingState> : !selectedItem ? (
                                <div className="flex flex-col items-center gap-1">
                                    <SvgCircle>
                                        <LayoutList size={80} className="text-primary relative z-10" />
                                    </SvgCircle>
                                    <h1 className="text-2xl font-semibold text-foreground mt-2">No item selected</h1>
                                    <p className="text-muted-foreground text-center">Select an item to view details.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center size-full">
                                    {selectedItem?.itemType === VaultItemType.LOGIN && <LoginItem loginItem={selectedItem as LoginJSON} />}
                                    {selectedItem?.itemType === VaultItemType.SECURE_NOTE && <SecureNoteItem secureNoteItem={selectedItem as SecureNoteJSON} />}
                                    {selectedItem?.itemType === VaultItemType.CREDIT_CARD && <CreditCardItem creditCardItem={selectedItem as CreditCardJSON} />}
                                    {selectedItem?.itemType === VaultItemType.IDENTITY && <IdentityItem identityItem={selectedItem as IdentityJSON} />}
                                </div>
                            )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}
