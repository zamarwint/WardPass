"use client";

import Image from "next/image";
import Search from "./Search";
import { BugPlay, CircleQuestionMark, OctagonAlert } from "lucide-react";
import Notifications from "./Notifications";
import PlaygroundCard from "../PlaygroundCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EmailDeliveryNotWorkingBanner } from "@/app/_components/Banners";

export default function TopBar() {
    const router = useRouter();
    const [openPlayground, setOpenPlayground] = useState<boolean>(false);
    const [bannerOpen, setBannerOpen] = useState<boolean>(true);

    const handleBugPlayClick = () => {
        setOpenPlayground((prev) => !prev);
    }

    return (
        <>
            <div className="font-geist flex items-center justify-between w-full p-0.5 bg-card/40 backdrop:blur-sm border-b border-muted">
                <div className="flex items-center justify-center text-primary px-5 gap-0.5 cursor-pointer" onClick={() => router.push('/')}>
                    <Image src="/../../../icon.png" alt="logo" width={0} height={0} className="w-8 h-8" loading="eager" />
                    <span className="text-xl tracking-tighter font-bold">WARDPASS</span>
                </div>
                <Search />
                <Button size="lg" variant="ghost" onClick={() => setBannerOpen(!bannerOpen)} className="mr-2">
                    <OctagonAlert size={32} className="text-yellow-800 dark:text-yellow-300" />
                    <span className="text-sm font-bold text-yellow-800 dark:text-yellow-300">URGENT NOTICE</span>
                </Button>
                <Button size="icon" variant="ghost" onClick={handleBugPlayClick} className="mr-2">
                    <BugPlay size={32} className="text-muted-foreground" />
                </Button>
                <Notifications />
                <Button size="icon" variant="ghost" className="mr-4" onClick={() => router.push('/contact')}>
                    <CircleQuestionMark size={32} className="text-muted-foreground" />
                </Button>
            </div>
            <PlaygroundCard open={openPlayground} setOpen={() => setOpenPlayground(!openPlayground)} />
            <EmailDeliveryNotWorkingBanner open={bannerOpen} onOpenChange={() => setBannerOpen(!bannerOpen)} />
        </>
    );
}