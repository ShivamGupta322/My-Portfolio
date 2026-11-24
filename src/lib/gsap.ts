import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Register GSAP plugins exactly once (client only). Import gsap from here, not from "gsap".
 * (SplitText was dropped in Phase 9 when the preloader and hero intro moved to CSS.)
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
