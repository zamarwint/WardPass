"use client";

import { useState, useEffect, useMemo, useRef, type FormEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowLeftIcon,
    CreditCard,
    Globe,
    IdCard,
    Lock,
    Unlock,
    NotebookPen,
    Trash2Icon,
    Loader2Icon,
    KeyRound,
    X,
    Eye,
    EyeOff,
    Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { RenderIcon } from "@/components/IconMap";
import { SvgCircle } from "@/components/app/SVG";
import { CustomLoadingState } from "@/components/LoadingStates";
import { useVaultStore } from "@/stores/vault";
import { useGetAllVaultsWithTrashedItems } from "@/lib/queries/VaultQueries";
import { Vault, VaultItemType } from "@/lib/types/VaultType";
import { CreditCardJSON, IdentityJSON, LoginJSON, SecureNoteJSON } from "@/lib/types/VaultItemType";
import { cn } from "@/lib/utils";

import { fromBase64 } from "@/lib/crypto/utils";
import { deriveKey } from "@/lib/crypto/argon2";
import { decryptData, decryptVaultKey, verifyVaultKey } from "@/lib/crypto/aes";

import RestoreLoginItemDialog from "@/components/app/trash/restore/RestoreLoginItemDialog";
import DeleteLoginItemDialog from "@/components/app/trash/delete/DeleteLoginItemDialog";
import RestoreSecureNoteItemDialog from "@/components/app/trash/restore/RestoreSecureNoteItemDialog";
import DeleteSecureNoteItemDialog from "@/components/app/trash/delete/DeleteSecureNoteItemDialog";
import RestoreCreditCardItemDialog from "@/components/app/trash/restore/RestoreCreditCardItemDialog";
import DeleteCreditCardItemDialog from "@/components/app/trash/delete/DeleteCreditCardItemDialog";
import RestoreIdentityItemDialog from "@/components/app/trash/restore/RestoreIdentityItemDialog";
import DeleteIdentityItemDialog from "@/components/app/trash/delete/DeleteIdentityItemDialog";

export type DecryptedTrashedItem = (
    | (LoginJSON & { itemType: VaultItemType.LOGIN })
    | (SecureNoteJSON & { itemType: VaultItemType.SECURE_NOTE })
    | (CreditCardJSON & { itemType: VaultItemType.CREDIT_CARD })
    | (IdentityJSON & { itemType: VaultItemType.IDENTITY })
) & {
    vaultId: string;
    vaultName: string;
    vaultIcon: string;
    vaultIconColor: string | null;
};

type TrashedCard = Extract<DecryptedTrashedItem, { itemType: VaultItemType.CREDIT_CARD }>;

type ItemTypeFilter = "ALL" | VaultItemType;

// OPTIONS FOR THE ITEM TYPE SELECT
const ITEM_TYPE_OPTIONS: { value: ItemTypeFilter; label: string }[] = [
    { value: "ALL", label: "All types" },
    { value: VaultItemType.LOGIN, label: "Login" },
    { value: VaultItemType.SECURE_NOTE, label: "Secure note" },
    { value: VaultItemType.CREDIT_CARD, label: "Credit card" },
    { value: VaultItemType.IDENTITY, label: "Identity" },
];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const formatDate = (date?: Date | string | null) => (date ? new Date(date).toLocaleDateString() : "—");

// MILLISECONDS SINCE EPOCH FOR SORTING. MISSING/INVALID DATES COUNT AS 0, SO THEY SINK TO THE BOTTOM
const toTimestamp = (date?: Date | string | null) => {
    const time = date ? new Date(date).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
};

// WHEN THE ITEM WAS MOVED TO THE TRASH (FALLS BACK TO updatedAt IF deletedAt IS MISSING)
const getDeletedTimestamp = (item: DecryptedTrashedItem) => toTimestamp(item.deletedAt ?? item.updatedAt);

// SHOW ONLY THE LAST 4 DIGITS
const maskCardNumber = (value: unknown) => {
    const digits = String(value ?? "").replace(/\D/g, "");
    return `•••• •••• •••• ${digits.slice(-4)}`;
};

function getTypeLabel(type: VaultItemType) {
    switch (type) {
        case VaultItemType.LOGIN:
            return "Login";
        case VaultItemType.SECURE_NOTE:
            return "Secure Note";
        case VaultItemType.CREDIT_CARD:
            return "Credit Card";
        case VaultItemType.IDENTITY:
            return "Identity";
        default:
            return String(type);
    }
}

function getItemTitle(item: DecryptedTrashedItem) {
    switch (item.itemType) {
        case VaultItemType.LOGIN:
            return item.name;
        case VaultItemType.SECURE_NOTE:
            return item.title;
        case VaultItemType.CREDIT_CARD:
            return item.cardHolderName;
        case VaultItemType.IDENTITY:
            return item.name;
        default:
            return "";
    }
}

function getItemSubtitle(item: DecryptedTrashedItem) {
    switch (item.itemType) {
        case VaultItemType.LOGIN:
            return item.email;
        case VaultItemType.SECURE_NOTE:
            return item.content;
        case VaultItemType.CREDIT_CARD:
            return maskCardNumber(item.cardNumber);
        case VaultItemType.IDENTITY:
            return item.phoneNumber;
        default:
            return "";
    }
}

// THE TEXT A SEARCH IS MATCHED AGAINST, PER ITEM TYPE (PLUS THE VAULT NAME, WHICH EVERY ROW DISPLAYS).
// SECRETS (CARD NUMBER, CVV) ARE DELIBERATELY NOT SEARCHABLE.
function getSearchableText(item: DecryptedTrashedItem): string {
    let fields: unknown[];

    switch (item.itemType) {
        case VaultItemType.LOGIN:
            fields = [item.name, item.email, item.username, item.url];
            break;
        case VaultItemType.SECURE_NOTE:
            fields = [item.title, item.content];
            break;
        case VaultItemType.CREDIT_CARD:
            fields = [item.cardHolderName];
            break;
        case VaultItemType.IDENTITY:
            fields = [item.name, item.email, item.phoneNumber];
            break;
        default:
            fields = [];
    }

    return [...fields, item.vaultName]
        .filter((value): value is string => typeof value === "string" && value.length > 0)
        .join(" ");
}

/* -------------------------------------------------------------------------- */
/*                              SMALL COMPONENTS                              */
/* -------------------------------------------------------------------------- */

function ItemTypeIcon({ type, className }: { type: VaultItemType; className?: string }) {
    switch (type) {
        case VaultItemType.LOGIN:
            return <Globe className={className} />;
        case VaultItemType.SECURE_NOTE:
            return <NotebookPen className={className} />;
        case VaultItemType.CREDIT_CARD:
            return <CreditCard className={className} />;
        case VaultItemType.IDENTITY:
            return <IdCard className={className} />;
        default:
            return null;
    }
}

// RESTORE + DELETE DIALOGS FOR WHATEVER TYPE THE ITEM IS
function ItemActions({ item }: { item: DecryptedTrashedItem }) {
    switch (item.itemType) {
        case VaultItemType.LOGIN:
            return (
                <>
                    <RestoreLoginItemDialog loginItem={item} />
                    <DeleteLoginItemDialog loginItem={item} />
                </>
            );
        case VaultItemType.SECURE_NOTE:
            return (
                <>
                    <RestoreSecureNoteItemDialog secureNoteItem={item} />
                    <DeleteSecureNoteItemDialog secureNoteItem={item} />
                </>
            );
        case VaultItemType.CREDIT_CARD:
            return (
                <>
                    <RestoreCreditCardItemDialog creditCardItem={item} />
                    <DeleteCreditCardItemDialog creditCardItem={item} />
                </>
            );
        case VaultItemType.IDENTITY:
            return (
                <>
                    <RestoreIdentityItemDialog identityItem={item} />
                    <DeleteIdentityItemDialog identityItem={item} />
                </>
            );
        default:
            return null;
    }
}

function DetailField({
    label,
    value,
    mono = true,
    className,
}: {
    label: string;
    value?: string | number | null;
    mono?: boolean;
    className?: string;
}) {
    if (value == null || value === "") return null;

    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">{label}</span>
            <span className={cn("bg-muted/40 p-2 rounded-md", mono && "font-mono", className)}>{value}</span>
        </div>
    );
}

