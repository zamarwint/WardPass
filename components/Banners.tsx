import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { AlertCircle, OctagonAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import Link from "next/link"
import { SidebarMenuButton } from "./ui/sidebar"

export function EmailDeliveryNotWorkingBanner() {
    return (
        <Drawer swipeDirection="up">
            <DrawerTrigger render={
                <SidebarMenuButton size="lg" className="w-full flex justify-start">
                    <OctagonAlert size={32} className="text-primary" />
                    <span className="text-sm font-bold text-primary">URGENT NOTICE</span>
                </SidebarMenuButton>
            }>
            </DrawerTrigger>
            <DrawerContent>
                <div className="bg-primary">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-background" />
                            <div>
                                <h4 className="font-bold text-background">
                                    EMAIL VERIFICATION
                                </h4>
                                <p className="text-background/80">
                                    Our email delivery service is currently experiencing some issues. You can still use the service without email verification for now if you are signed in with Google.
                                </p>
                                <p className="text-background/80">However, you cannot currently create, delete, or edit any information on your account, nor can you sign up with email or reset your password.</p>
                                <p className="text-background/80">If you so wish to modify your account, please contact <Link href='/contact' className="underline underline-offset-2 hover:text-white dark:hover:text-background">support via email.</Link></p>
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
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export function EmailDeliveryNotWorkingAlert() {
    return (
        <Alert className="flex items-center justify-center gap-4 border-none bg-primary rounded-none z-999">
            <AlertTitle className="font-bold text-background">EMAIL VERIFICATION</AlertTitle>
            <AlertDescription className="text-background/80">
                <span>Our email delivery service is currently experiencing some issues. You can still use the service without email verification for now if you are signed in with Google.</span>
            </AlertDescription>
        </Alert>
    )
}