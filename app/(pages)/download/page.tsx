import { Construction, Wrench } from "lucide-react";

export default function DownloadPage() {
    return (
        <div className="py-30 mx-auto flex flex-col gap-10">
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="font-geist font-bold text-primary text-4xl md:text-6xl">Download WardPass</h1>
                <p className="text-lg md:text-xl font-geist text-muted-foreground">This feature is coming soon!</p>
            </div>
            <div className="flex items-center justify-center gap-2">
                <Construction size={256} />
                <Wrench size={256} />
            </div>
        </div>
    )
}