// CARD NUMBER + CVV ARE HIDDEN UNTIL THE USER ASKS TO SEE THEM
// (THE PARENT RENDERS THIS WITH key={item.id}, SO IT RE-HIDES WHEN A DIFFERENT ITEM IS SELECTED)
function CreditCardFields({ card }: { card: TrashedCard }) {
    const [revealed, setRevealed] = useState(false);

    return (
        <>
            <DetailField label="Cardholder Name" value={card.cardHolderName} />

            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Card Details</span>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs cursor-pointer"
                    onClick={() => setRevealed((prev) => !prev)}
                >
                    {revealed ? <EyeOff className="size-3.5 mr-1.5" /> : <Eye className="size-3.5 mr-1.5" />}
                    {revealed ? "Hide" : "Reveal"}
                </Button>
            </div>

            <DetailField label="Card Number" value={revealed ? card.cardNumber : maskCardNumber(card.cardNumber)} />
            <div className="grid grid-cols-2 gap-2">
                <DetailField label="Expiry" value={card.expiryDate} />
                <DetailField label="CVV" value={revealed ? card.cvv : "•••"} />
            </div>

            {card.billingAddress1 && (
                <DetailField
                    label="Billing Address"
                    mono={false}
                    value={[card.billingAddress1, card.city, card.country].filter(Boolean).join(", ")}
                />
            )}
        </>
    );
}

