import React from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  Button,
  VStack,
  Flex,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { FaBookOpen, FaHandshake, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Animated Rainbow Badge for AI Powered
const RainbowBadge = ({ children }) => (
  <Box
    as="span"
    px={3}
    py={1}
    fontWeight="bold"
    fontSize="md"
    bg="black.700"
    color="gray.800"
    borderRadius="full"
    boxShadow="sm"
    display="inline-block"
    position="relative"
    mr={2}
    border="3px solid"
    sx={{
      borderImage: "linear-gradient(90deg, #ff007a, #ffae00, #00ff95, #00cfff, #a700ff) 1",
      animation: "rainbow 3s linear infinite",
      "@keyframes rainbow": {
        "0%": { borderImageSource: "linear-gradient(90deg, #ff007a, #ffae00, #00ff95, #00cfff, #a700ff)" },
        "100%": { borderImageSource: "linear-gradient(270deg, #ff007a, #ffae00, #00ff95, #00cfff, #a700ff)" },
      },
    }}
  >
    {children}
  </Box>
);

const features = [
  {
    icon: FaBookOpen,
    title: "Discover & Swap",
    desc: "Effortlessly find and exchange books with fellow readers. Powered by smart recommendations.",
  },
  {
    icon: FaHandshake,
    title: "Chat & Connect",
    desc: "Chat securely with other book lovers, coordinate swaps, and grow your reading network.",
  },
  {
    icon: FaShieldAlt,
    title: "Safe Return Policy",
    desc: "Enjoy peace of mind with our trusted swap and return policy, making every exchange friendly and secure.",
  },
];

// Modern Backdrop style: animated radial gradients with blur overlay
const Backdrop = () => (
  <Box
    position="fixed"
    inset={0}
    zIndex={-1}
    w="100vw"
    h="100vh"
    pointerEvents="none"
    _before={{
      content: '""',
      position: "absolute",
      inset: 0,
      bg:
        "radial-gradient(circle at 20% 50%, #90cdf4 0%, transparent 60%), " +
        "radial-gradient(circle at 80% 60%, #fbb6ce 0%, transparent 60%), " +
        "radial-gradient(circle at 50% 90%, #00ff95 0%, transparent 60%)",
      opacity: 0.45,
      filter: "blur(60px)",
      zIndex: -1,
      transition: "background 1s",
    }}
  />
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box fontSize={12} minH="100vh" w="full" position="relative" overflow="hidden">
      <Backdrop />

      {/* Header & Brand */}
      <Container maxW="container.md" pt={16} centerContent>
        <Heading
          fontSize={["2.2rem", "2.7rem", "3.2rem"]}
          fontWeight="extrabold"
          textAlign="center"
          color="gray.900"
          mb={2}
        >
          BookSwapHub
        </Heading>
        <Text fontSize="lg" textAlign="center">
          <RainbowBadge>New</RainbowBadge>
          BookSwapHub powered by AI ✨
        </Text>
        <Text fontSize="xl" color="gray.600" mt={2} textAlign="center">
          <i>
            A friendly platform for book lovers to connect, swap, and return books safely.
          </i>
        </Text>
      </Container>

      {/* Features - aligned horizontally */}
      <Container maxW="container.lg" mt={16}>
        <Flex
          direction={["column", "row"]}
          justify="center"
          align="stretch"
          gap={8}
          wrap="wrap"
        >
          {features.map((feature, idx) => (
            <Box
              key={idx}
              flex="1"
              minW={["100%", "300px"]}
              maxW="350px"
              p={8}
              borderRadius="2xl"
              boxShadow="lg"
              bg="whiteAlpha.900"
              borderWidth="2px"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{
                boxShadow: "xl",
                borderColor: "blue.400",
                transform: "scale(1.04)",
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Flex align="center" justify="center" mb={4}>
                <Icon as={feature.icon} boxSize={10} color="blue.400" />
              </Flex>
              <Heading
                size="md"
                color="gray.900"
                textAlign="center"
                mb={2}
                fontWeight="bold"
              >
                {feature.title}
              </Heading>
              <Text color="gray.600" fontSize="md" textAlign="center">
                {feature.desc}
              </Text>
            </Box>
          ))}
        </Flex>
      </Container>

      {/* Call to Action */}
      <VStack mt={16} spacing={3} align="center">
        <Heading fontSize="2xl" color="gray.900" textAlign="center">
          Ready to swap your next book?
        </Heading>
        <Button
          colorScheme="blue"
          size="lg"
          fontWeight="bold"
          px={10}
          boxShadow="md"
          onClick={() => navigate("/register")}
        >
          Join BookSwapHub Now
        </Button>
        <Text fontSize="md" color="gray.600" textAlign="center">
          Join thousands of happy readers. Safe. Friendly. Free to start!
        </Text>
      </VStack>

      {/* Footer */}
      <Box
        py={6}
        textAlign="center"
        color="gray.500"
        fontSize="sm"
        borderTopWidth="1px"
        borderColor="gray.200"
      >
        &copy; {new Date().getFullYear()} BookSwapHub. All rights reserved.
      </Box>
    </Box>
  );
};

export default LandingPage;