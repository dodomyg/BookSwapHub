import React, { useState } from 'react'
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
} from '@chakra-ui/react'

import axios from "axios"
import {useNavigate} from "react-router-dom"

const Register = () => {

  const navigate=useNavigate()
  const toast = useToast()

  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [adhaarNum,setAdhaarNum]=useState('')


  const registerFunction=async(e)=>{    
    e.preventDefault()
    try {
      const response = await axios.post(`http://localhost:8080/api/users/register`,{username,email,password,adhaarNum:adhaarNum})
      console.log(response.data)
      navigate("/login")
    } catch (error) {
      navigate("/register")
      console.log(error);
      navigate("/register")
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





  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
             BookSwapHub
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
           Sign up !
          </Text>
        </Stack>
        <Box
        width={"100%"}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <form style={{width:"100%"}} onSubmit={registerFunction}>
          <Stack spacing={4}>
          <FormControl id="firstName" >
                  <FormLabel>Username</FormLabel>
                  <Input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} />
          </FormControl>
            <FormControl id="email" >
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" >
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
              </InputGroup>
            </FormControl>
            <FormControl id="password" >
              <FormLabel>Adhaar Number</FormLabel>
              <InputGroup>
                <Input type='number' value={adhaarNum} onChange={(e)=>setAdhaarNum(e.target.value)}/>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
              type='submit'
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>
            </Stack>
            
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} href='/login'>Login</Link>
              </Text>
            </Stack>
          </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Register