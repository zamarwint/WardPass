import { toast } from "sonner";
import { getUserSession } from "@/app/actions/getSession";
import { redirect } from "next/navigation";
import { prisma } from '../../../../../../utils/db';
import { DynamicIcon, IconName } from "lucide-react/dynamic";

export default async function VaultIDPage({
    params
}: {
    params: Promise<{ vaultId: string; }>
}) {
    const { vaultId } = await params;
    const session = await getUserSession();
    const vault = await prisma.vault.findUnique({
        where: {
            id: vaultId
        },
        select: {
            id: true,
            name: true,
            icon: true,
            iconColor: true
        }
    }).catch((err) => {
        console.log(err)
        return null
    })

    if (!session) {
        toast.error("There was an error loading your profile. Please try refreshing the page.");
        return redirect("/login");
    }

    if (!vault) {
        toast.error("There was an error loading your vault. Please try refreshing the page.");
        return redirect("/user/vault");
    }

    return (
        <div className="flex flex-col bg-transparent backdrop-blur-xl fixed px-10 pt-10">
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl md:text-6xl font-bold font-geist">
                    <div className="flex items-center gap-2">
                        <DynamicIcon name={vault.icon as IconName} size={48} color={vault.iconColor || 'white'} />
                        <span>{vault.name}</span>
                    </div>
                </h1>
                <p className="text-xl text-muted-foreground">Manage and view all your vault entries here.</p>
            </div>
        </div>
    )
}