"use client";

import { CreditCard, Globe, IdCard, NotebookPen, Trash2Icon } from "lucide-react";
import { SvgCircle } from "../../vault/_components/SVG";
import { getTrashedItemsInAllVaults } from "@/app/actions/getTrashedItems";
import { GetAuthSession } from "@/lib/queries/GetSessionQuery";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { VaultItem } from "@/lib/types/VaultType";
import { Separator } from "@/components/ui/separator";
import DeleteLoginItemDialog from "./delete/DeleteLoginItemDialog";
import DeleteSecureNoteItemDialog from "./delete/DeleteSecureNoteItemDialog";
import DeleteCreditCardItemDialog from "./delete/DeleteCreditCardItemDialog";
import DeleteIdentityItemDialog from "./delete/DeleteIdentityItemDialog";
import RestoreLoginItemDialog from "./restore/RestoreLoginItemDialog";
import RestoreSecureNoteItemDialog from "./restore/RestoreSecureNoteItemDialog";
import RestoreCreditCardItemDialog from "./restore/RestoreCreditCardItemDialog";
import RestoreIdentityItemDialog from "./restore/RestoreIdentityItemDialog";

export default function TrashItems() {
    const { data: session, isPending: sessionPending } = GetAuthSession();

    const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

    const { data: trashedItems, isPending: trashedItemsLoading } = useQuery({
        queryKey: ["trashedItems"],
        queryFn: () => getTrashedItemsInAllVaults(session?.user?.id as string),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
        enabled: !!session?.user?.id && !sessionPending
    })

    // UNSELECT ITEMS
    const unSelectItems = () => {
        setSelectedItem(null);
    }

    return (
        <div className="size-full">
            <div className="size-full flex items-center justify-center overflow-hidden">
                <div className="w-1/3 h-full border-r border-muted flex flex-col items-center justify-start overflow-hidden">
                    <Separator className="bg-muted" />
                    <div className="w-[90%] mt-4 flex-1 overflow-y-auto pb-8" onDoubleClick={unSelectItems}>
                        {trashedItemsLoading ? <div>Loading...</div> : (trashedItems?.loginItems?.length === 0 &&
                            trashedItems?.secureNoteItems?.length === 0 &&
                            trashedItems?.creditCardItems?.length === 0 &&
                            trashedItems?.identities?.length === 0) ?
                            <div className="flex flex-col items-center justify-center size-full gap-1">
                                <h1 className="text-lg font-medium font-geist text-muted-foreground mt-2">No trashed items.</h1>
                            </div>
                            : <div className="size-full text-left mt-4">
                                {trashedItems?.loginItems?.map((item) => (
                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                        <div className="flex gap-3 p-2">
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
                                {trashedItems?.secureNoteItems?.map((item) => (
                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
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
                                        {selectedItem?.id === item.id && <RestoreSecureNoteItemDialog secureNoteItem={item} />}
                                        {selectedItem?.id === item.id && <DeleteSecureNoteItemDialog secureNoteItem={item} />}
                                    </div>
                                ))}
                                {trashedItems?.creditCardItems?.map((item) => (
                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                        <div className="flex flex-col gap-2 p-2 w-full">
                                            <CreditCard className="size=[80%] text-primary" />
                                            <div className="size-full flex flex-col items-start justify-center gap-1">
                                                <h1 className="font-bold">{item.cardHolderName}</h1>
                                                <p className="text-md text-muted-foreground font-medium line-clamp-1">{item.billingAddress1}</p>
                                            </div>
                                        </div>
                                        {selectedItem?.id === item.id && <RestoreCreditCardItemDialog creditCardItem={item} />}
                                        {selectedItem?.id === item.id && <DeleteCreditCardItemDialog creditCardItem={item} />}
                                    </div>
                                ))}
                                {trashedItems?.identities?.map((item) => (
                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                        <div className="flex gap-3 p-2">
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
                        }
                    </div>
                </div>
                <div className="flex-1 h-full flex items-center justify-center overflow-y-auto border-t border-muted">
                    <div className="flex flex-col items-center gap-1">
                        <SvgCircle>
                            <Trash2Icon size={80} className="text-primary relative z-10" />
                        </SvgCircle>
                        <h1 className="text-2xl font-semibold text-foreground mt-2">Trash Bin</h1>
                        <p className="text-muted-foreground text-center">You can restore deleted items within 90 days.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}