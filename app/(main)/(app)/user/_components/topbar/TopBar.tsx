"use client";

import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import { BugPlay, CircleQuestionMark } from "lucide-react";
import Notifications from "./Notifications";
import PlaygroundCard from "../PlaygroundCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TopBar() {
    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    const handleBugPlayClick = () => {
        setOpen((prev) => !prev);
    }

    return (
        <>
            <div className="font-geist flex items-center justify-between w-full p-0.5 bg-card/40 backdrop:blur-sm border-b border-muted">
                <Link className="flex items-center justify-center text-primary px-5 gap-0.5" href="/">
                    <Image src="/../../../icon.png" alt="logo" width={0} height={0} className="w-8 h-8" loading="eager" />
                    <span className="text-xl tracking-tighter font-bold">WARDPASS</span>
                </Link>
                <Search />
                <Button size="icon" variant="ghost" onClick={handleBugPlayClick} className="mr-2">
                    <BugPlay size={32} className="text-muted-foreground" />
                </Button>
                <Notifications />
                <Button size="icon" variant="ghost" className="mr-4" onClick={() => router.push('/contact')}>
                    <CircleQuestionMark size={32} className="text-muted-foreground" />
                </Button>
            </div>
            <PlaygroundCard open={open} setOpen={() => setOpen(!open)} />
        </>
    );
}