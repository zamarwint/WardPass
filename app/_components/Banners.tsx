import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer"
import Link from "next/link"

export function EmailDeliveryNotWorkingBanner({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Drawer direction="top" open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="bg-yellow-800 dark:bg-yellow-300">
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
                            <DrawerClose asChild>
                                <Button className="h-8 w-8 bg-transparent" size="icon" variant="ghost">
                                    <X className="h-4 w-4 text-background bg-transparent" />
                                </Button>
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
        <Alert className="flex items-center justify-center gap-4 border-none bg-yellow-800 dark:bg-yellow-300 z-999">
            <AlertTitle className="font-bold text-background">EMAIL VERIFICATION</AlertTitle>
            <AlertDescription className="text-background/80">
                <span>Our email delivery service is currently experiencing some issues. You can still use the service without email verification for now if you are signed in with Google.</span>
            </AlertDescription>
        </Alert>
    )
}