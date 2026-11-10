"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, type MouseEvent } from "react";
import { CreditCard, Globe, IdCard, LayoutList, NotebookPen, PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CustomLoadingState } from "@/components/LoadingStates";
import { SvgCircle } from "@/components/app/SVG";
import { UnlockVaultModal } from "@/components/app/UnlockVaultModal";

import LoginItem from "@/components/app/vault-item/read/LoginItem";
import SecureNoteItem from "@/components/app/vault-item/read/SecureNoteItem";
import CreditCardItem from "@/components/app/vault-item/read/CreditCardItem";
import IdentityItem from "@/components/app/vault-item/read/IdentityItem";

import CreateLoginItem from "@/components/app/vault-item/create/CreateLoginItem";
import CreateSecureNoteItem from "@/components/app/vault-item/create/CreateSecureNoteItem";
import CreateCreditCardItem from "@/components/app/vault-item/create/CreateCreditCardItem";
import CreateIdentityItem from "@/components/app/vault-item/create/CreateIdentityItem";

import LoginDropdown from "@/components/app/vault-item/dropdowns/LoginDropdown";
import SecureNoteDropdown from "@/components/app/vault-item/dropdowns/SecureNoteDropdown";
import CreditCardDropdown from "@/components/app/vault-item/dropdowns/CreditCardDropdown";
import IdentityDropdown from "@/components/app/vault-item/dropdowns/IdentityDropdown";

import { VaultItem, VaultItemType } from "@/lib/types/VaultType";
import { CreditCardJSON, IdentityJSON, LoginJSON, SecureNoteJSON } from "@/lib/types/VaultItemType";
import { useVaultStore } from "@/stores/vault";
import { deriveKey, fromBase64 } from "@/lib/crypto/argon2";
import { decryptVaultKey, verifyVaultKey, decryptData } from "@/lib/crypto/aes";
import { useGetVaultPageData } from "@/lib/queries/VaultQueries";
import { cn } from "@/lib/utils";

// MAX NUMBER OF ITEMS (CURRENT + TRASHED) A VAULT CAN HOLD
const VAULT_ITEM_LIMIT = 5;

// DECRYPTED ITEMS ARE THE DB ROW MERGED WITH THE DECRYPTED JSON PAYLOAD, SO updatedAt EXISTS AT RUNTIME
type DecryptedItem = (LoginJSON | SecureNoteJSON | CreditCardJSON | IdentityJSON) & {
    updatedAt?: Date | string | null;
};

const ITEM_TYPE_FILTERS: { value: VaultItemType; label: string }[] = [
    { value: VaultItemType.LOGIN, label: "LOGIN" },
    { value: VaultItemType.SECURE_NOTE, label: "SECURE NOTE" },
    { value: VaultItemType.CREDIT_CARD, label: "CREDIT CARD" },
    { value: VaultItemType.IDENTITY, label: "IDENTITY" },
];

const ROW_BASE_CLASSES =
    "w-full min-h-fit max-h-24 text-md flex items-center justify-between cursor-pointer py-4 px-2 transition-all duration-100 ease-in";

const formatDate = (date?: Date | string | null) => (date ? new Date(date).toDateString() : "—");

// NEVER SHOW A FULL CARD NUMBER IN THE LIST
const maskCardNumber = (value: unknown) => {
    const digits = String(value ?? "").replace(/\D/g, "");
    return digits ? `•••• ${digits.slice(-4)}` : "—";
};

