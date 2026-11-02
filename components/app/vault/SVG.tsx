export const SvgCircle = ({ children, size = 'w-32 h-32' }: { children: React.ReactNode, size?: string }) => (
    <div className={`relative flex items-center justify-center ${size}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute -z-10 size-full" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" className="fill-muted" /></svg>
        {children}
    </div>
);