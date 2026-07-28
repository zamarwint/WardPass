import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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