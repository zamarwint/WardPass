import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, User } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { authClient } from "@/utils/auth-client";
import Image from "next/image";

export default function Profile() {
    const { data: session, error, isPending } = authClient.useSession.get();

    console.log(session, error);

    return (
        <motion.div className="w-full">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="lg" className="w-full flex justify-start">
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                {session ? <Image src={session?.user?.image as string} alt="Profile image" width={24} height={24} /> : <User size="lg" />}
                                Profile
                            </>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Edit your profile.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}