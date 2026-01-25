"use client";

import { useEffect, useState } from "react";

export function useExitIntent() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      // Trigger when mouse leaves the top of the viewport
      if (
        event.clientY <= 0 &&
        !hasTriggered &&
        // Check if we haven't shown it recently (optional localStorage check could go here)
        !localStorage.getItem("exit-intent-shown")
      ) {
        setIsVisible(true);
        setHasTriggered(true);
        localStorage.setItem("exit-intent-shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasTriggered]);

  return { isVisible, setIsVisible };
}
