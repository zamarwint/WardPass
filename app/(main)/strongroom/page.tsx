import type { Metadata } from "next";
import VaultSelectionClient from "@/components/app/vault/VaultSelectionClient";

export const metadata: Metadata = {
  title: "Select Vault | Strongroom | WardPass",
};

export default function VaultSelectionPage() {
  return <VaultSelectionClient />;
}
