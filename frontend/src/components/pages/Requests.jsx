import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import axios from "axios"
import { Flex, HStack, Text } from '@chakra-ui/react'
import { Card,Heading,Stack,Image,useToast, CardBody, CardFooter,Button } from '@chakra-ui/react'

const Requests = () => {

    const {user}=useContext(UserContext)
    const [req,setReq]=useState([])
    const [loading,setLoading]=useState(false)
    const toast = useToast()

useEffect(()=>{
    const fetchRequets=async()=>{
        try {
            setLoading(true)
            const resp = await axios.get(`http://localhost:8080/api/books/view/requests`,{withCredentials:true})
            setReq(resp.data)
            // console.log(resp.data);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }
    fetchRequets()
},[])


const acceptRequest=async(id)=>{
    try {
        const resp = await axios.put(`http://localhost:8080/api/books/approve/${id}`,{withCredentials:true})
        console.log(resp.data);
        toast({
            title:resp.data.message,
            status:'success',
        });
    } catch (error) {
        console.log(error);
      if (error.response) {
        toast({
          title: error.response.data.error || 'Server error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (error.request) {
        toast({
          title: 'Network error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Unexpected error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
}

const rejectRequest=async(id)=>{
    try {
        const resp = await axios.put(`http://localhost:8080/api/books/reject/${id}`,{withCredentials:true})
        // console.log(resp.data);
        toast({
            title:resp.data.message,
            status:'success',
        });
    } catch (error) {
        console.log(error);
      if (error.response) {
        toast({
          title: error.response.data.error || 'Server error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (error.request) {
        toast({
          title: 'Network error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Unexpected error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
}







if(loading) return <h1>Loading...</h1>
if(!user) return;
  return (
    <div>
        <Flex flexDir={"column"} alignItems={"center"} gap={5}>

            <Text fontWeight={"600"} fontSize={'21px'}>Requests</Text>
            {!loading && req.length===0 ? <h1 style={{width:"850px",textAlign:"center"}}>No Requests Found</h1> :!loading && req.map((i)=>(
            <Card
            key={i._id}
            width={{ base: '100%', sm: "850px" }}
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
          >
            <Image
              objectFit='cover'
              maxW={{ base: '100%', sm: '130px' }}
              src={i?.frontPage}
              alt='Caffe Latte'
            />
          
            <Stack>
              <CardBody>
                <Heading size='md'>{i?.title}</Heading>
          
                <Text py='1'>
                  {i?.author}
                </Text>
              </CardBody>

              <HStack ml={5} alignItems={'center'}>
                <Text>Requester : </Text>
                <Text as={'b'}>{i?.requester?.username}</Text>
              </HStack>
              <HStack ml={5} alignItems={'center'}>
                <Text>Category: </Text>
            <Text as={'b'}>
        {i?.category.join(", ")}
            </Text>
            </HStack>
          
              <CardFooter display={"flex"} gap={5}>
              <Button type='button' onClick={()=>acceptRequest(i?._id)} variant='solid' colorScheme='blue'>
                  Approve Request of  { i?.requester?.username}
                </Button>
                <Button type='button' onClick={()=>rejectRequest(i?._id)} variant='solid' colorScheme='red'>
                  Reject Request of  { i?.requester?.username}
                </Button>
              </CardFooter>
            </Stack>
          </Card>
        ))}

        </Flex>
    </div>
  )
}

export default Requests