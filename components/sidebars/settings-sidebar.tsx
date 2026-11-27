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
import { BackButtonTopArea, SettingsSideButton } from "../app/sidebar/SideButtons";
import UserDropdown from "../app/sidebar/UserDropdown";

export function SettingsSidebarContent() {
    return (
        <>
            <SidebarHeader className="px-2.5 py-3">
                <SidebarMenu>
                    <BackButtonTopArea title="Settings" />
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="bg-border/40" />
            <SidebarContent className="px-2 py-2">
                <SidebarGroup className="p-1">
                    <SidebarGroupLabel className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Workspace
                    </SidebarGroupLabel>
                    <SettingsSideButton />
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

export function SettingsSidebar() {
    return (
        <Sidebar className="border-r border-border/50">
            <SettingsSidebarContent />
            <SidebarRail />
        </Sidebar>
    );
}
