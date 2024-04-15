import React, { useContext, useEffect, useState } from 'react'
import {useParams} from "react-router-dom"
import {
    Box,
    Container,
    HStack,
    Stack,
    Text,
    Image,
    Flex,
    useToast,
    VStack,
    Button,
    Heading,
    SimpleGrid,
    StackDivider,
    useColorModeValue,
    List,
    ListItem,
  } from '@chakra-ui/react'
import axios from "axios"
import { FaIdCardAlt } from 'react-icons/fa'
import ChatButton from '../ChatButton/ChatButton'
import { UserContext } from '../../context/UserContext'

const SinglePage = () => {
    const {bookId} = useParams()
    const {user}=useContext(UserContext)
    const toast = useToast()
    const [book,setBook]=useState(null)
    const [req,sentReq]=useState(false)
    console.log(req);
    console.log(book?.requester===null);
    useEffect(() => {
      const fetchSingleBook = async () => {
          try {
              const resp = await axios.get(`http://localhost:8080/api/books/${bookId}`, { withCredentials: true });
              setBook(resp.data);
              console.log(resp.data);
              // Check if the book has a requester and the user is logged in
              if (book?.requester!==null && book?.requester._id && user?._id) {
                  // Check if the requester's _id matches the user's _id
                  if (book?.requester!==null && book?.requester._id === user._id) {
                      sentReq(true);
                  } else {
                      // User has not requested the book
                      sentReq(false);
                  }
              } else {
                  // No requester or user not logged in
                  sentReq(false);
              }
          } catch (error) {
              console.log(error);
          }
      }

      fetchSingleBook();
  }, [bookId, user]);
  
  
  
  


  const requestBook = async () => {
    try {
        const resp = await axios.post(`http://localhost:8080/api/books/request/${bookId}`, {}, { withCredentials: true });
        console.log(resp.data);
        sentReq(!req); // Update the request status
        alert(resp.data.message);
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
};   

  return (
    <Container maxW={'7xl'}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 9, md: 12 }}>
        <Flex flexDir={'column'} justifyContent={'center'} gap={10}>
        <Image
  rounded={'md'}
  alt={book?.frontPage}
  src={`http://localhost:8080/${book?.frontPage}`}
  fit={'cover'}
  align={'center'}
  w={'72%'}
/>

<Image
  rounded={'md'}
  alt={book?.backPage}
  src={`http://localhost:8080/${book?.backPage}`} 
  fit={'cover'}
  align={'center'}
  w={'72%'}
/>
        </Flex>
        
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
              {book?.title}
            </Heading>
            <Text
              color={useColorModeValue('gray.900', 'gray.400')}
              fontWeight={300}
              fontSize={'2xl'}>
              {book?.author}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider borderColor={useColorModeValue('gray.200', 'gray.600')} />
            }>
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text
                color={useColorModeValue('gray.500', 'gray.400')}
                fontSize={'2xl'}
                fontWeight={'300'}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore
              </Text>
              <Text fontSize={'lg'}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquid amet
                at delectus doloribus dolorum expedita hic, ipsum maxime modi nam officiis
                porro, quae, quisquam quos reprehenderit velit? Natus, totam.
              </Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Features
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>Chronograph</ListItem>
                  <ListItem>Master Chronometer Certified</ListItem>{' '}
                  <ListItem>Tachymeter</ListItem>
                </List>
                <List spacing={2}>
                  <ListItem>Anti‑magnetic</ListItem>
                  <ListItem>Chronometer</ListItem>
                  <ListItem>Small seconds</ListItem>
                </List>
              </SimpleGrid>
            </Box>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Product Details
              </Text>

              <List spacing={2}>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Between lugs:
                  </Text>{' '}
                  20 mm
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Bracelet:
                  </Text>{' '}
                  leather strap
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Case:
                  </Text>{' '}
                  Steel
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Case diameter:
                  </Text>{' '}
                  42 mm
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Dial color:
                  </Text>{' '}
                  Black
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Crystal:
                  </Text>{' '}
                  Domed, scratch‑resistant sapphire crystal with anti‑reflective treatment
                  inside
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Water resistance:
                  </Text>{' '}
                  5 bar (50 metres / 167 feet){' '}
                </ListItem>
              </List>
            </Box>
          </Stack>

          {
  !req && (!book?.requester || book?.requester._id !== user?._id) ? (
    <Button
      rounded={'none'}
      w={'full'}
      mt={8}
      size={'lg'}
      onClick={requestBook}
      type='button'
      py={'7'}
      textTransform={'uppercase'}
      _hover={{
        transform: 'translateY(2px)',
        boxShadow: 'lg',
      }}>
      Request
    </Button>
  ) : (
    <Flex flexDir={'column'}>
      <Button
      rounded={'none'}
      w={'full'}
      mt={8}
      size={'lg'}
      onClick={requestBook}
      type='button'
      py={'7'}
      textTransform={'uppercase'}
      _hover={{
        transform: 'translateY(2px)',
        boxShadow: 'lg',
      }}>
      Cancel Request
    </Button>
    <Text my={3} fontSize={'23px'} color={'teal'}>Your request has been sent for this book, wait for the owner to accept</Text>
    </Flex>
  )
}

            
          <Stack direction="row" alignItems="center" justifyContent={'center'}>
            <HStack>
            <FaIdCardAlt />
            <Text>2-3 business days delivery</Text>
            </HStack>
            <Text>Owner Name : {book?.owner.username}</Text>
            <Text>Owner Email : {book?.owner.email}</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
      <ChatButton owner={book?.owner}/>
    </Container>
  )
}

export default SinglePage