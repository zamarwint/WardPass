"use client";

import { toast } from "sonner";
import { redirect, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVaultItems } from "@/app/actions/vault/getVaultItems";
import { useState } from "react";
import { VaultItem } from "@/lib/types/VaultType";

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

import type { LoginItem as LoginItemType, SecureNoteItem as SecureNoteItemType, CreditCardItem as CreditCardItemType, IdentityItem as IdentityItemType } from "@/lib/types/VaultItemType";
import LoginDropdown from "./_components/dropdowns/LoginDropdown";

// THE PURPOSE OF THIS PAGE IS TO DISPLAY ALL THE VAULT ITEMS IN A LIST ON THE LEFT SIDE, AND WHEN SELECTED, DISPLAY THE ITEM DETAILS ON THE RIGHT SIDE. 
// LIKE LOGIN ITEMS, SECURE NOTE ITEMS, CREDIT CARD ITEMS, AND IDENTITY ITEMS
export default function VaultIDPage() {
    const { vaultId } = useParams();
    const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

    // ALL CRUD COMPONENT STATE MANAGEMENT
    const [createLogin, setCreateLogin] = useState<boolean>(false);
    const [openLoginDropdown, setOpenLoginDropdown] = useState<boolean>(false);

    // const [createSecureNote, setCreateSecureNote] = useState<boolean>(false);
    // const [editSecureNote, setEditSecureNote] = useState<boolean>(false);
    // const [deleteSecureNote, setDeleteSecureNote] = useState<boolean>(false);

    // const [createCreditCard, setCreateCreditCard] = useState<boolean>(false);
    // const [editCreditCard, setEditCreditCard] = useState<boolean>(false);
    // const [deleteCreditCard, setDeleteCreditCard] = useState<boolean>(false);

    // const [createIdentity, setCreateIdentity] = useState<boolean>(false);
    // const [editIdentity, setEditIdentity] = useState<boolean>(false);
    // const [deleteIdentity, setDeleteIdentity] = useState<boolean>(false);

    // GET CURRENT VAULT ITEMS
    const { data: vaultItems, isLoading: vaultItemsLoading, error: vaultItemsError } = useQuery({
        queryKey: ["vaultItems", vaultId],
        queryFn: () => getVaultItems(vaultId as string),
        refetchOnWindowFocus: false
    })

    if (vaultItemsError) {
        toast.error("There was an error loading your vault. Please try refreshing the page." + vaultItemsError?.message);
        redirect("/user/vault");
    }

    return (
        <>
            {/* ALL CRUD COMPONENTS */}

            {/* LOGIN COMPONENTS */}
            {createLogin && <CreateLoginItem vaultId={vaultId as string} cancel={() => setCreateLogin(!createLogin)} />}

            {/* SECURE NOTE COMPONENTS */}
            {/* {createSecureNote && <CreateSecureNoteItem vaultId={vaultId as string} />} */}

            {/* CREDIT CARD COMPONENTS */}
            {/* {createCreditCard && <CreateCreditCardItem vaultId={vaultId as string} />}

            {/* IDENTITY COMPONENTS */}
            {/* {createIdentity && <CreateIdentityItem vaultId={vaultId as string} /> */}

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
                            <DropdownMenuItem className="cursor-pointer">Secure Note</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Credit Card</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Identity</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Separator className="bg-muted" />
                    <div className="w-[90%] mt-4 flex-1 overflow-y-auto pb-8">
                        {vaultItemsLoading ? <div>Loading...</div> : (vaultItems?.loginItems?.length === 0 &&
                            vaultItems?.secureNoteItems?.length === 0 &&
                            vaultItems?.creditCardItems?.length === 0 &&
                            vaultItems?.identities?.length === 0) ?
                            <div className="text-muted-foreground mt-4 text-center">No items found. Create a new item to continue.</div>
                            : <div className="size-full text-left mt-4">
                                {vaultItems?.loginItems?.map((item) => (
                                    <div key={item.id} className={`w-full min-h-fit max-h-24 text-md rounded-lg flex items-center mt-2 justify-between cursor-pointer py-4 pl-2 transition-all duration-100 ease-in ${selectedItem?.id === item.id ? `btn-teritary` : `btn-ghost`}`} onClick={() => setSelectedItem(item)}>
                                        <div className="flex gap-3 p-2">
                                            <div className="w-[75px] h-[50px] flex items-center justify-center bg-background rounded-xl">
                                                <Globe className="size-[80%] text-primary" />
                                            </div>
                                            <div className="size-full flex flex-col items-start justify-center">
                                                <h1 className="text-primary font-bold">{item.name}</h1>
                                                <p className="font-mono text-sm">{item.email}</p>
                                            </div>
                                        </div>
                                        {selectedItem?.id === item.id && <LoginDropdown open={openLoginDropdown} onOpenChange={() => setOpenLoginDropdown(!openLoginDropdown)} loginItem={item} />}
                                    </div>
                                ))}
                                {vaultItems?.secureNoteItems?.map((item) => (
                                    <Button key={item.id} size="lg" className="size-full text-md rounded-xl flex flex-col items-start justify-center" onClick={() => setSelectedItem(item)}>
                                        <h1>{item.title}</h1>
                                    </Button>
                                ))}
                                {vaultItems?.creditCardItems?.map((item) => (
                                    <Button key={item.id} variant="outline" size="lg" className="size-full text-md rounded-xl flex flex-col items-start justify-center" onClick={() => setSelectedItem(item)} >
                                        <h1>{item.cardHolderName}</h1>
                                    </Button>
                                ))}
                                {vaultItems?.identities?.map((item) => (
                                    <Button key={item.id} variant="outline" size="lg" className="size-full text-md rounded-xl flex flex-col items-start justify-center" onClick={() => setSelectedItem(item)} >
                                        <h1>{item.name}</h1>
                                    </Button>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex-1 h-full flex items-center justify-center overflow-y-auto">
                    {vaultItemsLoading ? <div>Loading...</div> : !selectedItem ? (
                        <div className="flex flex-col items-center gap-1">
                            <SvgCircle size={80} />
                            <h1 className="text-2xl font-semibold text-foreground mt-2">No item selected</h1>
                            <p className="text-muted-foreground text-center">Select an item to view details.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center size-full">
                            {selectedItem?.itemType === "LOGIN" && <LoginItem vaultItem={selectedItem as LoginItemType} />}
                            {selectedItem?.itemType === "SECURE_NOTE" && <SecureNoteItem vaultItem={selectedItem as SecureNoteItemType} />}
                            {selectedItem?.itemType === "CREDIT_CARD" && <CreditCardItem vaultItem={selectedItem as CreditCardItemType} />}
                            {selectedItem?.itemType === "IDENTITY" && <IdentityItem vaultItem={selectedItem as IdentityItemType} />}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}