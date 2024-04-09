import { Flex } from '@chakra-ui/react'
import { Card, CardBody, Heading, Text, Stack, Image, Button, CardFooter,HStack,useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'

const Holdings = () => {


  const [holdings,setHoldings]=useState([])
  const [loading,setLoading]=useState(false)
  const {user}=useContext(UserContext)
  const toast = useToast()

  useEffect(()=>{
    
      const getHoldings=async()=>{
        try {
          setLoading(true)
          const resp = await axios.get(`http://localhost:8080/api/books/my/holdings`,{withCredentials:true})
          setHoldings(resp.data)
          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.log(error);
        }
      }

      getHoldings()
      
    
  },[])

  const returnBook=async(id)=>{
    try {
      const resp = await axios.post(`http://localhost:8080/api/books/return/${id}`,{withCredentials:true})
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
if(loading)return <h1>loading</h1>
  return (
    <div>
        <Flex flexDir={"column"} alignItems={"center"} gap={5}>
        <Text fontWeight={"600"} fontSize={'21px'}>My Holdings</Text>
        {!loading && holdings.length===0 ? <h1 style={{width:"850px",textAlign:"center"}}>You are not holding any books right now</h1> : !loading && holdings.map((book)=>(
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
            alt='Caffe Latte'
          />
        
          <Stack>
            <CardBody>
              <Heading size='md'>{book?.title}</Heading>
        
              <Text py='1'>
                {book?.author}
              </Text>
            </CardBody>

            <HStack ml={5} alignItems={'center'}>
              <Text>Approved by the Owner : </Text>
              <Text as={'b'}>{book?.owner?.username}</Text>
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
              <Button type='button' onClick={()=>returnBook(book?._id)} colorScheme='twitter' >
                Return Book
              </Button>
            </CardFooter>
          </Stack>
        </Card>
        ))}
        </Flex>
    </div>
  )
}

export default Holdings