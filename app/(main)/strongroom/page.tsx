import type { Metadata } from "next";
import VaultSelectionClient from "@/components/app/VaultSelectionClient";

export const metadata: Metadata = {
  title: "Vault Selection | Strongroom | WardPass",
  robots: {
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function VaultSelectionPage() {
  return <VaultSelectionClient />;
}
