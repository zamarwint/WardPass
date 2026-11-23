"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, type MouseEvent } from "react";
import { CreditCard, Globe, IdCard, LayoutList, NotebookPen, PlusIcon, Search, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CustomLoadingState } from "@/components/LoadingStates";
import { UnlockVaultModal } from "@/components/app/UnlockVaultModal";

import LoginItem from "@/components/app/vault-item-crud/read/LoginItem";
import SecureNoteItem from "@/components/app/vault-item-crud/read/SecureNoteItem";
import CreditCardItem from "@/components/app/vault-item-crud/read/CreditCardItem";
import IdentityItem from "@/components/app/vault-item-crud/read/IdentityItem";

import CreateLoginItem from "@/components/app/vault-item-crud/create/CreateLoginItem";
import CreateSecureNoteItem from "@/components/app/vault-item-crud/create/CreateSecureNoteItem";
import CreateCreditCardItem from "@/components/app/vault-item-crud/create/CreateCreditCardItem";
import CreateIdentityItem from "@/components/app/vault-item-crud/create/CreateIdentityItem";

import LoginDropdown from "@/components/app/vault-item-crud/dropdowns/LoginDropdown";
import SecureNoteDropdown from "@/components/app/vault-item-crud/dropdowns/SecureNoteDropdown";
import CreditCardDropdown from "@/components/app/vault-item-crud/dropdowns/CreditCardDropdown";
import IdentityDropdown from "@/components/app/vault-item-crud/dropdowns/IdentityDropdown";

import { VaultItem, VaultItemType } from "@/lib/types/VaultType";
import { CreditCardJSON, IdentityJSON, LoginJSON, SecureNoteJSON } from "@/lib/types/VaultItemType";
import { useVaultStore } from "@/stores/vault";
import { deriveKey, fromBase64 } from "@/lib/crypto/argon2";
import { decryptVaultKey, verifyVaultKey, decryptData } from "@/lib/crypto/aes";
import { useGetVaultPageData } from "@/lib/queries/VaultQueries";
import { useGetSession } from "@/lib/queries/SessionQueries";
import { cn } from "@/lib/utils";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "../ui/empty";

// DECRYPTED ITEMS ARE THE DB ROW MERGED WITH THE DECRYPTED JSON PAYLOAD, SO updatedAt EXISTS AT RUNTIME
type DecryptedItem = (LoginJSON | SecureNoteJSON | CreditCardJSON | IdentityJSON) & {
    updatedAt?: Date | string | null;
};

type ItemTypeFilter = "ALL" | VaultItemType;

// OPTIONS FOR THE ITEM TYPE SELECT
const ITEM_TYPE_OPTIONS: { value: ItemTypeFilter; label: string }[] = [
    { value: "ALL", label: "All types" },
    { value: VaultItemType.LOGIN, label: "Login" },
    { value: VaultItemType.SECURE_NOTE, label: "Secure note" },
    { value: VaultItemType.CREDIT_CARD, label: "Credit card" },
    { value: VaultItemType.IDENTITY, label: "Identity" },
];

const ROW_BASE_CLASSES =
    "w-full rounded-xl border flex items-center justify-between cursor-pointer p-3 transition-all duration-150 ease-in-out group select-none";

const formatDate = (date?: Date | string | null) => (date ? new Date(date).toDateString() : "—");

// STRIP HTML TAGS FOR CLEAN TEXT PREVIEWS IN SUMMARY CARDS
const stripHtml = (html?: string | null) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
};

// MILLISECONDS SINCE EPOCH FOR SORTING. MISSING/INVALID DATES COUNT AS 0, SO THEY SINK TO THE BOTTOM
const toTimestamp = (date?: Date | string | null) => {
    const time = date ? new Date(date).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
};

// NEVER SHOW A FULL CARD NUMBER IN THE LIST
const maskCardNumber = (value: unknown) => {
    const digits = String(value ?? "").replace(/\D/g, "");
    return digits ? `•••• ${digits.slice(-4)}` : "—";
};

// THE TEXT A SEARCH IS MATCHED AGAINST, PER ITEM TYPE.
// SECRETS (CARD NUMBER, CVV, PASSWORDS) ARE DELIBERATELY NOT SEARCHABLE.
function getSearchableText(item: DecryptedItem): string {
    switch (item.itemType) {
        case VaultItemType.LOGIN: {
            const login = item as LoginJSON;
            return [login.name, login.email, login.username, login.url].filter(Boolean).join(" ");
        }
        case VaultItemType.SECURE_NOTE: {
            const note = item as SecureNoteJSON;
            return [note.title, note.content].filter(Boolean).join(" ");
        }
        case VaultItemType.CREDIT_CARD: {
            const card = item as CreditCardJSON;
            return [card.cardHolderName].filter(Boolean).join(" ");
        }
        case VaultItemType.IDENTITY: {
            const identity = item as IdentityJSON;
            return [identity.name, identity.email, identity.phoneNumber].filter(Boolean).join(" ");
        }
        default:
            return "";
    }
}

