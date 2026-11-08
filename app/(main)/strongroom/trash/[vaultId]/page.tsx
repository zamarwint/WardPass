"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { CreditCard, Globe, IdCard, NotebookPen, Trash2Icon } from "lucide-react";
import { SvgCircle } from "@/components/app/SVG";
import { useEffect, useMemo, useState } from "react";
import { VaultItem, VaultItemType } from "@/lib/types/VaultType";
import { Separator } from "@/components/ui/separator";

import { fromBase64 } from "@/lib/crypto/utils";
import { deriveKey } from "@/lib/crypto/argon2";
import { decryptData, decryptVaultKey, verifyVaultKey } from "@/lib/crypto/aes";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useVaultStore } from "@/stores/vault";
import { UnlockVaultModal } from "@/components/app/UnlockVaultModal";
import { CreditCardJSON, IdentityJSON, LoginJSON, SecureNoteJSON } from "@/lib/types/VaultItemType";
import { useGetVaultWithTrashedItems } from "@/lib/queries/VaultQueries";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CustomLoadingState } from "@/components/LoadingStates";
import RestoreLoginItemDialog from "@/components/app/trash/restore/RestoreLoginItemDialog";
import DeleteLoginItemDialog from "@/components/app/trash/delete/DeleteLoginItemDialog";
import RestoreSecureNoteItemDialog from "@/components/app/trash/restore/RestoreSecureNoteItemDialog";
import DeleteSecureNoteItemDialog from "@/components/app/trash/delete/DeleteSecureNoteItemDialog";
import RestoreCreditCardItemDialog from "@/components/app/trash/restore/RestoreCreditCardItemDialog";
import DeleteCreditCardItemDialog from "@/components/app/trash/delete/DeleteCreditCardItemDialog";
import RestoreIdentityItemDialog from "@/components/app/trash/restore/RestoreIdentityItemDialog";
import DeleteIdentityItemDialog from "@/components/app/trash/delete/DeleteIdentityItemDialog";


