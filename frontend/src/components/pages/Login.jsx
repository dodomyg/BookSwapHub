import React, { useContext, useState } from "react";
import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  Link,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import BookImage from "../../Images/Books.webp";

axios.defaults.withCredentials = true;

const Login = () => {
  const toast = useToast();
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/login`,
        { username, password },
        { withCredentials: true }
      );

      toast({
        title: "Login successful",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setUser(response.data.alreadyUser);
      navigate("/");
    } catch (error) {
      console.error(error);
      let message = "Unexpected error";
      if (error.response) {
        message = error.response.data.error || "Server error";
      } else if (error.request) {
        message = "Network error";
      }

      toast({
        title: "Login failed",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack h="100vh" direction={{ base: "column", md: "row" }}>
      {/* LEFT SIDE FORM */}
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={6} w="full" maxW="md">
          <Heading fontSize="3xl" textAlign="center" color="blue.600">
            Welcome Back to BookSwapHub 📚
          </Heading>
          <Text fontSize="md" color="gray.600" textAlign="center">
            Sign in to explore and exchange knowledge.
          </Text>

          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  placeholder="Enter your username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" size="lg" fontWeight="bold">
                Sign In
              </Button>

              <Text fontSize="sm" textAlign="center">
                Don’t have an account?{" "}
                <Link href="/register" color="blue.500" fontWeight="medium">
                  Register here
                </Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Flex>

      {/* RIGHT SIDE IMAGE */}
      <Flex flex={1} display={{ base: "none", md: "flex" }}>
        <Image
          alt="Books background"
          objectFit="cover"
          w="100%"
          h="100%"
          src={BookImage}
        />
      </Flex>
    </Stack>
  );
};

export default Login;