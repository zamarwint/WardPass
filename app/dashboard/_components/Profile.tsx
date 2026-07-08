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
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
    const { data: session, error, isPending } = authClient.useSession.get();
    const [nameChange, setNameChange] = useState(session?.user?.name as string);
    const [imageChange, setImageChange] = useState(session?.user?.image as string);

    // const userUpdate = authClient.updateUser({
    //     name: nameChange,
    //     image: imageChange,
    //     fetchOptions: {
    //         onRequest: (ctx) => {
    //             toast.loading("Signing you in...");
    //         },
    //         onSuccess: (ctx) => {
    //             //redirect to the dashboard or sign in page
    //             toast.dismiss();
    //             toast.success("Success! Check your email to verify your account." + ctx.data);
    //         },
    //         onError: (ctx) => {
    //             // display the error message
    //             toast.dismiss();
    //             toast.error(ctx.error.message);
    //         },
    //     }
    // });

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
                        <div className="flex flex-col gap-4 items-start pt-6">
                            <DialogTitle>Change your profile picture.</DialogTitle>
                            <Image src={session?.user?.image as string} alt="Profile image" width={96} height={96} className="rounded-full" />
                            <Separator />
                            <DialogTitle>Change your name.</DialogTitle>
                            <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                            <Input type="text" id="name" onChange={(e) => setNameChange(e.target.value)} placeholder="e.g. John Doe" value={nameChange} />
                            <Separator />
                            <Button>Update</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}