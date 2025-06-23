import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Stack,
  Button,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adhaarNum, setAdhaarNum] = useState("");

  const registerFunction = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/register`,
        { username, email, password, adhaarNum }
      );

      toast({
        title: "Registration Successful!",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/login");
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.error ||
        (error.request ? "Network error" : "Unexpected error");

      toast({
        title: "Registration Failed",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={6} maxW={"lg"} w={"full"} px={6} py={12}>
        <Stack spacing={1} align={"center"}>
          <Heading onClick={()=>navigate('/landing')} cursor={'pointer'} fontSize={"4xl"} textAlign="center">
            📚 BookSwapHub
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Exchange. Empower. Educate.
          </Text>
        </Stack>

        <Box
          rounded={"2xl"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"2xl"}
          p={8}
        >
          <form onSubmit={registerFunction}>
            <Stack spacing={5}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  placeholder="e.g. johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <FormControl id="adhaar" isRequired>
                <FormLabel>Aadhaar Number</FormLabel>
                <Input
                  type="number"
                  placeholder="12-digit Aadhaar"
                  value={adhaarNum}
                  onChange={(e) => setAdhaarNum(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                mt={4}
                colorScheme="blue"
                size="lg"
                fontWeight="bold"
              >
                Register
              </Button>

              <Text align="center" pt={2}>
                Already have an account?{" "}
                <Link href="/login" color={"blue.500"}>
                  Login
                </Link>
              </Text>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Register;