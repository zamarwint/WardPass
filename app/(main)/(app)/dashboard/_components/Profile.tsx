import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CircleUserRound, Loader2Icon, SquarePen } from "lucide-react";

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
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/app/actions/getSession";

export default function Profile() {
    const { isPending, data, error } = useQuery({
        queryKey: ["getSession1"],
        queryFn: async () => await getUserSession()
    })

    error ? toast.error(error.message) : null;

    const [newName, setNewName] = useState<string>(data?.user?.name || "");
    const [newImage, setNewImage] = useState(data?.user.image);
    const [nameChangePending, startNameChangeTransition] = useTransition();
    const [imageChangePending, startImageChangeTransition] = useTransition();

    const updateUserName = async () => {
        startNameChangeTransition(async () => {
            await authClient.updateUser({
                name: newName,
                fetchOptions: {
                    onRequest: (ctx) => {
                        toast.loading("Updating...");
                    },
                    onSuccess: (ctx) => {
                        // Success message
                        toast.dismiss();
                        toast.success("Success!" + ctx.data);
                    },
                    onError: (ctx) => {
                        // display the error message
                        toast.dismiss();
                        toast.error(ctx.error.message);
                    },
                }
            });
        })
    }

    const updateUserImage = async () => {
        startImageChangeTransition(async () => {
            await authClient.updateUser({
                image: newImage,
                fetchOptions: {
                    onRequest: (ctx) => {
                        toast.loading("Updating...");
                    },
                    onSuccess: (ctx) => {
                        // Success message
                        toast.dismiss();
                        toast.success("Success!" + ctx.data);
                    },
                    onError: (ctx) => {
                        // display the error message
                        toast.dismiss();
                        toast.error(ctx.error.message);
                    },
                }
            });
        })
    }

    return (
        <motion.div className="w-full">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="w-full flex justify-start h-full py-2">
                        {isPending ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <motion.div className="flex items-center justify-between gap-2 w-full">
                                <div className="flex items-center justify-center gap-2">
                                    {data?.user.image ? <Image src={data?.user.image} alt="Profile image" width={24} height={24} /> : <CircleUserRound size={64} />}
                                    <div className="flex flex-col items-start justify-start">
                                        <div className="font-semibold">{data ? data.user.name : "Name"}</div>
                                        <div className="font-normal text-muted-foreground">{data ? data.user.email : "Email"}</div>
                                    </div>
                                </div>
                                <div>
                                    <SquarePen />
                                </div>
                            </motion.div>
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
                            {data?.user?.image ? <Image src={data?.user.image} alt="Profile image" width={96} height={96} className="rounded-full text-center" /> : <CircleUserRound size={96} />}
                            <Separator />
                            <DialogTitle>Change your name.</DialogTitle>
                            <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                            <Input type="text" id="name" placeholder="e.g. John Doe" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            <Separator />
                            <Button disabled={!newName || !newImage || nameChangePending || imageChangePending} onClick={() => {
                                // CHECKS
                                if (newName === data?.user.name) {
                                    toast.error("Error: New name is the same as current name.");
                                    return;
                                }

                                if (newName && newImage) {
                                    updateUserName;
                                    updateUserImage;
                                    return;
                                }

                                if (newName) updateUserName;
                                if (newImage) updateUserImage;
                            }}>{nameChangePending || imageChangePending ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Update</span>
                                </>
                            )}</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}