// SUMMARY SHOWN IN THE LEFT-HAND LIST, ONE LAYOUT PER ITEM TYPE
function ItemSummary({ item }: { item: DecryptedItem }) {
    switch (item.itemType) {
        case VaultItemType.LOGIN: {
            const login = item as LoginJSON;
            return (
                <div className="flex w-full items-center gap-3 p-2">
                    <div className="w-18.75 h-12.5 shrink-0 flex items-center justify-center bg-background rounded-xl">
                        <Globe className="size-[80%] text-primary" />
                    </div>
                    <div className="min-w-0 flex flex-col items-start justify-center">
                        <p className="max-w-full truncate text-primary font-bold">{login.name}</p>
                        <p className="max-w-full truncate font-mono text-sm">{login.email}</p>
                    </div>
                </div>
            );
        }
        case VaultItemType.SECURE_NOTE: {
            const note = item as SecureNoteJSON & { updatedAt?: Date | string | null };
            return (
                <div className="flex w-full flex-col gap-3 p-2">
                    <div className="flex flex-col items-start justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <NotebookPen className="size-6 text-primary" />
                            <p className="font-bold">{note.title}</p>
                        </div>
                        <p className="text-md text-muted-foreground font-medium line-clamp-1 w-[80%]">{note.content}</p>
                    </div>
                    <div className="flex flex-col">
                        <Separator />
                        <div className="flex items-center justify-between w-full pt-2">
                            <p className="text-xs font-medium text-muted-foreground">LAST UPDATED</p>
                            <p className="text-xs font-mono text-muted-foreground">{formatDate(note.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            );
        }
        case VaultItemType.CREDIT_CARD: {
            const card = item as CreditCardJSON;
            return (
                <div className="flex w-full flex-col gap-2 p-2">
                    <CreditCard className="size-6 text-primary" />
                    <div className="flex flex-col items-start justify-center gap-1">
                        <p className="font-bold">{card.cardHolderName}</p>
                        <p className="text-md text-muted-foreground font-medium line-clamp-1">
                            {maskCardNumber(card.cardNumber)}
                        </p>
                    </div>
                </div>
            );
        }
        case VaultItemType.IDENTITY: {
            const identity = item as IdentityJSON;
            return (
                <div className="flex w-full items-center gap-3 p-2">
                    <div className="w-18.75 h-12.5 shrink-0 flex items-center justify-center bg-background rounded-full">
                        <IdCard className="size-[70%] text-primary" />
                    </div>
                    <div className="min-w-0 flex flex-col items-start justify-center">
                        <p className="max-w-full truncate font-bold">{identity.name}</p>
                        <p className="font-mono text-sm">{identity.phoneNumber}</p>
                    </div>
                </div>
            );
        }
        default:
            return null;
    }
}

// ACTIONS DROPDOWN FOR THE SELECTED ROW
function ItemDropdown({
    item,
    open,
    onOpenChange,
}: {
    item: DecryptedItem;
    open: boolean;
    onOpenChange: () => void;
}) {
    switch (item.itemType) {
        case VaultItemType.LOGIN:
            return <LoginDropdown open={open} onOpenChange={onOpenChange} loginItem={item as LoginJSON} />;
        case VaultItemType.SECURE_NOTE:
            return <SecureNoteDropdown open={open} onOpenChange={onOpenChange} secureNoteItem={item as SecureNoteJSON} />;
        case VaultItemType.CREDIT_CARD:
            return <CreditCardDropdown open={open} onOpenChange={onOpenChange} creditCardItem={item as CreditCardJSON} />;
        case VaultItemType.IDENTITY:
            return <IdentityDropdown open={open} onOpenChange={onOpenChange} identityItem={item as IdentityJSON} />;
        default:
            return null;
    }
}

// FULL DETAILS SHOWN IN THE RIGHT-HAND PANEL
function ItemDetails({ item }: { item: DecryptedItem }) {
    switch (item.itemType) {
        case VaultItemType.LOGIN:
            return <LoginItem loginItem={item as LoginJSON} />;
        case VaultItemType.SECURE_NOTE:
            return <SecureNoteItem secureNoteItem={item as SecureNoteJSON} />;
        case VaultItemType.CREDIT_CARD:
            return <CreditCardItem creditCardItem={item as CreditCardJSON} />;
        case VaultItemType.IDENTITY:
            return <IdentityItem identityItem={item as IdentityJSON} />;
        default:
            return null;
    }
}

// THE PURPOSE OF THIS PAGE IS TO DISPLAY ALL THE VAULT ITEMS IN A VAULT IN A LIST ON THE LEFT SIDE, AND WHEN SELECTED, DISPLAY THE ITEM DETAILS ON THE RIGHT SIDE.
// LIKE LOGIN ITEMS, SECURE NOTE ITEMS, CREDIT CARD ITEMS, AND IDENTITY ITEMS
export default function ActiveVault() {
    const params = useParams();
    const router = useRouter();
    const vaultId = params.vaultId as string;

    const [selectedItemType, setSelectedItemType] = useState<VaultItemType>(VaultItemType.LOGIN);

    // STORE THE ID, NOT THE ITEM. THE ITEM IS DERIVED BELOW SO IT NEVER GOES STALE AFTER AN EDIT, REFETCH OR DELETE
    const [selectedItemId, setSelectedItemId] = useState<DecryptedItem["id"] | null>(null);

    // DROPDOWN
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);

    // ALL CRUD COMPONENT STATE MANAGEMENT
    const [createLogin, setCreateLogin] = useState<boolean>(false);
    const [createSecureNote, setCreateSecureNote] = useState<boolean>(false);
    const [createCreditCard, setCreateCreditCard] = useState<boolean>(false);
    const [createIdentity, setCreateIdentity] = useState<boolean>(false);

    const store = useVaultStore();
    const [isAutoUnlocking, setIsAutoUnlocking] = useState(false);

    // GET CURRENT VAULT ITEMS AND TRASHED VAULT ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
    // CHECKING TO SEE IF VAULT ITEM LIMIT IS REACHED IN BOTH THE CURRENT VAULT AND THE TRASH.
    const { data: vaultItems, isLoading: vaultItemsLoading, error: vaultItemsError } = useGetVaultPageData(vaultId);

    const isVaultLimit =
        !!vaultItems && (vaultItems.vaultItems?.length ?? 0) + (vaultItems.trashedCount ?? 0) >= VAULT_ITEM_LIMIT;

    // ERROR HANDLING (SIDE EFFECTS BELONG IN AN EFFECT, NOT IN THE RENDER BODY)
    useEffect(() => {
        if (!vaultItemsError) return;
        toast.error(`There was an error loading your vault. Please try refreshing the page. ${vaultItemsError.message}`);
        router.replace("/strongroom");
    }, [vaultItemsError, router]);

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

                // IF THE EFFECT WAS CLEANED UP WHILE WE WERE WORKING, DO NOTHING (DON'T WIPE THE MASTER PASSWORD)
                if (!isMounted) return;

                if (verifyVaultKey(vaultItems.verificationHash!, vaultItems.hashIv!, vaultKey)) {
                    store.unlock(vaultId, vaultKey);
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

    const needsUnlock = vaultItems && !store.isVaultUnlocked(vaultId) && !isAutoUnlocking;

    // DECRYPT EVERY ITEM IN THE VAULT
    const decryptedItems = useMemo<DecryptedItem[] | null>(() => {
        if (!vaultItems || !store.isVaultUnlocked(vaultId)) return null;
        try {
            const key = store.getVaultKey(vaultId);
            const decryptItem = (item: VaultItem) => {
                if (!item.encryptedData || !item.iv) return item;
                const json = decryptData(item.encryptedData, item.iv, key);
                return { ...item, ...JSON.parse(json) };
            };
            return (vaultItems.vaultItems?.map(decryptItem) ?? []) as DecryptedItem[];
        } catch (err) {
            console.error("Failed to decrypt items", err);
            return null;
        }
        // DEPEND ON store.vaultKeys (THE WHOLE RECORD): A NEW OBJECT REFERENCE IS PRODUCED ON EVERY UNLOCK/LOCK
    }, [vaultItems, vaultId, store.vaultKeys]);

    // FILTER ONCE BY THE SELECTED TYPE, THEN RENDER BY TYPE
    const filteredItems = useMemo(
        () => (decryptedItems ?? []).filter((item) => item.itemType === selectedItemType),
        [decryptedItems, selectedItemType]
    );

    // DERIVE THE SELECTED ITEM FROM THE LATEST DECRYPTED DATA
    const selectedItem = useMemo(
        () => (selectedItemId == null ? null : (decryptedItems ?? []).find((item) => item.id === selectedItemId) ?? null),
        [decryptedItems, selectedItemId]
    );

    if (vaultItemsError) return null;

    const isListLoading = vaultItemsLoading || isAutoUnlocking;
    const activeFilter = ITEM_TYPE_FILTERS.find((filter) => filter.value === selectedItemType);

    const emptyMessage = needsUnlock
        ? "This vault is locked."
        : !decryptedItems || decryptedItems.length === 0
            ? "No items found. Create a new item to continue."
            : `No ${activeFilter?.label.toLowerCase() ?? ""} items found.`;

    const toggleDropdown = () => setOpenDropdown((prev) => !prev);

    // DOUBLE CLICKING EMPTY SPACE (NOT AN ITEM) CLEARS THE SELECTION
    const handleListDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("[data-vault-item]")) return;
        setSelectedItemId(null);
    };

    return (
        <>
            {needsUnlock && <UnlockVaultModal open={true} vault={vaultItems} />}

            {/* ALL CRUD COMPONENTS */}
            <CreateLoginItem open={createLogin} onOpenChange={() => setCreateLogin((prev) => !prev)} vaultId={vaultId} />
            <CreateSecureNoteItem open={createSecureNote} onOpenChange={() => setCreateSecureNote((prev) => !prev)} vaultId={vaultId} />
            <CreateCreditCardItem open={createCreditCard} onOpenChange={() => setCreateCreditCard((prev) => !prev)} vaultId={vaultId} />
            <CreateIdentityItem open={createIdentity} onOpenChange={() => setCreateIdentity((prev) => !prev)} vaultId={vaultId} />

            {/* VAULT PAGE CONTAINER */}
            <ResizablePanelGroup orientation="horizontal" className="size-full flex items-center justify-center overflow-hidden">
                {/* VAULT ITEMS LIST AREA */}
                <ResizablePanel defaultSize="40%" className="size-full h-screen">
                    <div className="size-full border-r border-muted flex flex-col items-center justify-start overflow-hidden select-none">
                        {/* CREATE VAULT ITEM BUTTON */}
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button disabled={isVaultLimit || vaultItemsLoading} variant="outline" size="lg" className="w-[80%] my-8 py-6 text-md rounded-xl">
                                        {vaultItemsLoading ? (
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
                                        )}
                                    </Button>
                                }
                            />
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
                            <ToggleGroup
                                value={[selectedItemType]}
                                onValueChange={(value) => {
                                    // BASE UI ALWAYS PASSES AN ARRAY, AND IT IS EMPTY WHEN THE ACTIVE TOGGLE IS CLICKED AGAIN
                                    const next = value[0] as VaultItemType | undefined;
                                    if (next) setSelectedItemType(next);
                                }}
                                className="w-full h-fit flex items-center justify-around overflow-x-auto no-scrollbar"
                            >
                                {ITEM_TYPE_FILTERS.map((filter) => (
                                    <ToggleGroupItem key={filter.value} value={filter.value}>
                                        {filter.label}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>
                        <Separator className="bg-muted" />

                        {/* VAULT ITEMS LIST */}
                        <div className="size-full overflow-y-auto pb-8 flex items-center justify-center no-scrollbar" onDoubleClick={handleListDoubleClick}>
                            {isListLoading ? (
                                <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                    <span className="shimmer shimmer-duration-1000"> Loading... </span>
                                </CustomLoadingState>
                            ) : filteredItems.length === 0 ? (
                                <div className="text-muted-foreground mt-4 text-center max-w-fit">{emptyMessage}</div>
                            ) : (
                                <div className="size-full text-left p-4 flex flex-col items-start justify-start no-scrollbar rounded-none">
                                    {filteredItems.map((item) => {
                                        const isSelected = selectedItemId === item.id;
                                        const select = () => setSelectedItemId(item.id);

                                        return (
                                            <div
                                                key={item.id}
                                                data-vault-item
                                                className={cn(ROW_BASE_CLASSES, isSelected ? "btn-teritary" : "btn-ghost")}
                                                onClick={select}
                                            >
                                                {/* THE SUMMARY IS THE KEYBOARD TARGET; THE DROPDOWN IS A SIBLING SO NO INTERACTIVE ELEMENT IS NESTED */}
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-pressed={isSelected}
                                                    className="flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            e.preventDefault();
                                                            select();
                                                        }
                                                    }}
                                                >
                                                    <ItemSummary item={item} />
                                                </div>
                                                {isSelected && (
                                                    <ItemDropdown item={item} open={openDropdown} onOpenChange={toggleDropdown} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* SELECTED ITEMS AREA */}
                <ResizablePanel defaultSize="60%" className="size-full h-screen">
                    <div className="size-full flex items-center justify-center overflow-y-auto">
                        {isListLoading ? (
                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                <span className="shimmer shimmer-duration-1000"> Loading... </span>
                            </CustomLoadingState>
                        ) : !selectedItem ? (
                            <div className="flex flex-col items-center gap-1">
                                <SvgCircle>
                                    <LayoutList size={80} className="text-primary relative z-10" />
                                </SvgCircle>
                                <h1 className="text-2xl font-semibold text-foreground mt-2">No item selected</h1>
                                <p className="text-muted-foreground text-center">Select an item to view details.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center size-full">
                                <ItemDetails item={selectedItem} />
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}