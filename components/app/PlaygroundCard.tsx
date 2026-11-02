"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { BankCard1, BankCard2, BankCard3 } from "./BankCards";
import { cn } from "@/lib/utils";
import { BugPlay, X } from "lucide-react";
import { type CarouselApi } from "@/components/ui/carousel"
import React from "react";
import { SidebarMenuButton } from "../ui/sidebar";

export function ActivatePlayground() {
    const [openPlayground, setOpenPlayground] = React.useState<boolean>(false);

    const handleBugPlayClick = () => {
        setOpenPlayground((prev) => !prev);
    }

    return (
        <>
            <SidebarMenuButton size="lg" className="w-full flex justify-start" onClick={handleBugPlayClick}>
                <BugPlay size={32} className="text-muted-foreground" />
                <span>Open Playground</span>
            </SidebarMenuButton>
            <PlaygroundCard open={openPlayground} setOpen={() => setOpenPlayground(!openPlayground)} />
        </>
    )
}

export default function PlaygroundCard({ open, setOpen }: { open: boolean, setOpen: () => void }) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className={cn("bg-black/70 backdrop-blur-xs z-999", open ? "absolute top-0 right-0 left-0 bottom-0" : "hidden")}>
            <button onClick={setOpen} className="absolute top-4 right-4 z-10">
                <X size={32} className="text-white" />
            </button>
            <Carousel className="w-full max-w-md mx-auto px-2" setApi={setApi}>
                <CarouselContent>
                    <CarouselItem><BankCard1 /></CarouselItem>
                    <CarouselItem><BankCard2 /></CarouselItem>
                    <CarouselItem><BankCard3 /></CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                <div className="absolute mt-2 z-10">
                    Slide {current} / {count}
                </div>
            </Carousel>
        </div>
    )
}