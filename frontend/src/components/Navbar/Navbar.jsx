import React, { useContext } from "react";
import {
  Box,
  HStack,
  Button,
  Heading,
  Container,
  VStack,
  useDisclosure,
  IconButton,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
} from "@chakra-ui/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { FaChevronCircleDown } from "react-icons/fa";

axios.defaults.withCredentials = true;

const Navbar = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const logOut = async () => {
    try {
      const resp = await axios.post("https://bookswaphub-ejar.onrender.com/api/users/logout", {}, {
        withCredentials: true,
      });
      setUser(null);
      toast({
        title: resp.data.message,
        status: "success",
        duration: 2000,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: error?.response?.data?.error || "Logout failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const NavItem = ({ to, label }) => (
    <NavLink to={to}>
      <ChakraLink fontSize="md" fontWeight="medium" _hover={{ color: "blue.500" }}>
        {label}
      </ChakraLink>
    </NavLink>
  );

  return (
    <Box boxShadow="sm" bg="white" p={2} position="sticky" top={0} zIndex={1000}>
      <Container maxW="container.xl">
        <HStack justify="space-between">
          <Link to="/">
            <Heading size="md" color="blue.600">
              📚 BookSwapHub
            </Heading>
          </Link>

          <HStack spacing={6} display={{ base: "none", md: "flex" }} align="center">
            <NavItem to="/" label="Home" />
            <NavItem to="/about" label="About" />
            <NavItem to="/preferences" label="Ask AI ✨" />
            <NavItem to="/create" label="Add Books" />

            {user ? (
              <>
                <Menu>
                  <MenuButton as={Button} rightIcon={<FaChevronCircleDown />} size="sm" variant="outline">
                    {user.username}
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} to="/profile">📘 My Library</MenuItem>
                    <MenuItem as={Link} to="/saved">🔖 Saved Books</MenuItem>
                    {/* <MenuItem as={Link} to="/marketplace">🛒 Marketplace</MenuItem> */}
                    <MenuDivider />
                    <MenuItem color="red.500" onClick={logOut}>🚪 Logout</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <NavItem to="/login" label="Login" />
                <NavItem to="/register" label="Register" />
              </>
            )}
          </HStack>

          <IconButton
            ref={btnRef}
            icon={<GiHamburgerMenu />}
            variant="ghost"
            aria-label="Open menu"
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
          />
        </HStack>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start" mt={4}>
              <NavItem to="/" label="Home" />
              <NavItem to="/about" label="About" />
              <NavItem to="/preferences" label="Ask AI ✨" />
              <NavItem to="/create" label="Add Books" />

              {user ? (
                <>
                  <NavItem to="/profile" label="My Library" />
                  <NavItem to="/saved" label="Saved Books" />
                  {/* <NavItem to="/marketplace" label="Marketplace" /> */}
                  <Button colorScheme="red" size="sm" onClick={logOut}>
                    Logout
                  </Button>
                </>
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