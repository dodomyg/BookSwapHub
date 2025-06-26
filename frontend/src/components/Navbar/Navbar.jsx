import React, { useContext } from "react";
import {
  Avatar,
  Box,
  HStack,
  Button,
  Heading,
  Container,
  VStack,
  useDisclosure,
  IconButton,
  Tooltip,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { GiHamburgerMenu, GiInfo } from "react-icons/gi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

axios.defaults.withCredentials = true;

const Navbar = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const logOut = async () => {
    try {
      const resp = await axios.post(
        "http://localhost:8080/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      toast({
        title: resp.data.message,
        status: "success",
        duration: 2000,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast({
        title:
          error?.response?.data?.error ||
          (error.request ? "Network error" : "Unexpected error"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const NavItem = ({ to, label }) => (
    <NavLink to={to}>
      <ChakraLink
        fontSize="md"
        fontWeight="medium"
        _hover={{ color: "blue.500" }}
      >
        {label}
      </ChakraLink>
    </NavLink>
  );

  return (
    <Box
      boxShadow="sm"
      bg="white"
      p={2}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Container maxW="container.xl">
        <HStack justify="space-between" align="center">
          {/* Logo */}
          <Link to="/">
            <Heading size="md" color="blue.600">
              📚 BookSwapHub
            </Heading>
          </Link>

          {/* Desktop Nav */}
          <HStack
            spacing={6}
            display={{ base: "none", md: "flex" }}
            align="center"
          >
            <NavItem to="/" label="Home" />
            <NavItem to="/about" label="About" />
            <NavItem to="/preferences" label="Ask AI ✨" />
            <NavItem to="/create" label="Add Books" />
            <NavItem to="/profile" label="My Library" />

            {user ? (
              <>
                <Button
                  onClick={logOut}
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                >
                  Logout
                </Button>
                <Tooltip label={`Welcome ${user.username}`} hasArrow>
                  <Avatar
                    size="sm"
                    name={user.username}
                    cursor="pointer"
                    bg="blue.400"
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <NavItem to="/login" label="Login" />
                <NavItem to="/register" label="Register" />
              </>
            )}
          </HStack>

          {/* Mobile Menu Button */}
          {/* <IconButton
            ref={btnRef}
            onClick={onOpen}
            icon={<GiHamburgerMenu />}
            variant="ghost"
            aria-label="Open menu"
            display={{ base: "flex", md: "none" }}
          /> */}
        </HStack>
      </Container>

      {/* Drawer for Mobile */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start" mt={4}>
              <NavItem to="/" label="Home" />
              <NavItem to="/about" label="About" />
              <NavItem to="/create" label="Create" />
              <NavItem to="/profile" label="My Library" />
              {user ? (
                <Button colorScheme="red" variant="solid" onClick={logOut}>
                  Logout
                </Button>
              ) : (
                <>
                  <NavItem to="/login" label="Login" />
                  <NavItem to="/register" label="Register" />
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
