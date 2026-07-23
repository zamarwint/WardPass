import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function VaultTopBar() {
    return (
        <div className="w-full flex items-center justify-center z-1">
            <div className="w-xl flex items-center justify-center gap-2 py-2 rounded-full">
                <Search size={24} className="text-muted-foreground" />
                <Input disabled className="border border-muted focus:ring-0 h-9" placeholder="Search WardPass..." />
                <Button size="lg" disabled>Search (Coming soon)</Button>
            </div>
        </div>
    )
}