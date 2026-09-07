import { AnimatedDotsLoadingState } from "../_components/LoadingStates";

export default function MainLoading() {
    return (
        <div className="flex flex-col size-full min-h-screen min-w-screen overflow-x-hidden">
            {/* <NormalLoadingState loaderChoice={2} className="flex flex-1 size-full items-center justify-center gap-2" /> */}
            <AnimatedDotsLoadingState text="Loading WardPass" className="flex flex-1 size-full items-center justify-center gap-2" />
        </div>
    )
}