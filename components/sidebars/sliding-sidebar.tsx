"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
    Sidebar,
    SidebarInset,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar";
import { AppSidebarContent } from "./app-sidebar";
import { SettingsSidebarContent } from "./settings-sidebar";
import { AdminSidebarContent } from "./admin-sidebar";

type SidebarKey = "app" | "settings" | "admin";

const SIDEBAR_DEPTH: Record<SidebarKey, number> = {
    app: 0,
    settings: 1,
    admin: 1,
};

function getSidebarKey(pathname: string): SidebarKey | null {
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/settings")) return "settings";
    if (pathname.startsWith("/strongroom")) return "app";
    return null;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? "-100%" : "100%",
        opacity: 0,
    }),
};

const slideTransition = {
    x: { type: "spring" as const, stiffness: 360, damping: 34, mass: 0.85 },
    opacity: { duration: 0.16, ease: "easeOut" as const },
};

export function SlidingSidebar({ activeSidebar }: { activeSidebar: SidebarKey }) {
    const prevSidebarRef = useRef<SidebarKey>(activeSidebar);
    const directionRef = useRef<number>(1);

    if (prevSidebarRef.current !== activeSidebar) {
        const prevDepth = SIDEBAR_DEPTH[prevSidebarRef.current];
        const nextDepth = SIDEBAR_DEPTH[activeSidebar];
        directionRef.current = nextDepth >= prevDepth ? 1 : -1;
    }

    useEffect(() => {
        prevSidebarRef.current = activeSidebar;
    }, [activeSidebar]);

    const direction = directionRef.current;

    return (
        <Sidebar className="border-r border-border/50">
            <div className="relative flex size-full flex-col overflow-hidden">
                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    <motion.div
                        key={activeSidebar}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={slideTransition}
                        className="flex size-full flex-col"
                    >
                        {activeSidebar === "app" && <AppSidebarContent />}
                        {activeSidebar === "settings" && <SettingsSidebarContent />}
                        {activeSidebar === "admin" && <AdminSidebarContent />}
                    </motion.div>
                </AnimatePresence>
            </div>
            <SidebarRail />
        </Sidebar>
    );
}

export function WorkspaceSidebarShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const activeSidebar = getSidebarKey(pathname);

    if (!activeSidebar) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <SlidingSidebar activeSidebar={activeSidebar} />
            <SidebarInset className="h-screen min-w-0 overflow-hidden">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
