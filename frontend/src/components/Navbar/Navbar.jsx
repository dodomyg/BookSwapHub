import React, {useContext} from 'react';
import { Link,useNavigate,NavLink } from 'react-router-dom';

// import {HiOutlineMenuAlt3} from "react-icons/hi";
import {Avatar,useToast,Box , HStack,Button,Heading,Container,VStack,useDisclosure,IconButton} from "@chakra-ui/react"
import { UserContext } from '../../context/UserContext';
import { GiHamburgerMenu } from "react-icons/gi";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  Tooltip,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import axios from 'axios';


const Navbar = () => {
  const toast = useToast()
  const navi = useNavigate()
  const {user,setUser} = useContext(UserContext)



  const logOut = async() => {
    try {
     const resp = await axios.post("http://localhost:8080/api/users/logout",{withCredentials:true})
     setUser(null)
      toast({
        title: resp.data.message,
        status: 'success',
        duration: 2000,
      })
      navi('/login')
    } catch (error) {
      navi("/")
      console.log(error)
      if (error.response) {
        toast({
            title: error.response.data.error || "Server error",
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } else if (error.request) {
        
        toast({
            title: "Network error",
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } else {
        
        toast({
            title: "Unexpected error",
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
    }
  }
  // const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <Box boxShadow={"lg"} p={4} color="black">
      <Container maxW="container.xl">
        <HStack justifyContent="space-between">
          <Heading size="md" fontWeight={"500"}>BookSwapHub</Heading>

          <HStack spacing={[2, 10]} alignItems="flex-end">
            <IconButton
              aria-label="Open Menu"
              size="lg"
              icon={<GiHamburgerMenu />}
              ref={btnRef}
              onClick={onOpen}
              display={{ base: "block", md: "none" }}
            />
            <HStack spacing={5} display={{ base: "none", md: "flex" }}>
              <Link fontSize="lg" to={"/"}>Home</Link>
              <Link fontSize="lg" to={"/about"}>About</Link>
              <Link fontSize="lg" to={"/profile"}>My Profile</Link>
              {user ? (
                <>
                <Link fontSize="lg" onClick={logOut}>Logout</Link>
                <Tooltip  label={"Welcome "+user?.username}>
                <Avatar cursor={"pointer"} size='sm' name={user?.username} />
                </Tooltip>
                </>
              ) : (
                <>
                  <NavLink to="/login"><Link fontSize="lg">Login</Link></NavLink>
                  <NavLink to="/register"><Link fontSize="lg">Register</Link></NavLink>
                </>
              )}
            </HStack>
          </HStack>
        </HStack>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Your Logo</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4}>
              <Link fontSize="lg" to={"/"}>Home</Link>
                <Link fontSize="lg" to={"/about"}>About</Link>
                <Link fontSize="lg" to={"/profile"}>My Profile</Link>
                {user ? (
                  <Button type="button" onClick={logOut}>Logout</Button>
                ) : (
                  <>
                    <NavLink to="/login"><Link fontSize="lg">Login</Link></NavLink>
                    <NavLink to="/register"><Link fontSize="lg">Register</Link></NavLink>
                  </>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>
    </Box>
  )
}

export default Navbar