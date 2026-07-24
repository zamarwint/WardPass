import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { BankCard1, BankCard2, BankCard3 } from "./BankCards";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { type CarouselApi } from "@/components/ui/carousel"
import React from "react";

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
        <div className={`size-full bg-black/70 backdrop-blur-xs absolute flex items-center justify-center z-999 ${cn(open ? "block" : "hidden")}`}>
            <button onClick={setOpen} className="absolute top-4 right-4 z-10">
                <X size={32} className="text-muted-foreground" />
            </button>
            <Carousel className="w-full max-w-md mx-auto px-2" setApi={setApi}>
                <CarouselContent>
                    <CarouselItem><BankCard1 /></CarouselItem>
                    <CarouselItem><BankCard2 /></CarouselItem>
                    <CarouselItem><BankCard3 /></CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                <div className="absolute mt-2 z-10 text-muted-foreground">
                    Slide {current} / {count}
                </div>
            </Carousel>
        </div>
    )
}