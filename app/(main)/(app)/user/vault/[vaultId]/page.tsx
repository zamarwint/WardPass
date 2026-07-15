import { toast } from "sonner";
import { redirect } from "next/navigation";
import { getVaultUnique } from "@/app/actions/vault/getVaultUnique";
import { getVaultItems } from "@/app/actions/vault/getVaultItems";
import VaultItemList from "../_components/VaultItemList";

export default async function VaultIDPage({
    params
}: {
    params: Promise<{ vaultId: string; }>
}) {
    const { vaultId } = await params;
    const currentVault = await getVaultUnique(vaultId).then((currVault) => {
        return currVault;
    }).catch((err) => {
        toast.error("There was an error loading your vault. Please try refreshing the page." + err);
        redirect("/user/vault");
    })

    const vaultItems = await getVaultItems(currentVault!.id).catch((err) => {
        toast.error("There was an error loading your vault items. Please try refreshing the page." + err);
    })

    return (
        <VaultItemList vaultName={currentVault!.name} vaultItems={vaultItems || []} />
    )
}