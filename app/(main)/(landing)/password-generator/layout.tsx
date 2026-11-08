import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Password Generator | WardPass",
};

export default function PasswordGeneratorPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main className="grow">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-5 pb-20 pt-32 sm:px-8 md:pt-40">
                {children}
            </div>
        </main>
    )
}
