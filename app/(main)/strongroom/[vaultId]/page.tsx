import { getVaultUnique } from "@/app/actions/vault/getVaultUnique";
import ActiveVault from "@/components/app/ActiveVault";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ vaultId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const vaultID = (await params).vaultId;
    const currentVault = await getVaultUnique(vaultID);
    const vaultName = currentVault.name;

    return {
        title: vaultName + " | Vaults | WardPass",
        robots: {
            googleBot: {
                index: false,
                follow: false
            }
        }
    }
};

export default function VaultIDPage() {
    return <ActiveVault />
}
