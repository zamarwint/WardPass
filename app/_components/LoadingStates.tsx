import { Skeleton } from "@/components/ui/skeleton";
import { Loader, Loader2 } from "lucide-react";

export function AnimatedThreeDots() {
    return (
        <div className="flex items-end justify-end space-x-1.5 text-muted-foreground">
            <div className="size-1 bg-foreground rounded-full animate-bounce duration-300 delay-0"></div>
            <div className="size-1 bg-foreground rounded-full animate-bounce duration-300 delay-100"></div>
            <div className="size-1 bg-foreground rounded-full animate-bounce duration-300 delay-200"></div>
        </div>
    )
}

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

export function AnimatedDotsLoadingState({ text, className }: { text: string, className?: string }) {
    return (
        <div className={className}>
            <span className="shimmer shimmer-duration-1000 text-muted-foreground">{text}</span>
            <AnimatedThreeDots />
        </div>
    )
}