export default function TrashPage() {
    return (
        <div className="flex flex-col bg-transparent backdrop-blur-xl fixed px-10 pt-10">
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">
                    <span>Trash</span>
                </h1>
                <p className="text-xl text-muted-foreground">Here are the entries that you have deleted. They will be permanently deleted after 30 days.</p>
            </div>
        </div>
    )
}