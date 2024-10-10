"use client";

import React, { useRef, useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { gsap } from "gsap";

const StyledMenuList = styled(MenuList)`
  background: linear-gradient(145deg, #bde54c, #a6cc44);
  border-color: #bde54c;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 -1px 1px rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
  min-width: 220px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='0.05' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    pointer-events: none;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  background: rgba(189, 229, 76, 0.8);
  color: black;
  font-size: 1.2rem;
  font-family: "Rufina", serif;
  padding: 1rem 1.2rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(189, 229, 76, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 1px rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1),
      inset 0 1px 1px rgba(255, 255, 255, 0.2);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Menux: React.FC = () => {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(overlayRef.current, { xPercent: -100 });
  }, []);

  const handleNavigation = (path: string) => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        xPercent: 0,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => {
          router.push(path);
          setTimeout(() => {
            gsap.to(overlayRef.current, {
              xPercent: 100,
              duration: 0.25,
              ease: "power2.inOut",
            });
          }, 250); // Wait for 250ms (0.25s) before starting to hide the overlay
        },
      });
    } else {
      router.push(path);
    }
  };

  return (
    <>
      <Box position="fixed" top={4} right={6} zIndex={1000}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon boxSize={24} />}
            variant="solid"
            bg="linear-gradient(145deg, #BDE54C, #a6cc44)"
            color="black"
            size="lg"
            borderRadius="30%"
            _active={{ bg: "linear-gradient(145deg, #a6cc44, #8fb33a)" }}
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          />
          <StyledMenuList>
            <StyledMenuItem onClick={() => handleNavigation("/")}>
              <Text textAlign="center" className="font-rufina">
                Home
              </Text>
            </StyledMenuItem>
            <StyledMenuItem onClick={() => handleNavigation("/services")}>
              <Text textAlign="center" className="font-rufina">
                Services
              </Text>
            </StyledMenuItem>
            <StyledMenuItem onClick={() => handleNavigation("/about_us")}>
              <Text textAlign="center" className="font-rufina">
                About Us
              </Text>
            </StyledMenuItem>
            <StyledMenuItem onClick={() => handleNavigation("/portofolio")}>
              <Text textAlign="center" className="font-rufina">
                Portofolio
              </Text>
            </StyledMenuItem>
            <StyledMenuItem onClick={() => handleNavigation("/contact")}>
              <Text textAlign="center" className="font-rufina">
                Contact
              </Text>
            </StyledMenuItem>
          </StyledMenuList>
        </Menu>
      </Box>
      <Box
        ref={overlayRef}
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="#BDE54C"
        zIndex={999}
        pointerEvents="none"
      />
    </>
  );
};

export default Menux;
