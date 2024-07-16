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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BookImage from "../../Images/Books.webp";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

axios.defaults.withCredentials = true;

const Login = () => {
  const toast = useToast();
  const { setUser } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
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
        title: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setUser(response.data.alreadyUser);
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast({
          title: error.response.data.error || "Server error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (error.request) {
        toast({
          title: "Network error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Unexpected error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Stack overflow={"hidden"} h={"100vh"} justifyContent={"center"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Sign in to your account</Heading>
          <form onSubmit={handleLogin}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Text>Don't have an account?</Text>
                <Link color={"blue.400"} href="/register">
                  Register
                </Link>
              </Stack>
              <Button type="submit" colorScheme={"blue"} variant={"solid"}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Flex>
      <Flex flex={1} align={"center"} justify={"center"}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={BookImage}
        />
      </Flex>
    </Stack>
  );
};

export default Login;
