"use client";

import React, { useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  ChakraProvider,
  extendTheme,
  Flex,
} from "@chakra-ui/react";
import { RoughNotation, RoughNotationGroup } from "react-rough-notation";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import Vivus from "vivus";

const theme = extendTheme({
  colors: {
    brand: {
      100: "#BDE54A",
      200: "#FCABFC",
      300: "#312DFF",
    },
  },
  fonts: {
    heading: "Rufina, serif",
    body: "Oxygen, sans-serif",
  },
});

const AboutUs: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollIndicatorRef.current) {
        const scrollPercentage =
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
          100;
        scrollIndicatorRef.current.style.width = `${scrollPercentage}%`;

        // Add a pulsating effect
        const pulseIntensity = Math.sin(Date.now() / 200) * 0.2 + 0.8; // Varies between 0.6 and 1
        scrollIndicatorRef.current.style.opacity = pulseIntensity.toString();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (inView && titleRef.current) {
      const titleElement = titleRef.current;
      const chars = titleElement.textContent?.split("") || [];
      titleElement.innerHTML = "";
      chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        titleElement.appendChild(span);
      });

      const animation = gsap.to(titleElement.children, {
        opacity: 1,
        y: 0,
        rotation: 360,
        duration: 0.5,
        stagger: 0.09,
        ease: "back.out(1.7)",
        onComplete: () => {
          if (svgRef.current) {
            new Vivus(svgRef.current as unknown as HTMLElement, {
              duration: 100,
              type: "oneByOne",
            });
          }
        },
      });

      return () => {
        animation.kill();
      };
    }
  }, [inView]);

  const AnimatedSection: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [sectionRef, sectionInView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <Box ref={sectionRef}>
        <RoughNotationGroup show={sectionInView}>{children}</RoughNotationGroup>
      </Box>
    );
  };

  return (
    <ChakraProvider theme={theme}>
      <Box bg="black" color="white" position="relative">
        <Container
          maxW="container.xl"
          py={{ base: 6, md: 8 }}
          px={{ base: 6, md: 4, lg: 0 }}
        >
          <VStack
            spacing={{ base: 21, md: 32, lg: 48 }}
            align={{ base: "stretch", lg: "flex-start" }}
            ref={ref}
          >
            <Box position="relative">
              <Heading
                as="h1"
                ref={titleRef}
                textAlign={{ base: "left", lg: "left" }}
                color="brand.200"
                css={{
                  fontSize: "clamp(2rem, 35vh, 4.5rem)",
                  "@media (min-width: 768px)": {
                    fontSize: "clamp(6rem, 6vw, 8rem)",
                  },
                  "@media (min-width: 1920px)": {
                    fontSize: "clamp(8.4rem, 8.4vw, 11.2rem)",
                  },
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  fontFamily: "Rufina, serif",
                }}
              >
                A b o u t U s
              </Heading>
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                }}
              >
                <path
                  d="M10,50 Q50,10 90,50 T90,50"
                  fill="none"
                  stroke="#FCABFC"
                  strokeWidth="0.5"
                />
              </svg>
            </Box>

            <AnimatedSection>
              <Flex
                direction={{ base: "column", lg: "row" }}
                align={{ base: "center", lg: "flex-start" }}
                justify={{ base: "center", lg: "flex-start" }}
                mb={{ base: 24, md: 36 }}
              >
                <Box
                  flex="1"
                  textAlign={{ base: "left", lg: "left" }}
                  mb={{ base: 4, lg: 0 }}
                  mt={{ lg: "-2rem" }}
                  mr={{ lg: "7rem" }}
                >
                  <Heading
                    as="h2"
                    fontSize={{
                      base: "2.5rem",
                      sm: "3rem",
                      md: "3.5rem",
                      lg: "4rem",
                      "2xl": "6.7rem",
                    }}
                    mb={{ base: 8, md: 12 }}
                    color="brand.200"
                    lineHeight={1.2}
                    fontFamily="Rufina, serif"
                    maxWidth={{ base: "90%", lg: "100%" }}
                    mx={{ base: "auto", lg: "0rem" }}
                  >
                    <RoughNotation
                      type="box"
                      padding={[16, 36]}
                      strokeWidth={3}
                      color="#FCABFC"
                    >
                      Innovative Solutions, Tangible Results
                    </RoughNotation>
                  </Heading>
                </Box>
                <Box flex="1" mt={{ lg: "2rem" }}>
                  <Text
                    fontSize={{
                      base: "1rem",
                      sm: "1.125rem",
                      md: "1.25rem",
                      lg: "1.375rem",
                      "2xl": "1.925rem",
                    }}
                    lineHeight={1.6}
                    mb={6}
                    fontFamily="Oxygen, sans-serif"
                  >
                    Excellence drives the fusion of creativity and precision.
                    With over
                    <RoughNotation
                      type="underline"
                      padding={[0, 2]}
                      strokeWidth={2}
                      color="#BDE54A"
                    >
                      two decades of industry experience
                    </RoughNotation>
                    and cutting-edge tools, projects are seamlessly guided from
                    conception to completion, ensuring efficient and effective
                    service delivery.
                  </Text>
                </Box>
              </Flex>
            </AnimatedSection>

            <AnimatedSection>
              <Flex
                direction={{ base: "column", lg: "row-reverse" }}
                align={{ base: "center", lg: "flex-start" }}
                mb={{ base: 24, md: 36 }}
              >
                <Box
                  flex="1"
                  textAlign={{ base: "left", lg: "right" }}
                  mb={{ base: 4, lg: 0 }}
                >
                  <Heading
                    as="h2"
                    fontSize={{
                      base: "2.5rem",
                      sm: "3rem",
                      md: "3.5rem",
                      lg: "4rem",
                      "2xl": "5.6rem",
                    }}
                    mb={{ base: 8, md: 12 }}
                    color="#312DFF"
                    lineHeight={1.2}
                    fontFamily="Rufina, serif"
                    maxWidth={{ base: "90%", lg: "100%" }}
                    mx={{ base: "auto", lg: "0" }}
                  >
                    <RoughNotation
                      type="highlight"
                      padding={[8, 16]}
                      strokeWidth={2}
                      color="#FCABFC"
                    >
                      Crafting Visions into Reality
                    </RoughNotation>
                  </Heading>
                </Box>
                <Box flex="1">
                  <Text
                    fontSize={{
                      base: "1rem",
                      sm: "1.125rem",
                      md: "1.25rem",
                      lg: "1.375rem",
                      "2xl": "1.925rem",
                    }}
                    lineHeight={1.6}
                    mb={6}
                    fontFamily="Oxygen, sans-serif"
                  >
                    Client aspirations serve as the foundation for each project.
                    By merging innovation with craftsmanship, concepts are
                    transformed into fully realized solutions. Each undertaking
                    represents a
                    <RoughNotation
                      type="circle"
                      padding={[4, 8]}
                      strokeWidth={2}
                      color="#312DFF"
                    >
                      collaborative journey
                    </RoughNotation>
                    , where dedication and expertise converge to manage every
                    detail meticulously, culminating in an exceptional final
                    product.
                  </Text>
                </Box>
              </Flex>
            </AnimatedSection>

            <AnimatedSection>
              <Box mb={{ base: 24, md: 36 }}>
                <Heading
                  as="h2"
                  fontSize={{
                    base: "2.5rem",
                    sm: "3rem",
                    md: "3.5rem",
                    lg: "4rem",
                    "2xl": "5.6rem",
                  }}
                  mb={{ base: 8, md: 12 }}
                  color="brand.200"
                  lineHeight={1.2}
                  fontFamily="Rufina, serif"
                >
                  <RoughNotation
                    type="bracket"
                    brackets={["left", "right"]}
                    padding={[8, 8]}
                    strokeWidth={2}
                    color="#FCABFC"
                  >
                    Swift Execution, Unwavering Quality
                  </RoughNotation>
                </Heading>
                <Text
                  fontSize={{
                    base: "1rem",
                    sm: "1.125rem",
                    md: "1.25rem",
                    lg: "1.375rem",
                    "2xl": "1.925rem",
                  }}
                  lineHeight={1.6}
                  mb={6}
                  fontFamily="Oxygen, sans-serif"
                >
                  A commitment to rapid delivery distinguishes the approach.
                  Streamlined workflows facilitate prompt project completion
                  without compromising on consistent, high-caliber results.
                  <RoughNotation
                    type="underline"
                    padding={[0, 2]}
                    strokeWidth={2}
                    color="#BDE54A"
                  >
                    In-house capabilities provide complete control over each
                    stage
                  </RoughNotation>
                  , eliminating delays and meeting even the most stringent
                  deadlines. From large-scale campaigns to time-sensitive
                  requests, robust systems ensure timely delivery without
                  sacrificing excellence.
                </Text>
              </Box>
            </AnimatedSection>

            <AnimatedSection>
              <Box>
                <Heading
                  as="h2"
                  fontSize={{
                    base: "2.5rem",
                    sm: "3rem",
                    md: "3.5rem",
                    lg: "4rem",
                    "2xl": "5.6rem",
                  }}
                  mb={{ base: 8, md: 12 }}
                  color="#312DFF"
                  lineHeight={1.2}
                  fontFamily="Rufina, serif"
                >
                  <RoughNotation
                    type="highlight"
                    padding={[0, 4]}
                    strokeWidth={2}
                    color="#FCABFC"
                  >
                    Enduring Collaborations, Mutual Success
                  </RoughNotation>
                </Heading>
                <Text
                  fontSize={{
                    base: "1rem",
                    sm: "1.125rem",
                    md: "1.25rem",
                    lg: "1.375rem",
                    "2xl": "1.925rem",
                  }}
                  lineHeight={1.6}
                  fontFamily="Oxygen, sans-serif"
                >
                  The focus extends beyond project completion to fostering
                  lasting partnerships built on trust, creativity, and shared
                  achievements. By prioritizing quality, speed, and
                  collaboration, extraordinary work is accomplished together.
                  <RoughNotation
                    type="underline"
                    padding={[0, 2]}
                    strokeWidth={2}
                    color="#312DFF"
                    multiline
                  >
                    Each project marks the beginning of a relationship that
                    flourishes over time, aiming not just for completion, but
                    for ongoing growth and sustained excellence.
                  </RoughNotation>
                </Text>
              </Box>
            </AnimatedSection>
          </VStack>
        </Container>
        <Box
          ref={scrollIndicatorRef}
          position="fixed"
          bottom={0}
          left={0}
          height="10px"
          bg="brand.100"
          zIndex={1000}
          boxShadow="0 0 10px #BDE54A"
          transition="all 0.3s ease-in-out"
          _hover={{
            height: "15px",
            boxShadow: "0 0 15px #BDE54A",
          }}
        />
      </Box>
    </ChakraProvider>
  );
};

export default AboutUs;
