import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function VaultTopBar() {
    return (
        <div className="w-xl flex items-center justify-center gap-2 z-1">
            <InputGroup className="max-w-full h-8.5">
                <InputGroupInput placeholder="Search WardPass..." disabled />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end"></InputGroupAddon>
            </InputGroup>
            <Button size="lg" disabled>Search (Coming soon)</Button>
        </div>
    )
}