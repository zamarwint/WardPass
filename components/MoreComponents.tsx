import { Separator } from "./ui/separator";

export function ORComponent() {
    return (
        <div className="flex flex-col justify-center items-center">
            <Separator className="w-full" />
            <div className="bg-background text-muted-foreground z-9 -translate-y-3.5 px-4">OR</div>
        </div>
    )
}

export const LineAnimationClass =
    "cursor-pointer relative inline-block no-underline after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";
