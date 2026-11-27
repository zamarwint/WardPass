import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarRail,
} from "@/components/ui/sidebar";

import { Separator } from "../ui/separator";
import { AdminSideButton, BackButtonTopArea } from "../app/sidebar/SideButtons";
import UserDropdown from "../app/sidebar/UserDropdown";

export function AdminSidebarContent() {
    return (
        <>
            <SidebarHeader className="px-2.5 py-3">
                <SidebarMenu>
                    <BackButtonTopArea title="Admin Console" />
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="bg-border/40" />
            <SidebarContent className="px-2 py-2">
                <SidebarGroup className="p-1">
                    <SidebarGroupLabel className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Admin Controls
                    </SidebarGroupLabel>
                    <AdminSideButton />
                </SidebarGroup>
            </SidebarContent>
            <Separator className="bg-border/40" />
            <SidebarFooter className="px-2 py-2.5">
                <SidebarMenu>
                    <SidebarGroup className="p-1">
                        <UserDropdown onSidebar={true} />
                    </SidebarGroup>
                </SidebarMenu>
            </SidebarFooter>
        </>
    );
}

export function AdminSidebar() {
    return (
        <Sidebar className="border-r border-border/50">
            <AdminSidebarContent />
            <SidebarRail />
        </Sidebar>
    );
}
