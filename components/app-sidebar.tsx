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

import { CircleQuestionMark, Upload } from "lucide-react"
import { Separator } from "./ui/separator"
import { AdminButton, LinkSideButton, LockSideButton, SideLogo, VaultSideButton } from "./app/sidebar/SideButton"
import UserDropdown from "./app/sidebar/UserDropdown"
import { ActivatePlayground } from "./app/PlaygroundCard"

export function AppSidebar() {
    return (
        <Sidebar className="font-geist">
            <SidebarHeader>
                <SidebarMenu>
                    <SideLogo />
                    <Separator />
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <VaultSideButton />
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarGroup>
                        <SidebarGroupLabel>Utilities</SidebarGroupLabel>
                        <ActivatePlayground />
                        <LinkSideButton hrefExact={true} href="/contact" text="Get Help" Icon={<CircleQuestionMark />} />
                    </SidebarGroup>
                    <Separator className="my-1" />
                    <SidebarGroup>
                        <SidebarGroupLabel>Other</SidebarGroupLabel>
                        <LinkSideButton hrefExact={true} href="/strongroom/import" text="Import Passwords" Icon={<Upload />} />
                        <AdminButton />
                        <LockSideButton />
                    </SidebarGroup>
                    <Separator className="my-1" />
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