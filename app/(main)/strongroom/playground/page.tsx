"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { BankCard1, BankCard2, BankCard3 } from "@/components/app/BankCards";
import { type CarouselApi } from "@/components/ui/carousel"
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";

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
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-screen flex flex-col items-center justify-center gap-15">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">The WardPass <span className="text-primary">Playground!</span></h1>
                <p className="text-muted-foreground max-w-md">Welcome to the WardPass Play Area! Here you can play games offered by the WardPass team!</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Bank Cards</CardTitle>
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
                        Card {current} / {count}
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}