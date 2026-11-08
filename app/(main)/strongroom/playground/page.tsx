"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { BankCard1, BankCard2, BankCard3 } from "@/components/app/BankCards";
import { type CarouselApi } from "@/components/ui/carousel"
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlaygroundPage() {
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
        <div className="h-screen flex items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to the WardPass Play Area!</CardTitle>
                    <CardDescription>Play around with these Bank Cards! Put in your own data if you so desire!</CardDescription>
                </CardHeader>
                <CardContent className="size-full">
                    <Carousel className="size-full max-w-md" setApi={setApi}>
                        <CarouselContent>
                            <CarouselItem><BankCard1 /></CarouselItem>
                            <CarouselItem><BankCard2 /></CarouselItem>
                            <CarouselItem><BankCard3 /></CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </CardContent>
                <CardFooter>
                    <div>
                        Slide {current} / {count}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}