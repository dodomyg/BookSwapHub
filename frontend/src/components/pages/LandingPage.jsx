import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  Link,
  Container,
  Badge,
  HStack,
  Button,
} from "@chakra-ui/react";
import Gif from "../../Images/books.gif";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const renderBoxes = [
    "Easily find and exchange books with fellow readers. BookSwap Hub connects book lovers to seamlessly swap their favorite reads.",
    "Talk directly with users through our secure chat system. Coordinate swaps, ask questions, and build connections within the reading community.",
    "Quickly filter books by name or category. Manage your swaps effortlessly with our intuitive and organized interface.",
  ];
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    adhaarNum: "",
  });

  return (
    <Box
      backdropFilter={"blur(10px)"}
      align={"center"}
      h={"100vh"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.500")}
    >
      <Box position={"fixed"} top={0} left={"10px"}>
        <img src={Gif} alt="Book Swap" width={150} height={150} />
      </Box>
      <Box position={"fixed"} top={0} right={"10px"}>
        <img src={Gif} alt="Book Swap" width={150} height={150} />
      </Box>
      <Container pt={160} mb={10}>
        <Heading fontSize={"50px"} textAlign={"center"}>
          📚 BookSwapHub
        </Heading>
        <Text fontSize={"20px"} mt={2} textAlign={"center"}>
          <Badge colorScheme="green">New</Badge> BookSwapHub powered by AI ✨
        </Text>
      </Container>
      <Text mb={8} textAlign={"center"} fontSize="lg" color={"gray"}>
        <i>A Safe and Secure Platform for Book Lovers to Connect and Swap</i>
      </Text>
      <HStack
        alignItems={"center"}
        justifyContent={"space-evenly"}
        px={8}
        // mb={7}
      >
        {renderBoxes.map((m, i) => (
          <Box
            w={"400px"}
            key={i}
            p={6}
            borderRadius="lg"
            boxShadow="2xl"
            backdropFilter="blur(10px)"
            bg="rgba(255, 255, 255, 0.2)"
            border="1px solid rgba(255,255,255,0.3)"
            color="black"
          >
            <Text textAlign={"start"} lineHeight={1.8}>
              {m}
            </Text>
          </Box>
        ))}
      </HStack>
      <Box mt={"40px"} alignItems={"center"}>
        <Button colorScheme="blue" onClick={() => navigate("/login")} mr={4}>Login</Button>
        <Button colorScheme="blue" onClick={() => navigate("/register")}>Register</Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
