"use client";

import React from "react";
import {
  Box,
  Card,
  CardBody,
  Stack,
  Heading,
  Button,
  Text,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import Image from "next/image";

const theme = extendTheme({
  colors: {
    brand: {
      100: "#BDE54C",
      200: "#BDE54C",
      300: "#BDE54C",
    },
  },
});

interface PictProps {
  title: string;
  subtitle?: string;
  heading: string;
  description: string;
  imageSrc: string;
}

const Pict: React.FC<PictProps> = ({
  title,
  subtitle,
  heading,
  description,
  imageSrc,
}) => {
  return (
    <ChakraProvider theme={theme}>
      <Box className="w-full h-full flex flex-col lg:flex-row" bg="#000000">
        <Box className="flex-1 flex justify-center items-center p-2 lg:p-4 lg:mr-16">
          <Card
            w="100%"
            h="100%"
            maxH={{ base: "50vh", lg: "70vh" }}
            borderRadius="0"
            overflow="hidden"
            position="relative"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              overflow="hidden"
              transform="skew(5deg)"
              transformOrigin="center"
            >
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  transform: "skew(-5deg) scale(1.2)", // Compensate for the skew
                  transformOrigin: "center",
                }}
                priority={imageSrc === "/images/c1.webp"}
              />
            </Box>
            <CardBody
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              zIndex={1}
              bg="rgba(0, 0, 0, 0.6)"
              h="100%"
              transform="skew(-5deg)"
              border="2px solid #FCABFC"
              boxShadow="0 0 10px 2px rgba(252, 171, 252, 0.3)"
              style={{
                animation: "levitate 3s ease-in-out infinite",
              }}
            >
              <Stack spacing={2} textAlign="center" color="white">
                <Heading
                  size={{ base: "lg", lg: "2xl" }}
                  className="font-rufina"
                >
                  {title}
                </Heading>
                {subtitle && (
                  <Heading
                    size={{ base: "md", lg: "xl" }}
                    className="font-rufina"
                  >
                    {subtitle}
                  </Heading>
                )}
              </Stack>
              <Button
                colorScheme="brand"
                className="font-oxygen mt-4 relative overflow-hidden"
                borderRadius="0"
                size={{ base: "sm", lg: "lg" }}
                transform="skew(5deg)"
                _hover={{
                  transform: "skew(5deg) translateY(-2px)",
                  boxShadow: "lg",
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
                  "@keyframes levitate": {
                    "0%, 100%": { transform: "skew(-5deg) translateY(0)" },
                    "50%": { transform: "skew(-5deg) translateY(-10px)" },
                  },
                }}
              >
                Details
              </Button>
            </CardBody>
          </Card>
        </Box>

        <Box className="flex-1 flex flex-col justify-center items-start p-2 lg:p-4 lg:ml-16">
          <Heading
            as="h2"
            size={{ base: "md", lg: "3xl" }}
            className="font-rufina mb-2 lg:mb-6"
            color="#BDE54C"
          >
            {heading}
          </Heading>
          <Text
            className="font-oxygen text-white"
            fontSize={{ base: "xs", lg: "xl" }}
            lineHeight={{ base: "normal", lg: "tall" }}
          >
            {description}
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Pict;
