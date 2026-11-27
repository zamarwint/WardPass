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

import { BugPlay, FolderSync } from "lucide-react";
import { Separator } from "../ui/separator";
import {
    HomeSideButton,
    LinkSideButton,
    LockSideButton,
    MainTopArea,
    VaultSideButton,
} from "../app/sidebar/SideButtons";
import UserDropdown from "../app/sidebar/UserDropdown";

export function AppSidebarContent() {
    return (
        <>
            <SidebarHeader className="px-2.5 py-3">
                <SidebarMenu>
                    <MainTopArea />
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="bg-border/40" />
            <SidebarContent>
                <HomeSideButton />
                <VaultSideButton />
            </SidebarContent>
            <Separator className="bg-border/40" />
            <SidebarFooter className="px-2 py-2.5 gap-1">
                <SidebarMenu className="gap-1">
                    <SidebarGroup className="p-1">
                        <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                            Utilities
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1 mt-1">
                            <LinkSideButton
                                hrefExact={true}
                                href="/strongroom/transfer-credentials"
                                text="Transfer Credentials"
                                Icon={<FolderSync />}
                            />
                            <LinkSideButton
                                hrefExact={true}
                                href="/strongroom/playground"
                                text="Playground"
                                Icon={<BugPlay />}
                            />
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup className="p-1">
                        <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                            Protection
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1 mt-1">
                            <LockSideButton />
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup className="p-1 pt-1.5">
                        <UserDropdown onSidebar={true} />
                    </SidebarGroup>
                </SidebarMenu>
            </SidebarFooter>
        </>
    );
}

export function AppSidebar() {
    return (
        <Sidebar className="border-r border-border/50">
            <AppSidebarContent />
            <SidebarRail />
        </Sidebar>
    );
}
