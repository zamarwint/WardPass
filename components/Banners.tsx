import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { AlertCircle, OctagonAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import Link from "next/link"

export function EmailDeliveryNotWorkingBanner() {
    return (
        <Drawer swipeDirection="up">
            <DrawerTrigger render={
                <Button variant="ghost" size="lg" className="w-full flex justify-start py-6 gap-2">
                    <OctagonAlert size={32} className="text-primary" />
                    <span className="text-sm font-bold text-primary">URGENT NOTICE</span>
                </Button>
            }>
            </DrawerTrigger>
            <DrawerContent className="bg-primary border-none">
                <div className="size-full flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-background" />
                        <div>
                            <h4 className="font-bold text-background">
                                EMAIL SERVICE ISSUES
                            </h4>
                            <p className="text-background/80">
                                Our email services are currently experiencing issues that disallow users from the authentication process.
                            </p>
                            <p className="text-background/80">You cannot currently create, delete, or edit any information on your account, nor can you create new accounts or sign in to your existing account. You are also unable to reset your password.</p>
                            <p className="text-background/80">If you so wish to modify your account or a create a new one, please contact <Link href='/contact' className="underline underline-offset-2 hover:text-white dark:hover:text-background">support via email.</Link></p>
                            <p className="text-background/80">We apologize for the inconvenience, we are working to get this matter sorted out as soon as possible.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DrawerClose render={
                            <Button className="size-8 hover:bg-transparent" size="icon" variant="ghost">
                                <X className="size-4 text-background" />
                            </Button>
                        }>
                        </DrawerClose>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export function EmailDeliveryNotWorkingAlert() {
    return (
        <Alert className="flex items-center justify-center gap-4 border-none bg-primary rounded-none z-999">
            <AlertTitle className="font-bold text-background">EMAIL SERVICE ISSUES</AlertTitle>
            <AlertDescription className="text-background/80">
                <span>Our email services are currently experiencing issues. You cannot use the application at this moment.</span>
            </AlertDescription>
        </Alert>
    )
}

export function OpenSourceProjectAlert() {
    return (
        <Alert className="flex items-center justify-center gap-4 border-none bg-background text-primary rounded-none z-999">
            <AlertTitle className="font-bold">OPEN SOURCE NOTICE</AlertTitle>
            <AlertDescription>
                <span>WardPass is free and <a href="https://github.com/zamarwint/WardPass" target="_blank">open source</a> under the MIT License. We do not collect information or sell anything on this website. If you would like to donate, feel free to do so using the <a href="#" target="_blank">link</a> provided.</span>
            </AlertDescription>
        </Alert>
    )
}