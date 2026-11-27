import { requireAdminSession } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export default async function AdminPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    try {
        await requireAdminSession();
    } catch {
        redirect("/strongroom");
    }

    return (
        <main className="size-full overflow-y-auto">
            {children}
        </main>
    );
}
