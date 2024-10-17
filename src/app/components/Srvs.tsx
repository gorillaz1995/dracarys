"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Vivus from "vivus";
import Pict from "./Pict";
import { ChakraProvider } from "@chakra-ui/react";

const services = [
  {
    title: "Graphic Design",
    heading: "Transforming Ideas into Visual Masterpieces",
    description:
      "Capture your audience with striking visuals that communicate your message effectively.",
    imageSrc: "/images/c3.webp",
  },
  {
    title: "Branding",
    heading: "Crafting Identities That Resonate",
    description:
      "Build a memorable brand that stands out and connects with your target audience.",
    imageSrc: "/images/c1.webp",
  },
  {
    title: "Print",
    subtitle: "Indoor/Outdoor",
    heading: "Elevate Your Space with Stunning Prints",
    description:
      "Enhance environments with high-quality indoor and outdoor print solutions.",
    imageSrc: "/images/c2.webp",
  },
  {
    title: "Project X",
    heading: "Unveiling Innovative Solutions with Project X",
    description:
      "Discover cutting-edge approaches tailored to your unique challenges.",
    imageSrc: "/images/c4.webp",
  },
];

const Srvs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const swipeIconRef = useRef<SVGSVGElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showSwipeIcon, setShowSwipeIcon] = useState(true);

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
      setShowSwipeIcon(false);
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
      setShowSwipeIcon(false);
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
    if (swipeIconRef.current) {
      new Vivus(swipeIconRef.current as unknown as HTMLElement, {
        duration: 200,
        type: "oneByOne",
        start: "autostart",
      });

      // Animate the swipe icon
      gsap.to(swipeIconRef.current, {
        y: 20,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "power1.inOut",
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
    <ChakraProvider>
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
                padding: "2vh 2vw",
                transition: "opacity 0.5s ease-in-out",
                opacity: index === 0 ? 1 : 0,
                transform: index === 0 ? "translateX(0)" : "translateX(100%)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "1200px",
                  height: "100%",
                  maxHeight: "90vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pict
                  title={service.title}
                  subtitle={service.subtitle}
                  heading={service.heading}
                  description={service.description}
                  imageSrc={service.imageSrc}
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
        {showSwipeIcon && (
          <div
            style={{
              position: "fixed",
              bottom: "50px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#BDE54C",
            }}
          >
            <svg
              ref={swipeIconRef}
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M12 19L5 12M12 19L19 12"
                stroke="#BDE54C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ marginTop: "10px", fontSize: "14px" }}>
              Swipe Down
            </span>
          </div>
        )}
      </div>
    </ChakraProvider>
  );
};

export default Srvs;