function ItemDetailFields({ item }: { item: DecryptedTrashedItem }) {
    switch (item.itemType) {
        case VaultItemType.LOGIN:
            return (
                <>
                    <DetailField label="Username" value={item.username} />
                    <DetailField label="Email" value={item.email} />
                    <DetailField label="Website" value={item.url} className="truncate" />
                    <DetailField label="Note" value={item.note} mono={false} className="whitespace-pre-wrap" />
                </>
            );
        case VaultItemType.SECURE_NOTE:
            return (
                <DetailField
                    label="Note Content"
                    value={item.content}
                    className="p-3 whitespace-pre-wrap text-xs max-h-60 overflow-y-auto"
                />
            );
        case VaultItemType.CREDIT_CARD:
            return <CreditCardFields card={item} />;
        case VaultItemType.IDENTITY:
            return (
                <>
                    <DetailField label="Full Name" value={item.name} />
                    <DetailField label="Email" value={item.email} />
                    <DetailField label="Phone Number" value={item.phoneNumber} />
                </>
            );
        default:
            return null;
    }
}

function PasswordField({
    id,
    value,
    onChange,
    ariaLabel,
}: {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    ariaLabel?: string;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Input
                id={id}
                type={visible ? "text" : "password"}
                placeholder="Enter vault password"
                aria-label={ariaLabel}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 pr-9"
                autoFocus
            />
            <button
                type="button"
                aria-label={visible ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setVisible((prev) => !prev)}
            >
                {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}

// ONE ROW IN THE TRASH LIST
// THE SUMMARY IS THE CLICK/KEYBOARD TARGET AND THE ACTIONS ARE ITS SIBLING, SO NO INTERACTIVE ELEMENT IS NESTED
// AND CLICKS INSIDE THE (PORTALED) DIALOGS CAN'T BUBBLE UP AND CHANGE THE SELECTION
function TrashRow({
    item,
    isSelected,
    onSelect,
}: {
    item: DecryptedTrashedItem;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <div
            data-trash-item
            className={cn(
                "w-full rounded-lg border border-border/40 flex items-center justify-between transition-all duration-150",
                isSelected ? "bg-accent/80 border-primary/50 shadow-xs" : "hover:bg-muted/50"
            )}
        >
            <div
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                className="flex items-center gap-3 min-w-0 flex-1 p-3.5 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={onSelect}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect();
                    }
                }}
            >
                {/* TYPE ICON */}
                <div className="size-11 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border/50">
                    <ItemTypeIcon type={item.itemType} className="size-5 text-primary" />
                </div>

                {/* DETAILS */}
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{getItemTitle(item)}</span>
                        {/* VAULT BADGE */}
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-muted px-2 py-0.5 rounded-full shrink-0 text-muted-foreground">
                            <RenderIcon name={item.vaultIcon} size={12} color={item.vaultIconColor ?? "white"} />
                            {item.vaultName}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-mono mt-0.5">{getItemSubtitle(item)}</p>
                </div>
            </div>

            {/* ACTION BUTTONS (RESTORE / DELETE DIALOGS) */}
            <div className="flex items-center gap-1 shrink-0 pl-2 pr-3.5">
                <ItemActions item={item} />
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  MAIN PAGE                                 */
/* -------------------------------------------------------------------------- */

export default function TrashBinClient() {
    const router = useRouter();
    const store = useVaultStore();

    // Queries
    const { data: vaultsData, isLoading, error } = useGetAllVaultsWithTrashedItems();
    // MEMOIZED SO `vaults` KEEPS THE SAME IDENTITY BETWEEN RENDERS (A FRESH `[]` EVERY RENDER RE-TRIGGERED THE EFFECT/MEMOS)
    const vaults = useMemo<Vault[]>(() => (vaultsData as Vault[] | undefined) ?? [], [vaultsData]);

    // Filters & Selection
    const [selectedVaultFilter, setSelectedVaultFilter] = useState<string>("ALL");
    const [typeFilter, setTypeFilter] = useState<ItemTypeFilter>("ALL");
    const [searchText, setSearchText] = useState<string>("");
    // STORE THE ID, NOT THE ITEM: THE ITEM IS DERIVED BELOW SO IT DISAPPEARS WHEN IT'S RESTORED / PERMANENTLY DELETED
    const [selectedItemId, setSelectedItemId] = useState<DecryptedTrashedItem["id"] | null>(null);

    // Modal state for unlocking vaults
    const [unlockModalOpen, setUnlockModalOpen] = useState(false);
    const [targetVaultIdForModal, setTargetVaultIdForModal] = useState<string>("ALL");
    const [modalPassword, setModalPassword] = useState("");
    const [modalSubmitting, setModalSubmitting] = useState(false);

    // Inline unlock state for specific locked vaults
    const [inlinePassword, setInlinePassword] = useState("");
    const [inlineSubmitting, setInlineSubmitting] = useState(false);

    // REMEMBERS WHICH VAULTS ALREADY FAILED TO AUTO-UNLOCK WITH THE CURRENT MASTER PASSWORD,
    // SO THE (EXPENSIVE) KEY DERIVATION ISN'T REPEATED EVERY TIME ANOTHER VAULT UNLOCKS
    const autoUnlockAttempts = useRef<{ password: string; vaultIds: Set<string> }>({
        password: "",
        vaultIds: new Set(),
    });

    // Auto-unlock vaults that match the stored masterPassword (if already entered in this session)
    useEffect(() => {
        const masterPassword = store.masterPassword;
        if (!vaults.length || !masterPassword) return;

        if (autoUnlockAttempts.current.password !== masterPassword) {
            autoUnlockAttempts.current = { password: masterPassword, vaultIds: new Set() };
        }
        const attempted = autoUnlockAttempts.current.vaultIds;

        let isMounted = true;
        const autoUnlockVaults = async () => {
            for (const v of vaults) {
                if (!isMounted) return;
                if (attempted.has(v.id) || store.isVaultUnlocked(v.id)) continue;
                if (!v.salt || !v.encryptedKey || !v.keyIv || !v.verificationHash || !v.hashIv) continue;

                try {
                    const derived = await deriveKey(masterPassword, fromBase64(v.salt));
                    // THE EFFECT WAS CLEANED UP WHILE DERIVING: STOP, THE NEW RUN TAKES OVER
                    if (!isMounted) return;

                    const vKey = decryptVaultKey(v.encryptedKey, v.keyIv, derived);
                    if (verifyVaultKey(v.verificationHash, v.hashIv, vKey)) {
                        store.unlock(v.id, vKey);
                    }
                } catch {
                    // Different password for this vault; leave locked silently
                }
                attempted.add(v.id);
            }
        };

        autoUnlockVaults();
        return () => {
            isMounted = false;
        };
    }, [vaults, store.vaultKeys, store.masterPassword]);

    // Track locked vaults
    const lockedVaults = useMemo(() => {
        return vaults.filter((v) => !store.isVaultUnlocked(v.id));
    }, [vaults, store.vaultKeys]);

    // Decrypt all items from unlocked vaults
    const decryptedItems = useMemo<DecryptedTrashedItem[]>(() => {
        const items: DecryptedTrashedItem[] = [];

        for (const v of vaults) {
            if (!store.isVaultUnlocked(v.id)) continue;

            let key: Uint8Array;
            try {
                key = store.getVaultKey(v.id);
            } catch {
                continue;
            }

            for (const item of v.vaultItems ?? []) {
                if (!item.encryptedData || !item.iv) continue;
                try {
                    const jsonStr = decryptData(item.encryptedData, item.iv, key);
                    const parsed = JSON.parse(jsonStr);
                    items.push({
                        ...item,
                        ...parsed,
                        vaultId: v.id,
                        vaultName: v.name,
                        vaultIcon: v.icon,
                        vaultIconColor: v.iconColor,
                    });
                } catch (err) {
                    console.error("Failed to decrypt trashed item", item.id, err);
                }
            }
        }

        // Sort by deletion date, newest first
        return items.sort((a, b) => getDeletedTimestamp(b) - getDeletedTimestamp(a));
    }, [vaults, store.vaultKeys]);

    // THE VAULT BUTTONS, THE TYPE SELECT AND THE SEARCH COMBINE: AN ITEM MUST PASS ALL THREE.
    // SEARCHING ONLY COVERS ITEMS ALREADY DECRYPTED (I.E. UNLOCKED VAULTS), SINCE THE REST ARE STILL ENCRYPTED.
    const query = searchText.trim().toLowerCase();
    const filteredItems = useMemo(() => {
        const terms = query ? query.split(/\s+/) : [];

        return decryptedItems.filter((item) => {
            if (selectedVaultFilter !== "ALL" && item.vaultId !== selectedVaultFilter) return false;
            if (typeFilter !== "ALL" && item.itemType !== typeFilter) return false;
            if (terms.length === 0) return true;

            const haystack = getSearchableText(item).toLowerCase();
            return terms.every((term) => haystack.includes(term));
        });
    }, [decryptedItems, selectedVaultFilter, typeFilter, query]);

    // The selected item always comes from the latest decrypted data
    const selectedItem = useMemo(
        () => (selectedItemId == null ? null : decryptedItems.find((item) => item.id === selectedItemId) ?? null),
        [decryptedItems, selectedItemId]
    );

    // Total trashed items count across all vaults
    const totalTrashedCount = useMemo(() => {
        return vaults.reduce((acc, v) => acc + (v.vaultItems?.length ?? 0), 0);
    }, [vaults]);

    // Check if the currently selected vault filter is locked
    const isCurrentFilterLocked = useMemo(() => {
        if (selectedVaultFilter === "ALL") return false;
        return !store.isVaultUnlocked(selectedVaultFilter);
    }, [selectedVaultFilter, store.vaultKeys]);

    const activeFilterVault = useMemo(() => {
        return vaults.find((v) => v.id === selectedVaultFilter);
    }, [vaults, selectedVaultFilter]);

    // Handler to unlock one or all locked vaults via password
    const handleUnlockVaults = async (password: string, specificVaultId: string = "ALL") => {
        if (!password) {
            toast.error("Please enter your vault password.");
            return false;
        }

        const targets =
            specificVaultId === "ALL"
                ? lockedVaults
                : vaults.filter((v) => v.id === specificVaultId && !store.isVaultUnlocked(v.id));

        if (!targets.length) {
            toast.info(specificVaultId === "ALL" ? "All vaults are already unlocked." : "This vault is already unlocked.");
            return true;
        }

        const successfullyUnlocked: string[] = [];
        const failedVaults: string[] = [];

        for (const v of targets) {
            if (!v.salt || !v.encryptedKey || !v.keyIv || !v.verificationHash || !v.hashIv) {
                failedVaults.push(v.name);
                continue;
            }

            try {
                const derived = await deriveKey(password, fromBase64(v.salt));
                const vKey = decryptVaultKey(v.encryptedKey, v.keyIv, derived);

                if (verifyVaultKey(v.verificationHash, v.hashIv, vKey)) {
                    store.unlock(v.id, vKey);
                    successfullyUnlocked.push(v.name);
                } else {
                    failedVaults.push(v.name);
                }
            } catch (err) {
                console.error("Failed to unlock vault", v.name, err);
                failedVaults.push(v.name);
            }
        }

        // SET THE SESSION PASSWORD ONCE, AFTER THE LOOP (NOT ON EVERY SUCCESS INSIDE IT)
        if (successfullyUnlocked.length > 0 && !store.masterPassword) {
            store.setMasterPassword(password);
        }

        if (successfullyUnlocked.length > 0) {
            if (failedVaults.length === 0) {
                toast.success(
                    successfullyUnlocked.length === 1
                        ? `Vault "${successfullyUnlocked[0]}" unlocked!`
                        : `Unlocked ${successfullyUnlocked.length} vaults successfully!`
                );
                return true;
            } else {
                toast.success(`Unlocked: ${successfullyUnlocked.join(", ")}`);
                toast.error(
                    `Incorrect password for: ${failedVaults.join(", ")}. These vaults may use a different password.`
                );
                return false;
            }
        } else {
            toast.error("Incorrect password. Please verify the password for this vault.");
            return false;
        }
    };

    const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setModalSubmitting(true);
        try {
            const success = await handleUnlockVaults(modalPassword, targetVaultIdForModal);
            if (success) closeUnlockDialog();
        } finally {
            setModalSubmitting(false);
        }
    };

    const handleInlineUnlockSubmit = async (e: FormEvent<HTMLFormElement>, vaultId: string) => {
        e.preventDefault();
        setInlineSubmitting(true);
        try {
            const success = await handleUnlockVaults(inlinePassword, vaultId);
            if (success) setInlinePassword("");
        } finally {
            setInlineSubmitting(false);
        }
    };

    const openUnlockDialog = (vaultId: string = "ALL") => {
        setTargetVaultIdForModal(vaultId);
        setModalPassword("");
        setUnlockModalOpen(true);
    };

    // ALWAYS WIPE THE TYPED PASSWORD FROM STATE WHEN THE DIALOG CLOSES (CANCEL, ESC, CLICK OUTSIDE OR SUCCESS)
    const closeUnlockDialog = () => {
        setUnlockModalOpen(false);
        setModalPassword("");
    };

    // CHANGING VAULT FILTERS MUST NOT CARRY A PASSWORD TYPED FOR ANOTHER VAULT
    const selectVaultFilter = (vaultId: string) => {
        setSelectedVaultFilter(vaultId);
        setInlinePassword("");
    };

    // CLEARS THE SEARCH, THE TYPE SELECT AND THE VAULT BUTTONS
    const resetFilters = () => {
        setSearchText("");
        setTypeFilter("ALL");
        selectVaultFilter("ALL");
    };

    // DOUBLE CLICKING EMPTY SPACE (NOT A ROW) CLEARS THE SELECTION
    const handleListDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("[data-trash-item]")) return;
        setSelectedItemId(null);
    };

    // SEARCH / SELECT STATE USED BY THE TOOLBAR AND THE EMPTY STATE
    const isFiltering = query !== "" || typeFilter !== "ALL";
    const isNarrowed = isFiltering || selectedVaultFilter !== "ALL";
    // NOTHING TO SEARCH YET (LOADING, LOCKED OR EMPTY), UNLESS A FILTER IS ALREADY SET (SO IT CAN STILL BE CLEARED)
    const isToolbarDisabled = isLoading || (decryptedItems.length === 0 && !isFiltering);
    const activeTypeLabel = ITEM_TYPE_OPTIONS.find((option) => option.value === typeFilter)?.label.toLowerCase() ?? "";
    const hasLockedVaultsInView = lockedVaults.length > 0 && selectedVaultFilter === "ALL";
    const lockedVaultsNote = `${lockedVaults.length} locked vault${lockedVaults.length !== 1 ? "s" : ""}`;

    const emptyTitle = query ? "No results" : "No trashed items";
    const emptyDescription = query
        ? `No trashed items match "${searchText.trim()}"${typeFilter !== "ALL" ? ` in ${activeTypeLabel} items` : ""}.`
        : typeFilter !== "ALL"
            ? `There are no trashed ${activeTypeLabel} items${selectedVaultFilter !== "ALL" ? " in this vault" : ""}.`
            : hasLockedVaultsInView
                ? `${lockedVaults.length} vault(s) are still locked. Unlock them to check for trashed items.`
                : "There are no deleted items matching your current filter.";

    if (error) {
        return (
            <div className="size-full flex flex-col items-center justify-center p-10 text-center gap-4">
                <Trash2Icon className="size-16 text-destructive" />
                <h1 className="text-2xl font-bold">Failed to load trash bin</h1>
                <p className="text-muted-foreground max-w-md">
                    {error instanceof Error ? error.message : "An unexpected error occurred while loading your vaults."}
                </p>
                <Button variant="secondary" onClick={() => router.push("/strongroom")}>
                    <ArrowLeftIcon className="size-4 mr-2" /> Back to Vaults
                </Button>
            </div>
        );
    }

    return (
        <div className="size-full flex flex-col overflow-hidden">
            <ResizablePanelGroup orientation="horizontal" className="size-full">
                {/* LEFT: ITEMS LIST PANEL */}
                <ResizablePanel defaultSize="45%" minSize="30%" className="size-full border-r border-muted flex flex-col">
                    {/* VAULT FILTER BAR */}
                    <div className="w-full p-3 border-b border-muted flex items-center justify-between gap-2 bg-background/50">
                        <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto no-scrollbar">
                            <Button
                                variant={selectedVaultFilter === "ALL" ? "default" : "secondary"}
                                size="sm"
                                aria-pressed={selectedVaultFilter === "ALL"}
                                className="h-7 text-xs font-medium cursor-pointer"
                                onClick={() => selectVaultFilter("ALL")}
                            >
                                All Vaults ({totalTrashedCount})
                            </Button>
                            {vaults.map((v) => {
                                const isUnlocked = store.isVaultUnlocked(v.id);
                                const count = v.vaultItems?.length ?? 0;
                                const isSelected = selectedVaultFilter === v.id;

                                return (
                                    <Button
                                        key={v.id}
                                        variant={isSelected ? "default" : "secondary"}
                                        size="sm"
                                        aria-pressed={isSelected}
                                        className="h-7 text-xs flex items-center gap-1.5 cursor-pointer"
                                        onClick={() => selectVaultFilter(v.id)}
                                    >
                                        <RenderIcon name={v.icon} size={14} color={v.iconColor ?? "white"} />
                                        <span>{v.name}</span>
                                        <span className="opacity-70 text-[10px]">({count})</span>
                                        {isUnlocked ? (
                                            <Unlock className="size-3 text-green-500 ml-0.5" />
                                        ) : (
                                            <Lock className="size-3 text-amber-500 ml-0.5" />
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                        {lockedVaults.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs shrink-0 cursor-pointer text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
                                onClick={() => openUnlockDialog("ALL")}
                            >
                                <KeyRound className="size-3 mr-1" />
                                Unlock ({lockedVaults.length})
                            </Button>
                        )}
                    </div>

                    {/* TRASHED ITEM SEARCH BAR + TYPE SELECT */}
                    <div className="w-full p-3 border-b border-muted flex items-center gap-2 bg-background/30">
                        <InputGroup className="flex-1 min-w-0 h-8.5">
                            <InputGroupInput
                                id="trashed-item-search"
                                aria-label="Search trashed items"
                                placeholder="Search trashed items..."
                                autoComplete="off"
                                spellCheck={false}
                                disabled={isToolbarDisabled}
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
                                        <X className="size-4" />
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
                            disabled={isToolbarDisabled}
                        >
                            <SelectTrigger aria-label="Filter by item type" className="w-40 shrink-0 h-8.5 data-[size=default]:h-8.5">
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

                    {/* ITEMS LIST CONTAINER */}
                    <div
                        className="size-full overflow-y-auto p-4 flex flex-col gap-2 no-scrollbar"
                        onDoubleClick={handleListDoubleClick}
                    >
                        {isLoading ? (
                            <CustomLoadingState loaderChoice={1} className="size-full flex items-center justify-center gap-2">
                                <span className="shimmer shimmer-duration-1000">Loading trashed items...</span>
                            </CustomLoadingState>
                        ) : !vaults.length ? (
                            <div className="flex flex-col items-center justify-center size-full gap-2 text-center p-8">
                                <Trash2Icon className="size-12 text-muted-foreground/50" />
                                <h2 className="text-lg font-medium text-muted-foreground">No vaults found</h2>
                                <p className="text-sm text-muted-foreground/70">Create a vault first to use the trash bin.</p>
                            </div>
                        ) : isCurrentFilterLocked && activeFilterVault ? (
                            /* SPECIFIC VAULT IS LOCKED */
                            <div className="flex flex-col items-center justify-center size-full gap-4 text-center p-8">
                                <SvgCircle>
                                    <Lock className="size-10 text-amber-500" />
                                </SvgCircle>
                                <div className="flex flex-col gap-1 max-w-sm">
                                    <h2 className="text-xl font-bold">{activeFilterVault.name} is Locked</h2>
                                    <p className="text-sm text-muted-foreground">
                                        This vault uses its own password. Enter the password for {activeFilterVault.name} to view its trashed items.
                                    </p>
                                </div>

                                <form
                                    key={activeFilterVault.id}
                                    onSubmit={(e) => handleInlineUnlockSubmit(e, activeFilterVault.id)}
                                    className="flex flex-col gap-3 w-full max-w-xs"
                                >
                                    <PasswordField
                                        value={inlinePassword}
                                        onChange={setInlinePassword}
                                        ariaLabel={`Password for ${activeFilterVault.name}`}
                                    />
                                    <Button type="submit" disabled={inlineSubmitting} className="w-full font-semibold cursor-pointer">
                                        {inlineSubmitting ? (
                                            <>
                                                <Loader2Icon className="size-4 mr-2 animate-spin" /> Unlocking...
                                            </>
                                        ) : (
                                            `Unlock ${activeFilterVault.name}`
                                        )}
                                    </Button>
                                </form>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            /* NO MATCHING ITEMS */
                            <div className="flex flex-col items-center justify-center size-full gap-3 text-center p-8">
                                <Trash2Icon className="size-12 text-muted-foreground/40" />
                                <h2 className="text-lg font-medium text-muted-foreground">{emptyTitle}</h2>
                                <p className="text-sm text-muted-foreground/70 max-w-xs">{emptyDescription}</p>
                                {hasLockedVaultsInView && isFiltering && (
                                    <p className="text-xs text-muted-foreground/70 max-w-xs">
                                        {lockedVaultsNote} can&apos;t be searched until unlocked.
                                    </p>
                                )}
                                <div className="flex items-center justify-center gap-2">
                                    {isNarrowed && decryptedItems.length > 0 && (
                                        <Button variant="outline" size="sm" onClick={resetFilters} className="cursor-pointer">
                                            Clear search and filters
                                        </Button>
                                    )}
                                    {hasLockedVaultsInView && (
                                        <Button variant="secondary" size="sm" onClick={() => openUnlockDialog("ALL")}>
                                            <KeyRound className="size-3.5 mr-1.5" /> Unlock Locked Vaults
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* LIST OF DECRYPTED TRASHED ITEMS (NEWEST DELETION FIRST) */
                            <>
                                {isFiltering && (
                                    <p className="text-xs font-medium text-muted-foreground px-1" aria-live="polite">
                                        {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
                                        {hasLockedVaultsInView && ` · ${lockedVaultsNote} not included`}
                                    </p>
                                )}
                                {filteredItems.map((item) => (
                                    <TrashRow
                                        key={item.id}
                                        item={item}
                                        isSelected={selectedItemId === item.id}
                                        onSelect={() => setSelectedItemId(item.id)}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* RIGHT: DETAIL OR TRASH BIN SUMMARY PANEL */}
                <ResizablePanel defaultSize="55%" minSize="30%" className="size-full overflow-y-auto p-6 bg-background/20 flex flex-col">
                    {selectedItem ? (
                        /* SELECTED ITEM PREVIEW */
                        <div className="size-full flex flex-col justify-between">
                            <div className="flex flex-col gap-5">
                                <div className="flex items-start justify-between border-b border-muted pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <ItemTypeIcon type={selectedItem.itemType} className="size-6 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="text-xl font-bold">{getItemTitle(selectedItem)}</h2>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Badge variant="outline" className="text-xs">
                                                    {getTypeLabel(selectedItem.itemType)}
                                                </Badge>
                                                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                                    <RenderIcon name={selectedItem.vaultIcon} size={12} color={selectedItem.vaultIconColor ?? "white"} />
                                                    {selectedItem.vaultName}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Close details"
                                        onClick={() => setSelectedItemId(null)}
                                        className="cursor-pointer"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>

                                {/* DETAIL FIELDS */}
                                <div className="flex flex-col gap-4 text-sm">
                                    <ItemDetailFields key={selectedItem.id} item={selectedItem} />

                                    <Separator />

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Original Vault: <strong className="text-foreground">{selectedItem.vaultName}</strong></span>
                                        <span>Deleted on: {formatDate(selectedItem.deletedAt ?? selectedItem.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM ACTIONS */}
                            <div className="flex items-center justify-end gap-2 pt-6 border-t border-muted mt-6">
                                <ItemActions item={selectedItem} />
                            </div>
                        </div>
                    ) : (
                        /* DEFAULT: TRASH BIN ICON & VAULT STATUS SUMMARY */
                        <div className="size-full flex flex-col items-center justify-center text-center p-6 gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <SvgCircle>
                                    <Trash2Icon size={70} className="text-primary relative z-10" />
                                </SvgCircle>
                                <h2 className="text-2xl font-bold mt-2">Trash Bin</h2>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Select any deleted item to view its details, restore it to its vault, or permanently remove it.
                                </p>
                            </div>

                            {/* VAULT STATUS CARDS */}
                            <div className="w-full max-w-md flex flex-col gap-2 border border-border/50 rounded-xl p-4 bg-muted/20 text-left">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                    Vault Status ({vaults.length})
                                </span>
                                {vaults.map((v) => {
                                    const isUnlocked = store.isVaultUnlocked(v.id);
                                    const count = v.vaultItems?.length ?? 0;

                                    return (
                                        <div
                                            key={v.id}
                                            className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/40 text-sm"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <RenderIcon name={v.icon} size={20} color={v.iconColor ?? "white"} />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-xs">{v.name}</span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {count} trashed item{count !== 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                {isUnlocked ? (
                                                    <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                                                        <Unlock className="size-3 mr-1" /> Unlocked
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="h-7 text-xs font-medium cursor-pointer"
                                                        onClick={() => openUnlockDialog(v.id)}
                                                    >
                                                        <KeyRound className="size-3 mr-1 text-amber-500" /> Unlock
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>

            {/* MULTI-VAULT UNLOCK MODAL */}
            <Dialog
                open={unlockModalOpen}
                onOpenChange={(open) => {
                    if (open) setUnlockModalOpen(true);
                    else closeUnlockDialog();
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <KeyRound className="size-5 text-primary" />
                            {targetVaultIdForModal === "ALL"
                                ? "Unlock Vaults"
                                : `Unlock ${vaults.find((v) => v.id === targetVaultIdForModal)?.name ?? "Vault"}`}
                        </DialogTitle>
                        <DialogDescription>
                            {targetVaultIdForModal === "ALL"
                                ? "Enter your vault password to decrypt and view trashed items across locked vaults."
                                : "Enter the master password for this specific vault."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleModalSubmit} className="flex flex-col gap-4 py-2">
                        {targetVaultIdForModal === "ALL" && (
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs text-muted-foreground">Currently Locked Vaults:</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {lockedVaults.map((v) => (
                                        <Badge key={v.id} variant="secondary" className="flex items-center gap-1 text-xs py-1 px-2.5">
                                            <RenderIcon name={v.icon} size={14} color={v.iconColor ?? "white"} />
                                            {v.name}
                                            <Lock className="size-3 text-amber-500 ml-0.5" />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="unlockModalPassword">Vault Password</Label>
                            <PasswordField id="unlockModalPassword" value={modalPassword} onChange={setModalPassword} />
                            <p className="text-[11px] text-muted-foreground">
                                If your vaults have different passwords, entering a password will unlock any vault that matches it.
                            </p>
                        </div>

                        <DialogFooter className="mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeUnlockDialog}
                                disabled={modalSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={modalSubmitting} className="font-semibold cursor-pointer">
                                {modalSubmitting ? (
                                    <>
                                        <Loader2Icon className="size-4 mr-2 animate-spin" /> Unlocking...
                                    </>
                                ) : (
                                    "Unlock"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}