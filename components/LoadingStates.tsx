import { Skeleton } from "@/components/ui/skeleton";
import { Loader, Loader2 } from "lucide-react";

export function NormalLoadingState({ loaderChoice, className }: { loaderChoice: 1 | 2, className?: string }) {
    return (
        <div className={className}>
            {loaderChoice === 1 && <Loader size={16} className="animate-spin" />}
            {loaderChoice === 2 && <Loader2 size={16} className="animate-spin" />}
            <span className="shimmer shimmer-duration-1000 text-muted-foreground">Loading...</span>
        </div>
    )
}

export function CustomLoadingState({ className, children, loaderChoice }: { className?: string, children: React.ReactNode, loaderChoice: 1 | 2 }) {
    return (
        <div className={className}>
            {loaderChoice === 1 && <Loader size={16} className="animate-spin" />}
            {loaderChoice === 2 && <Loader2 size={16} className="animate-spin" />}
            {children}
        </div>
    )
}

export function SkeletonLoadingState({ numberOfSkeletons, skeletonClassName, wrapperClassName }: { numberOfSkeletons: number, skeletonClassName?: string, wrapperClassName?: string }) {
    return (
        <div className={wrapperClassName}>
            {[...Array(numberOfSkeletons)].map((_, i) => (
                <Skeleton key={i} className={skeletonClassName} />
            ))}
        </div>
    )
}

// ANIMATED THREE DOTS
export function AnimatedThreeDots() {
    return (
        <span className="flex gap-1">
            <i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
            <i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
            <i className="size-1.5 animate-bounce rounded-full bg-primary" />
        </span>
    )
}

export function AnimatedDotsLoadingState({ text, className }: { text: string, className?: string }) {
    return (
        <div className={className}>
            <span className="shimmer shimmer-duration-1000 text-muted-foreground">{text}</span>
            <AnimatedThreeDots />
        </div>
    )
}