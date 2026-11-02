import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileAvatar({ image, alt, fallback, size }: { image: string, alt: string, fallback: string, size: string }) {
    return (
        <Avatar className={size}>
            <AvatarImage
                src={image}
                alt={alt}
                className="grayscale"
            />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    )
}