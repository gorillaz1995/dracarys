"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Vivus from "vivus";
import Pict from "./Pict";

const services = [
  {
    title: "Branding",
    description:
      "Redefine your future with our powerful branding solutions. We create memorable brand identities that break out of the box, delivering excellent results fast. Our experienced team uses cutting-edge technologies to help you stand out in any industry.",
  },
  {
    title: "Print",
    subtitle: "Indoor/Outdoor",
    description:
      "Experience creation without boundaries with our high-quality print solutions for both indoor and outdoor needs. Our state-of-the-art machines and expert team ensure rapid delivery of impactful materials that communicate your message clearly and effectively.",
  },
  {
    title: "Graphic Design",
    description:
      "Our talented designers push the boundaries of creativity to produce visually stunning materials. From brochures to social media designs, we help you present your brand professionally and attractively, always with an eye on redefining the future.",
  },
  {
    title: "X Print",
    description:
      "X Print is our innovative custom printing service that embodies the spirit of breaking out of the box. Using cutting-edge technologies and our highly trained team, we transform your ideas into unique, high-quality products, from personalized textiles to special promotional items.",
  },
];

const Srvs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newPosition = scrollPosition + e.deltaY;
      setScrollPosition(
        Math.max(
          0,
          Math.min(newPosition, content.offsetWidth - container.offsetWidth)
        )
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const deltaY = e.touches[0].clientY - startY;
      const newPosition = scrollPosition - deltaY * 2;
      setScrollPosition(
        Math.max(
          0,
          Math.min(newPosition, content.offsetWidth - container.offsetWidth)
        )
      );
      setStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollPosition, isDragging, startY]);

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.to(contentRef.current, {
      x: -scrollPosition,
      duration: 0.8,
      ease: "power2.out",
    });

    // Animate sections 2, 3, and 4
    sectionRefs.current.forEach((sectionRef, index) => {
      if (index > 0 && sectionRef) {
        const sectionPosition = index * window.innerWidth;
        const isVisible =
          scrollPosition >= sectionPosition - window.innerWidth / 2;

        gsap.to(sectionRef, {
          x: isVisible ? 0 : window.innerWidth,
          opacity: isVisible ? 1 : 0,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    });
  }, [scrollPosition]);

  useEffect(() => {
    if (arrowRef.current) {
      new Vivus(arrowRef.current as unknown as HTMLElement, {
        duration: 200,
        type: "oneByOne",
        start: "autostart",
      });
    }
  }, []);

  const handleBackToStart = () => {
    gsap.to(contentRef.current, {
      x: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => setScrollPosition(0),
    });

    if (arrowRef.current) {
      new Vivus(arrowRef.current as unknown as HTMLElement, {
        duration: 500,
        type: "oneByOne",
        start: "autostart",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        overflowX: "hidden",
        overflowY: "hidden",
        width: "100%",
        height: "100vh",
        touchAction: "none",
        backgroundColor: "black",
        position: "relative",
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "flex",
          flexDirection: "row",
          width: isMobile ? `${services.length * 100}%` : "400%",
          height: "100%",
          transition: "transform 0.5s ease-out",
        }}
      >
        {services.map((service, index) => (
          <section
            key={index}
            ref={(el: HTMLElement | null) => {
              if (el) sectionRefs.current[index] = el;
            }}
            className="section"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              backgroundColor: "black",
              paddingTop: "5vh",
              paddingBottom: "5vh",
              transition: "opacity 0.5s ease-in-out",
              opacity: index === 0 ? 1 : 0,
              transform: index === 0 ? "translateX(0)" : "translateX(100%)",
            }}
          >
            <div
              style={{
                width: isMobile ? "90%" : "130%",
                maxWidth: isMobile ? "650px" : "none",
                height: isMobile ? "130vh" : "117vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pict
                title={service.title}
                subtitle={service.subtitle}
                description={service.description}
              />
            </div>
          </section>
        ))}
      </div>
      <button
        onClick={handleBackToStart}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "opacity 0.3s ease-in-out",
          opacity: scrollPosition > 0 ? 1 : 0,
        }}
      >
        <svg
          ref={arrowRef}
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="#BDE54C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Srvs;
