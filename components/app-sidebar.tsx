import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarRail,
} from "@/components/ui/sidebar"

import { BugPlay, FolderDown, Upload } from "lucide-react"
import { Separator } from "./ui/separator"
import { LinkSideButton, LockSideButton, SideLogo, VaultSideButton } from "./app/sidebar/SideButtons"
import UserDropdown from "./app/sidebar/UserDropdown"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SideLogo />
                </SidebarMenu>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <VaultSideButton />
            </SidebarContent>
            <Separator />
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarGroup>
                        <SidebarGroupLabel>Utilities</SidebarGroupLabel>
                        <LinkSideButton hrefExact={true} href="/strongroom/import" text="Import Credentials" Icon={<Upload />} />
                        <LinkSideButton hrefExact={true} href="/strongroom/export" text="Export Credentials" Icon={<FolderDown />} />
                        <LinkSideButton hrefExact={true} href="/strongroom/playground" text="Playground" Icon={<BugPlay />} />
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Protection</SidebarGroupLabel>
                        <LockSideButton />
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Account</SidebarGroupLabel>
                        <UserDropdown onSidebar={true} />
                    </SidebarGroup>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}