// SUMMARY SHOWN IN THE LEFT-HAND LIST, MODERN AND UNIFORM ACROSS ALL ITEM TYPES
function ItemSummary({ item }: { item: DecryptedItem }) {
    switch (item.itemType) {
        case VaultItemType.LOGIN: {
            const login = item as LoginJSON;
            return (
                <div className="flex w-full items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105">
                        <Globe className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col items-start justify-center">
                        <div className="flex items-center gap-2 w-full">
                            <span className="font-semibold text-sm truncate text-foreground">{login.name}</span>
                            <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4 shrink-0 text-blue-500/90 dark:text-blue-400/90 border-blue-500/25 bg-blue-500/5">
                                Login
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate w-full font-mono mt-0.5">
                            {login.username || login.email || login.url || "No account details"}
                        </p>
                    </div>
                </div>
            );
        }
        case VaultItemType.SECURE_NOTE: {
            const note = item as SecureNoteJSON & { updatedAt?: Date | string | null };
            const preview = stripHtml(note.content);
            return (
                <div className="flex w-full items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105">
                        <NotebookPen className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col items-start justify-center">
                        <div className="flex items-center gap-2 w-full">
                            <span className="font-semibold text-sm truncate text-foreground">{note.title}</span>
                            <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4 shrink-0 text-amber-500/90 dark:text-amber-400/90 border-amber-500/25 bg-amber-500/5">
                                Note
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate w-full mt-0.5">
                            {preview || "Empty note"}
                        </p>
                    </div>
                </div>
            );
        }
        case VaultItemType.CREDIT_CARD: {
            const card = item as CreditCardJSON;
            return (
                <div className="flex w-full items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105">
                        <CreditCard className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col items-start justify-center">
                        <div className="flex items-center gap-2 w-full">
                            <span className="font-semibold text-sm truncate text-foreground">{card.cardHolderName || "Payment Card"}</span>
                            <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4 shrink-0 text-emerald-500/90 dark:text-emerald-400/90 border-emerald-500/25 bg-emerald-500/5">
                                Card
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate w-full font-mono mt-0.5">
                            {maskCardNumber(card.cardNumber)}
                            {card.expiryDate ? ` • Exp: ${card.expiryDate}` : ""}
                        </p>
                    </div>
                </div>
            );
        }
        case VaultItemType.IDENTITY: {
            const identity = item as IdentityJSON;
            const subtitle = [identity.occupation, identity.companyName, identity.email].filter(Boolean).join(" • ") || (identity.phoneNumber ? String(identity.phoneNumber) : "Identity profile");
            return (
                <div className="flex w-full items-center gap-3 min-w-0">
                    <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105">
                        <IdCard className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col items-start justify-center">
                        <div className="flex items-center gap-2 w-full">
                            <span className="font-semibold text-sm truncate text-foreground">{identity.name}</span>
                            <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4 shrink-0 text-purple-500/90 dark:text-purple-400/90 border-purple-500/25 bg-purple-500/5">
                                Identity
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate w-full mt-0.5">
                            {subtitle}
                        </p>
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

// THE PURPOSE OF THIS PAGE IS TO DISPLAY ALL THE VAULT ITEMS IN A VAULT IN A LIST ON THE LEFT SIDE (NEWEST CHANGES FIRST),
// AND WHEN SELECTED, DISPLAY THE ITEM DETAILS ON THE RIGHT SIDE.
// ITEMS ARE ENCRYPTED, SO SEARCHING AND FILTERING HAPPEN CLIENT-SIDE ON THE ITEMS DECRYPTED BELOW.
export default function ActiveVault() {
    const params = useParams();
    const router = useRouter();
    const vaultId = params.vaultId as string;

    // SEARCH + TYPE FILTER STATE
    const [searchText, setSearchText] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<ItemTypeFilter>("ALL");

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
    const session = useGetSession();
    const vaultItemLimit = (vaultItems as any)?.vaultItemLimit ?? (session.data?.user as any)?.vaultItemLimit ?? 5;

    const isVaultLimit =
        !!vaultItems && (vaultItems.vaultItems?.length ?? 0) + (vaultItems.trashedCount ?? 0) >= vaultItemLimit;

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
        const key = store.getVaultKey(vaultId);
        if (!key) return null;

        const decryptItem = (item: VaultItem): DecryptedItem | null => {
            if (!item || !item.id) return null;
            if (!item.encryptedData || !item.iv) {
                return item as unknown as DecryptedItem;
            }
            try {
                const json = decryptData(item.encryptedData, item.iv, key);
                const parsed = JSON.parse(json);
                return { ...item, ...parsed } as DecryptedItem;
            } catch (err) {
                console.error(`Failed to decrypt item ${item.id}:`, err);
                return {
                    ...item,
                    name: "Decryption failed",
                    title: "Decryption failed",
                    cardHolderName: "Decryption failed",
                } as unknown as DecryptedItem;
            }
        };

        return (vaultItems.vaultItems?.map(decryptItem).filter((item): item is DecryptedItem => item !== null) ?? []);
        // DEPEND ON store.vaultKeys (THE WHOLE RECORD): A NEW OBJECT REFERENCE IS PRODUCED ON EVERY UNLOCK/LOCK
    }, [vaultItems, vaultId, store.vaultKeys]);

    // SORT BY LAST MODIFIED, MOST RECENT FIRST (COPY FIRST: NEVER SORT THE MEMOIZED ARRAY IN PLACE)
    const sortedItems = useMemo(
        () => [...(decryptedItems ?? [])].sort((a, b) => toTimestamp(b.updatedAt) - toTimestamp(a.updatedAt)),
        [decryptedItems]
    );

    // THE SEARCH AND THE TYPE SELECT COMBINE: AN ITEM MUST MATCH THE SELECTED TYPE AND EVERY WORD OF THE SEARCH
    const query = searchText.trim().toLowerCase();
    const filteredItems = useMemo(() => {
        const terms = query ? query.split(/\s+/) : [];

        return sortedItems.filter((item) => {
            if (typeFilter !== "ALL" && item.itemType !== typeFilter) return false;
            if (terms.length === 0) return true;

            const haystack = getSearchableText(item).toLowerCase();
            return terms.every((term) => haystack.includes(term));
        });
    }, [sortedItems, typeFilter, query]);

    // DERIVE THE SELECTED ITEM FROM THE LATEST DECRYPTED DATA
    const selectedItem = useMemo(
        () => (selectedItemId == null ? null : (decryptedItems ?? []).find((item) => item.id === selectedItemId) ?? null),
        [decryptedItems, selectedItemId]
    );

    if (vaultItemsError) return null;

    const isListLoading = vaultItemsLoading || isAutoUnlocking;
    const isFiltering = query !== "" || typeFilter !== "ALL";
    const hasItems = !!decryptedItems && decryptedItems.length > 0;
    const activeTypeLabel = ITEM_TYPE_OPTIONS.find((option) => option.value === typeFilter)?.label.toLowerCase() ?? "";

    const emptyMessage = needsUnlock
        ? "This vault is locked."
        : !hasItems
            ? "No items found. Create a new item to continue."
            : query
                ? `No results for "${searchText.trim()}"${typeFilter !== "ALL" ? ` in ${activeTypeLabel} items` : ""}.`
                : `No ${activeTypeLabel} items found.`;

    const toggleDropdown = () => setOpenDropdown((prev) => !prev);

    const resetFilters = () => {
        setSearchText("");
        setTypeFilter("ALL");
    };

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
            <ResizablePanelGroup orientation="horizontal" className="size-full overflow-hidden">
                {/* VAULT ITEMS LIST AREA */}
                <ResizablePanel defaultSize="32%" minSize="22%" maxSize="50%" className="size-full border-r border-border/50 flex flex-col overflow-hidden bg-background select-none">
                    {/* TOP ACTION BAR: SIDEBAR TRIGGER & CREATE BUTTON */}
                    <div className="w-full p-3.5 border-b border-border/40 shrink-0 flex items-center gap-2 bg-background">
                        <SidebarTrigger className="shrink-0 cursor-pointer" />
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        disabled={isVaultLimit || vaultItemsLoading}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-9 py-5 text-sm rounded-xl font-medium cursor-pointer border-dashed border-primary/40 hover:border-primary/80 hover:bg-primary/5 transition-all"
                                    >
                                        {vaultItemsLoading ? (
                                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                                <span className="shimmer shimmer-duration-1000"> Loading... </span>
                                            </CustomLoadingState>
                                        ) : isVaultLimit ? (
                                            <>
                                                <XIcon size={18} className="text-foreground mr-2 shrink-0" />
                                                <span className="truncate">Limit Reached</span>
                                            </>
                                        ) : (
                                            <>
                                                <PlusIcon size={18} className="text-primary mr-2 shrink-0" />
                                                <span>Add New Item</span>
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
                    </div>

                    {/* VAULT ITEM SEARCH BAR + TYPE SELECT */}
                    <div className="w-full flex items-center gap-2 px-3.5 py-3 border-b border-border/40 shrink-0 bg-muted/10">
                        <InputGroup className="flex-1 min-w-0 h-8.5">
                            <InputGroupInput
                                id="vault-item-search"
                                aria-label="Search vault items"
                                placeholder="Search vault items..."
                                autoComplete="off"
                                spellCheck={false}
                                disabled={!hasItems}
                                // THE PANEL IS select-none, WHICH SAFARI APPLIES TO INPUTS TOO: KEEP THE FIELD TYPEABLE
                                className="select-text"
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape" && searchText) {
                                        e.preventDefault();
                                        setSearchText("");
                                    }
                                }}
                                value={searchText}
                            />
                            <InputGroupAddon>
                                <Search className="size-4 text-muted-foreground" />
                            </InputGroupAddon>
                            {searchText && (
                                <InputGroupAddon align="inline-end">
                                    <button
                                        type="button"
                                        aria-label="Clear search"
                                        onClick={() => setSearchText("")}
                                        className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        <XIcon className="size-4" />
                                    </button>
                                </InputGroupAddon>
                            )}
                        </InputGroup>

                        {/* ITEM TYPE FILTER */}
                        <Select
                            items={ITEM_TYPE_OPTIONS}
                            value={typeFilter as VaultItemType}
                            onValueChange={(value) => {
                                // BASE UI CAN PASS null, SO IGNORE IT
                                if (value) setTypeFilter(value as ItemTypeFilter);
                            }}
                            disabled={!hasItems}
                        >
                            <SelectTrigger aria-label="Filter by item type" className="w-36 shrink-0 h-8.5 data-[size=default]:h-8.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ITEM_TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* VAULT ITEMS LIST */}
                    <div
                        className="flex-1 w-full overflow-y-auto no-scrollbar"
                        onDoubleClick={handleListDoubleClick}
                    >
                        {isListLoading ? (
                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2 py-12">
                                <span className="shimmer shimmer-duration-1000"> Loading... </span>
                            </CustomLoadingState>
                        ) : filteredItems.length === 0 ? (
                            <div className="size-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                                <p className="text-sm">{emptyMessage}</p>
                                {isFiltering && hasItems && (
                                    <Button variant="outline" size="sm" onClick={resetFilters} className="mt-3 cursor-pointer">
                                        Clear search and filter
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="w-full p-3.5 flex flex-col items-stretch justify-start gap-2.5 no-scrollbar">
                                {isFiltering && (
                                    <p className="text-xs font-medium text-muted-foreground px-1 pb-1" aria-live="polite">
                                        {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
                                    </p>
                                )}
                                {filteredItems.map((item) => {
                                    const isSelected = selectedItemId === item.id;
                                    const select = () => setSelectedItemId(item.id);

                                    return (
                                        <div
                                            key={item.id}
                                            data-vault-item
                                            className={cn(
                                                ROW_BASE_CLASSES,
                                                isSelected
                                                    ? "bg-accent/80 border-primary/50 shadow-xs ring-1 ring-primary/20"
                                                    : "border-border/40 bg-card/30 hover:bg-muted/50 hover:border-border/70"
                                            )}
                                            onClick={select}
                                        >
                                            {/* THE SUMMARY IS THE KEYBOARD TARGET; THE DROPDOWN IS A SIBLING SO NO INTERACTIVE ELEMENT IS NESTED */}
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                aria-pressed={isSelected}
                                                className="flex-1 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
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
                                                <div className="shrink-0 pl-1">
                                                    <ItemDropdown item={item} open={openDropdown} onOpenChange={toggleDropdown} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* SELECTED ITEMS AREA */}
                <ResizablePanel defaultSize="68%" minSize="35%" className="size-full flex flex-col overflow-hidden bg-background">
                    {isListLoading ? (
                        <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                            <span className="shimmer shimmer-duration-1000"> Loading... </span>
                        </CustomLoadingState>
                    ) : !selectedItem ? (
                        <div className="size-full flex items-center justify-center p-8">
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <LayoutList className="text-primary relative z-10" />
                                    </EmptyMedia>
                                    <EmptyTitle className="text-xl">No item selected</EmptyTitle>
                                    <EmptyDescription className="text-sm">Select an item from the list to view its details.</EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </div>
                    ) : (
                        <div className="size-full overflow-y-auto">
                            <ItemDetails item={selectedItem} />
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}