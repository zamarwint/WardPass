import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import { CircleQuestionMark } from "lucide-react";
import Notifications from "./Notifications";

export default function TopBar() {
    return (
        <div className="font-geist flex items-center justify-between w-full p-0.5 bg-card/40 backdrop:blur-sm border-b border-muted">
            <Link className="flex items-center justify-center text-primary px-5 gap-0.5" href="/">
                <Image src="/../../../icon.png" alt="logo" width={0} height={0} className="w-8 h-8" loading="eager" />
                <span className="text-xl tracking-tighter font-bold">WARDPASS</span>
            </Link>
            <Search />
            <Notifications />
            <Link href="/contact">
                <CircleQuestionMark size={32} className="text-muted-foreground pr-4" />
            </Link>
        </div>
    );
}