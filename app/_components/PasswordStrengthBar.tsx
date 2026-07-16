export default function PasswordStrengthBar({ strength }: { strength: string }) {
    return (
        <div className="pt-2 pb-4">
            {/* Password Strength Bar (Decorative) */}
            <div className="flex gap-1 h-1.5 w-full">
                {strength.toLowerCase() === 'too weak' ? (
                    <>
                        <div className="h-full bg-destructive flex-1 rounded-sm"></div>
                        <div className="h-full bg-destructive opacity-30 flex-1 rounded-sm"></div>
                        <div className="h-full bg-destructive opacity-30 flex-1 rounded-sm"></div>
                        <div className="h-full bg-destructive opacity-30 flex-1 rounded-sm"></div>
                        <div className="h-full bg-destructive opacity-30 flex-1 rounded-sm"></div>
                    </>
                ) : strength.toLowerCase() === 'weak' ? (
                    <>
                        <div className="h-full bg-orange-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-orange-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-orange-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-orange-600 opacity-30 flex-1 rounded-sm"></div>
                        <div className="h-full bg-orange-600 opacity-30 flex-1 rounded-sm"></div>
                    </>

                ) : strength.toLowerCase() === 'medium' ? (
                    <>
                        <div className="h-full bg-yellow-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-yellow-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-yellow-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-yellow-600 opacity-30 flex-1 rounded-sm"></div>
                        <div className="h-full bg-yellow-600 opacity-30 flex-1 rounded-sm"></div>
                    </>
                ) : strength.toLowerCase() === 'strong' ? (
                    <>
                        <div className="h-full bg-green-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-green-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-green-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-green-600 flex-1 rounded-sm"></div>
                        <div className="h-full bg-green-600 flex-1 rounded-sm"></div>
                    </>
                ) : (
                    <>
                        <div className="h-full bg-primary flex-1 rounded-sm"></div>
                        <div className="h-full bg-primary flex-1 rounded-sm"></div>
                        <div className="h-full bg-primary flex-1 rounded-sm"></div>
                        <div className="h-full bg-primary flex-1 rounded-sm"></div>
                        <div className="h-full bg-primary flex-1 rounded-sm"></div>
                    </>
                )}
            </div>
        </div>
    )
}