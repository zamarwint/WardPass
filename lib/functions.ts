"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";

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

export function useKeyboardShortcuts() {
  // As stated in the plan.

  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  const promotionalMessage =
    "Donate to WardPass today! Help us keep WardPass running!";

  useEffect(() => {
    if (typeof window === undefined) return;

    const handleKeyEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Go back to landing page
        router.push("/");
      }
    };

    const handleKeyAltV = (e: KeyboardEvent) => {
      if (e.key === "v" && e.altKey) {
        // Go to the vaults page
        router.push("/strongroom");
      }
    };

    const handleKeyAltT = (e: KeyboardEvent) => {
      if (e.key === "t" && e.altKey) {
        // Change theme
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }
    };

    const handleKeyAltP = (e: KeyboardEvent) => {
      if (e.key === "p" && e.altKey) {
        // Open card playground
        toast.info(promotionalMessage);
      }
    };

    const handleKeyAltU = (e: KeyboardEvent) => {
      if (e.key === "u" && e.altKey) {
        // Open user settings
        router.push("/strongroom/settings");
      }
    };

    window.addEventListener("keydown", handleKeyEscape);
    window.addEventListener("keydown", handleKeyAltV);
    window.addEventListener("keydown", handleKeyAltT);
    window.addEventListener("keydown", handleKeyAltP);
    window.addEventListener("keydown", handleKeyAltU);

    return () => {
      window.removeEventListener("keydown", handleKeyEscape);
      window.removeEventListener("keydown", handleKeyAltV);
      window.removeEventListener("keydown", handleKeyAltT);
      window.removeEventListener("keydown", handleKeyAltP);
      window.removeEventListener("keydown", handleKeyAltU);
    };
  });
}
