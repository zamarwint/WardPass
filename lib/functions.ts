import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

// SCROLL TO ANCHOR LINK
export const ScrollToAnchor = () => {
    const pathname = usePathname();
    const lastHash = useRef("");

    useEffect(() => {
        const hash = pathname.split('#')[1];
        if (hash) {
            const element = document.getElementById(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [pathname]);

    return null;
};

// TRACK THE VIEWPORT WIDTH
export const useViewportWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup listener on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
};

// CHECK LOCATION TO USE FOR ANCHORS
// export const checkLocation = () => {
//     const location = usePathname();
//     const locations = [
//         {
//             url: "/",
//             anchor: "#home",
//         },
//         {
//             url: "/gallery",
//             anchor: "#gallery",
//         },
//         {
//             url: "/chat",
//             anchor: "#chat",
//         },
//     ];

//     for (const l of locations) {
//         if (location === l.url) {
//             return l.anchor;
//         }
//     }

//     return "#home";
// };