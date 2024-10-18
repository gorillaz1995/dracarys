import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Text,
  VStack,
  useMediaQuery,
  Button,
} from "@chakra-ui/react";
import { RoughNotation } from "react-rough-notation";

const Footer: React.FC = () => {
  const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");
  const [showToast, setShowToast] = useState(false);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("0721792999");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const GlowingButton = () => (
    <Button
      bg="black"
      color="white"
      fontSize={isLargerThan1000 ? "2.65rem" : "1.5rem"}
      px={isLargerThan1000 ? 8 : 6}
      py={isLargerThan1000 ? 4 : 3}
      width="calc(130% * var(--chakra-sizes-max-content))"
      position="relative"
      overflow="hidden"
      onClick={handleCopyNumber}
      _hover={{
        bg: "gray.800",
        transform: "translateY(-2px)",
        boxShadow: "0 0 15px 5px rgba(189, 229, 74, 0.5)",
        _after: {
          opacity: 1,
        },
      }}
      sx={{
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
          animation: "shimmer 3s infinite",
        },
        "@keyframes shimmer": {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
        boxShadow: "0 0 10px 2px rgba(189, 229, 74, 0.3)",
        transition: "all 0.3s ease-in-out",
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        background:
          "radial-gradient(circle, rgba(189, 229, 74, 0.2) 0%, transparent 70%)",
        opacity: 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      LET&apos;S TALK
    </Button>
  );

  return (
    <Box
      as="footer"
      bg="#BDE54C"
      color="#000000"
      fontFamily="Rufina, serif"
      height={isLargerThan1000 ? "37vh" : "auto"}
      minHeight={isLargerThan1000 ? "37vh" : "auto"}
      style={{
        transition: "background-color 0.3s ease-in-out",
      }}
      _hover={{
        backgroundColor: "#a8d043",
      }}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="container.xl" height="100%" py={6}>
        {isLargerThan1000 ? (
          <Grid templateColumns="repeat(3, 1fr)" gap={6} height="100%">
            <GridItem
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <VStack align="center" spacing={4}>
                <Text fontWeight="bold" fontSize="3rem" textAlign="center">
                  Need It Done Fast and Right?
                </Text>
                <GlowingButton />
              </VStack>
            </GridItem>
            <GridItem
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <VStack align="center" spacing={4}>
                <Text fontSize="1.85rem" textAlign="center">
                  darkadv@gmail.com
                </Text>
                <Text fontSize="1.85rem" textAlign="center">
                  Str. Ecaterina Teodoroiu 45, Voluntari, Ilfov
                </Text>
              </VStack>
            </GridItem>
            <GridItem
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <VStack align="center" spacing={4}>
                <Text fontSize="1.45rem" textAlign="center">
                  © 2024 Usagi Technologies
                </Text>
                <Text fontSize="2.65rem" textAlign="center">
                  Made with{" "}
                  <RoughNotation
                    type="strike-through"
                    show={true}
                    color="#000000"
                  >
                    love
                  </RoughNotation>{" "}
                  ... a keyboard.
                </Text>
              </VStack>
            </GridItem>
          </Grid>
        ) : (
          <VStack spacing={6} align="center">
            <Text fontWeight="bold" fontSize="1.5rem">
              Need It Done Fast and Right?
            </Text>
            <GlowingButton />
            <Text fontSize="1.5rem">darkadv@gmail.com</Text>
            <Text fontSize="1.2rem" textAlign="center">
              Str. Ecaterina Teodoroiu 45, Voluntari, Ilfov
            </Text>
            <Text fontSize="1.15rem">© 2024 Usagi Technologies</Text>
            <Text fontSize="1.5rem">
              Made with{" "}
              <RoughNotation type="strike-through" show={true} color="#000000">
                love
              </RoughNotation>{" "}
              ... a keyboard.
            </Text>
          </VStack>
        )}
      </Container>
      {showToast && (
        <Box
          position="absolute"
          top="0"
          left="50%"
          transform="translateX(-50%)"
          bg="black"
          color="white"
          borderRadius="md"
          p={3}
          zIndex={1000}
          fontFamily="Oxygen, sans-serif"
          animation="slideDown 0.5s ease-out"
          sx={{
            "@keyframes slideDown": {
              "0%": { top: "-50px", opacity: 0 },
              "100%": { top: "20px", opacity: 1 },
            },
          }}
        >
          You copied our phone number. Give us a call!
        </Box>
      )}
    </Box>
  );
};

export default Footer;
