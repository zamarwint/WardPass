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

import { Separator } from "../ui/separator"
import { AdminSideButton, BackButtonTopArea } from "../app/sidebar/SideButtons"
import UserDropdown from "../app/sidebar/UserDropdown"

export function AdminSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <BackButtonTopArea />
                </SidebarMenu>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Admin Controls</SidebarGroupLabel>
                    <AdminSideButton />
                </SidebarGroup>
            </SidebarContent>
            <Separator />
            <SidebarFooter>
                <SidebarMenu>
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