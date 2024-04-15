import React, { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Heading, Text, Stack, Image, CardFooter, HStack, Flex,useToast, Button } from '@chakra-ui/react'
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
axios.defaults.withCredentials = true

const MyBooks = () => {


  const [returned,setReturned]=useState([]);
  const [loading,setLoading]=useState(false)
  const {user}=useContext(UserContext)
  const toast = useToast()


  useEffect(()=>{
    const fetchReturned=async()=>{
      try {
        setLoading(true)
        const resp = await axios.get(`http://localhost:8080/api/users/myBooks`,{withCredentials:true})
        setReturned(resp.data)
        console.log("Returned Books",resp.data);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    fetchReturned()
  },[])

  const deleteBook=async(id)=>{
    try {
      const resp = await axios.delete(`http://localhost:8080/api/books/${id}`,{withCredentials:true})
      console.log(resp.data);
      toast({
        title:resp.data.message,
        status:'success',
        duration:2000
      })

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


if(!user) return;
  return (
    <div>
         <Flex flexDir={"column"} alignItems={"center"} gap={5}>
        <Text fontWeight={"600"} fontSize={'21px'}>My Books</Text>
        {!loading && returned.length === 0 ? <h1 style={{width:"850px",textAlign:"center"}}>You dont have any books</h1> : !loading && returned.map((book)=>(
          <Card
          key={book?._id}
          width={{ base: '100%', sm: "850px" }}
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
        >
          <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '130px' }}
            src={book?.frontPage}
            alt={book?.title}
          />
        
          <Stack>
            <CardBody>
              <Heading size='md'>{book?.title}</Heading>
        
              <Text py='1'>
                {book?.author}
              </Text>

              <Text display={'flex'} alignItems={'center'} gap={2}>
                {book?.holder && <>
                <Text>Holder is : <Text as={'b'}>{book?.holder?.username}</Text></Text>
                
                <Text>Email of holder is : <Text as={'b'}>{book?.holder?.email}</Text></Text>
                </> }
              </Text>
            </CardBody>

            <HStack ml={5} alignItems={'center'}>
              <Text>Available for swapping: </Text>
              <Text as={'b'}>{book?.isAvailable ? "Yes" : "No"}</Text>
            </HStack>
            <HStack ml={5} alignItems={'center'}>
              <Text>Category: </Text>
          <Text as={'b'}>
      {book?.category.join(", ")}
          </Text>
          <Text mx={2}>
            Edition: {book?.edition}
          </Text>
          <Text mx={2}>
            Isbn: {book?.isbn}
          </Text>
          </HStack>
        
            <CardFooter display={"flex"} gap={5}>
              <Button colorScheme='red' onClick={() => deleteBook(book?._id)}>Delete Book</Button>
            </CardFooter>
          </Stack>
        </Card>
        ))}
        </Flex>
    </div>
  )
}

export default MyBooks