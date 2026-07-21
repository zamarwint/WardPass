export const SvgCircle = ({ children }: { children: React.ReactNode }) => (
    <div className="relative flex items-center justify-center w-32 h-32">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute -z-10 size-full">
            <circle cx="50" cy="50" r="50" className="fill-muted" />
        </svg>
        {children}
    </div>
);