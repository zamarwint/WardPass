import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function VaultTopBar() {
    return (
        <div className="w-full flex items-center justify-center border-b border-muted z-1">
            <div className="w-xl flex items-center justify-center gap-2 py-2 rounded-full">
                <Search size={20} className="text-muted-foreground" />
                <Input className="border border-muted focus:ring-0 h-10" placeholder={`Search Vault...`} />
            </div>
        </div>
    )
}