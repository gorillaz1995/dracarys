"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Observer);

const ServicesPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const sections = gsap.utils.toArray(".section");
    const container = containerRef.current;
    const content = contentRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + container.offsetWidth,
      },
    });

    tl.to(content, {
      x: () => -(content.offsetWidth - container.offsetWidth),
      ease: "none",
    });

    let startY = 0;
    let isDragging = false;

    Observer.create({
      target: container,
      type: "touch,pointer",
      onPress: (self) => {
        isDragging = true;
        startY = self.y || 0;
        gsap.killTweensOf(content);
      },
      onDrag: (self) => {
        if (!isDragging) return;
        const deltaY = (self.y || 0) - startY;
        const currentX = gsap.getProperty(content, "x") as number;
        const swipeSensitivity = 2.8; // Adjusted sensitivity: 20% slower than previous 3.5
        const newX = gsap.utils.clamp(
          -(content.offsetWidth - container.offsetWidth),
          0,
          currentX + deltaY * swipeSensitivity // Apply adjusted sensitivity to the swipe
        );
        gsap.set(content, { x: newX });
        startY = self.y || 0;
      },
      onRelease: () => {
        isDragging = false;
        const progress =
          Math.abs(gsap.getProperty(content, "x") as number) /
          (content.offsetWidth - container.offsetWidth);
        const snapTo =
          Math.round(progress * (sections.length - 1)) / (sections.length - 1);
        gsap.to(content, {
          x: -snapTo * (content.offsetWidth - container.offsetWidth),
          ease: "power2.out", // Easing for smoother snapping
          duration: 1.05, // Slightly faster snap
        });
      },
      lockAxis: true,
      onLockAxis: () => "y",
    });

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      Observer.getAll().forEach((obs) => obs.disable());
    });

    mm.add("(max-width: 767px)", () => {
      Observer.getAll().forEach((obs) => obs.enable());
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      Observer.getAll().forEach((obs) => obs.kill());
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        overflowX: "hidden",
        overflowY: "hidden",
        width: "100%",
        height: "100vh",
        touchAction: "none",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "row",
          width: "400%",
          height: "100%",
        }}
      >
        {[1, 2, 3, 4].map((section) => (
          <section
            key={section}
            className="section"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              backgroundColor: `hsl(${section * 60}, 70%, 60%)`,
            }}
          >
            Section {section}
          </section>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
