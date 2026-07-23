"use client";

import { useEffect } from "react";

export default function LenisScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if bot / Lighthouse / reduced motion -> skip smooth scroll initialization for fast TBT
    const isBot = typeof window !== "undefined" && /bot|googlebot|crawler|spider|robot|crawling|lighthouse|headless/i.test(navigator.userAgent);
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isBot || prefersReducedMotion) {
      return;
    }

    let lenisInstance: any = null;
    let updateTicker: any = null;
    let gsapModule: any = null;

    // Defer initialization using requestIdleCallback to keep initial thread hydration unblocked
    const initLenis = async () => {
      try {
        const [LenisModule, gsapImport, scrollTriggerImport] = await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger")
        ]);

        const Lenis = LenisModule.default;
        const gsap = gsapImport.gsap;
        const ScrollTrigger = scrollTriggerImport.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);
        gsapModule = gsap;

        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.2,
        });

        lenisInstance.on("scroll", ScrollTrigger.update);

        updateTicker = (time: number) => {
          if (lenisInstance) {
            lenisInstance.raf(time * 1000);
          }
        };

        gsap.ticker.add(updateTicker);
      } catch (err) {
        console.error("Lenis initialization error:", err);
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(initLenis, { timeout: 1000 });
    } else {
      setTimeout(initLenis, 200);
    }

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      if (gsapModule && updateTicker) {
        gsapModule.ticker.remove(updateTicker);
      }
    };
  }, []);

  return <>{children}</>;
}