export default function TrashPage() {
    const params = useParams();
    const vaultId = params.vaultId as string;
    const router = useRouter();

    const [selectedItemType, setSelectedItemType] = useState<VaultItemType>(VaultItemType.LOGIN);
    const [selectedItem, setSelectedItem] = useState<SecureNoteJSON | CreditCardJSON | IdentityJSON | LoginJSON | null>(null);

    const store = useVaultStore();
    const [isAutoUnlocking, setIsAutoUnlocking] = useState(false);

    // GET CURRENT VAULT ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
    const { data: trashedItems, isLoading: trashedItemsLoading, error: trashedItemsError } = useGetVaultWithTrashedItems(vaultId);

    // UNSELECT ITEMS
    const unSelectItems = () => {
        setSelectedItem(null);
    }

    // AUTO-UNLOCK
    useEffect(() => {
        if (!trashedItems || store.isVaultUnlocked(vaultId) || !store.masterPassword) return;

        let isMounted = true;
        const autoUnlock = async () => {
            setIsAutoUnlocking(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 50));
                const saltBytes = fromBase64(trashedItems.salt!);
                const derivedKey = await deriveKey(store.masterPassword!, saltBytes);
                const vaultKey = decryptVaultKey(trashedItems.encryptedKey!, trashedItems.keyIv!, derivedKey);

                if (verifyVaultKey(trashedItems.verificationHash!, trashedItems.hashIv!, vaultKey) && isMounted) {
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
    }, [trashedItems, vaultId, store.vaultKeys, store.masterPassword]);

    if (trashedItemsError) {
        toast.error("There was an error loading your vault. Please try refreshing the page." + trashedItemsError?.message);
        redirect("/strongroom");
    }

    // ✅ isVaultUnlocked(id) replaces the old boolean store.isUnlocked
    const needsUnlock = trashedItems && !store.isVaultUnlocked(vaultId) && !isAutoUnlocking;

    const decryptedVaultItems = useMemo(() => {
        if (!trashedItems || !store.isVaultUnlocked(vaultId)) return null;
        try {
            // ✅ getVaultKey now takes the vaultId
            const key = store.getVaultKey(vaultId);
            const decryptItem = (item: VaultItem) => {
                if (!item.encryptedData || !item.iv) return item;
                const json = decryptData(item.encryptedData, item.iv, key);
                return { ...item, ...JSON.parse(json) };
            };
            return {
                ...trashedItems,
                vaultItems: trashedItems.vaultItems?.map(decryptItem),
            };
        } catch (err) {
            console.error("Failed to decrypt items", err);
            return null;
        }
        // ✅ Depend on store.vaultKeys (the whole Record) — a new object
        //    reference is produced on every unlock/lock, so React sees the change
    }, [trashedItems, vaultId, store.vaultKeys]);

    return (
        <>
            {needsUnlock && <UnlockVaultModal open={true} vault={trashedItems} />}
            {/* TOP BAR */}
            <ResizablePanelGroup orientation="vertical" className="size-full">
                <ResizablePanel defaultSize={30} className="flex flex-col gap-6 py-10 px-10 size-full no-scrollbar">
                    <h1 className="text-2xl md:text-6xl font-bold text-primary">
                        <span>Trash</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">Here are the entries that you have deleted. They will be permanently deleted after 30 days.</p>
                    <Button variant="secondary" size="lg" className="w-fit cursor-pointer" onClick={() => router.back()}>
                        <ArrowLeftIcon className="size-4" />
                        Back to Vaults
                    </Button>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70} className="size-full">
                    {/* TRASH ITEMS CONTAINER */}
                    <ResizablePanelGroup orientation="horizontal" className="size-full">
                        {/* TRASH ITEMS AREA */}
                        <ResizablePanel className="size-full">
                            <div className="size-full border-r border-muted flex flex-col items-center justify-start">
                                <Separator className="bg-muted" />
                                <div className="w-full h-fit p-4 overflow-x-auto no-scrollbar flex items-center justify-center">
                                    <ToggleGroup type="single" value={selectedItemType} onValueChange={(value) => setSelectedItemType(value as VaultItemType)} className="w-full h-fit flex items-center justify-around overflow-x-scroll no-scrollbar">
                                        <ToggleGroupItem value="LOGIN">LOGIN</ToggleGroupItem>
                                        <ToggleGroupItem value="SECURE_NOTE">SECURE NOTE</ToggleGroupItem>
                                        <ToggleGroupItem value="CREDIT_CARD">CREDIT CARD</ToggleGroupItem>
                                        <ToggleGroupItem value="IDENTITY">IDENTITY</ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                                <Separator className="bg-muted" />
                                <div className="size-full overflow-y-auto pb-8 flex items-center justify-center no-scrollbar" onDoubleClick={unSelectItems}>
                                    {trashedItemsLoading ? (
                                        <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                            <span className="shimmer shimmer-duration-1000"> Loading... </span>
                                        </CustomLoadingState>
                                    ) : !trashedItems || trashedItems?.vaultItems!.length === 0 ?
                                        (
                                            <div className="flex flex-col items-center justify-center size-full gap-1">
                                                <h1 className="text-lg font-medium text-muted-foreground mt-2">No trashed items.</h1>
                                            </div>
                                        )
                                        : (
                                            <div className="size-full text-left p-4 flex flex-col items-start justify-start no-scrollbar">
                                                {selectedItemType === VaultItemType.LOGIN && decryptedVaultItems?.vaultItems!.map((item) => (
                                                    item.itemType === VaultItemType.LOGIN &&
                                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                                        <div className="flex w-full gap-3 p-2">
                                                            <div className="w-18.75 h-12.5 flex items-center justify-center bg-background rounded-xl">
                                                                <Globe className="size-[80%] text-primary" />
                                                            </div>
                                                            <div className="size-full flex flex-col items-start justify-center">
                                                                <h1 className="text-primary font-bold">{item.name}</h1>
                                                                <p className="font-mono text-sm">{item.email}</p>
                                                            </div>
                                                        </div>
                                                        {selectedItem?.id === item.id && <RestoreLoginItemDialog loginItem={item} />}
                                                        {selectedItem?.id === item.id && <DeleteLoginItemDialog loginItem={item} />}
                                                    </div>
                                                ))}
                                                {selectedItemType === VaultItemType.SECURE_NOTE && decryptedVaultItems?.vaultItems!.map((item) => (
                                                    item.itemType === VaultItemType.SECURE_NOTE &&
                                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                                        <div className="flex flex-col flex-1 gap-3 p-2 w-[90%]">
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
                                                        {selectedItem?.id === item.id && <RestoreSecureNoteItemDialog secureNoteItem={item} />}
                                                        {selectedItem?.id === item.id && <DeleteSecureNoteItemDialog secureNoteItem={item} />}
                                                    </div>
                                                ))}
                                                {selectedItemType === VaultItemType.CREDIT_CARD && decryptedVaultItems?.vaultItems!.map((item) => (
                                                    item.itemType === VaultItemType.CREDIT_CARD &&
                                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                                        <div className="flex flex-col gap-2 p-2 w-full">
                                                            <CreditCard className="size=[80%] text-primary" />
                                                            <div className="size-full flex flex-col items-start justify-center gap-1">
                                                                <h1 className="font-bold">{item.cardHolderName}</h1>
                                                                <p className="text-md text-muted-foreground font-medium line-clamp-1">{item.cardNumber}</p>
                                                            </div>
                                                        </div>
                                                        {selectedItem?.id === item.id && <RestoreCreditCardItemDialog creditCardItem={item} />}
                                                        {selectedItem?.id === item.id && <DeleteCreditCardItemDialog creditCardItem={item} />}
                                                    </div>
                                                ))}
                                                {selectedItemType === VaultItemType.IDENTITY && decryptedVaultItems?.vaultItems!.map((item) => (
                                                    item.itemType === VaultItemType.IDENTITY &&
                                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                                        <div className="flex flex-1 gap-3 p-2">
                                                            <div className="w-18.75 h-12.5 flex items-center justify-center bg-background rounded-full">
                                                                <IdCard className="size-[70%] text-primary" />
                                                            </div>
                                                            <div className="size-full flex flex-col items-start justify-center">
                                                                <h1 className="font-bold">{item.name}</h1>
                                                                <p className="font-mono text-sm">{item.phoneNumber}</p>
                                                            </div>
                                                        </div>
                                                        {selectedItem?.id === item.id && <RestoreIdentityItemDialog identityItem={item} />}
                                                        {selectedItem?.id === item.id && <DeleteIdentityItemDialog identityItem={item} />}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* TRASH BIN ICON AREA */}
                        <ResizablePanel className="size-full">
                            <div className="size-full flex items-center justify-center overflow-y-auto border-t border-muted">
                                <div className="flex flex-col items-center gap-1">
                                    <SvgCircle>
                                        <Trash2Icon size={80} className="text-primary relative z-10" />
                                    </SvgCircle>
                                    <h1 className="text-2xl font-semibold text-foreground mt-2">Trash Bin</h1>
                                    <p className="text-muted-foreground text-center">You can restore deleted items within 90 days.</p>
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}