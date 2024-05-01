import {
  Card,
  CardBody,
  Heading,
  Text,
  Stack,
  Image,
  Button,
  CardFooter,
  HStack,
  useToast,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import CountdownTimer from './CountdownTimer';

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user,fine } = useContext(UserContext);
  const toast = useToast();
  const [disableReturn, setDisableReturn] = useState({});

  useEffect(() => {
    const getHoldings = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          'http://localhost:8080/api/books/my/holdings',
          { withCredentials: true }
        );
        setHoldings(resp.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    getHoldings();
  }, []);

  const returnBook = async (id) => {
    try {
      const resp = await axios.post(`http://localhost:8080/api/books/return/${id}`, {
        withCredentials: true,
      });
      toast({
        title: resp.data.message,
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
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

  const handleTimerEnd = (bookId) => {
    setDisableReturn((prev) => ({ ...prev, [bookId]: true }));
  };

  if (!user) return null;
  if (loading) return <h1>Loading...</h1>;

  return (
    <Flex flexDir={'column'} alignItems={'center'} gap={5}>
      <Text fontWeight={'600'} fontSize={'21px'}>
        My Holdings
      </Text>
      {!loading && holdings.length === 0 ? (
        <h1 style={{ width: '850px', textAlign: 'center' }}>You are not holding any books right now</h1>
      ) : (
        holdings.map((book) => (
          <Card
            key={book._id}
            width={{ base: '100%', sm: '850px' }}
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
          >
            <Image
              objectFit='cover'
              maxW={{ base: '100%', sm: '130px' }}
              src={book.frontPage}
              alt='Book Cover'
            />
            <Stack>
            <CardBody>
                  <Heading size='md'>{book?.title}</Heading>
                  <Text py='1'>{book?.author}</Text>
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
              
              <CardFooter display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Button
                  type='button'
                  colorScheme='twitter'
                  onClick={() => returnBook(book._id)}
                  isDisabled={disableReturn[book._id] || fine===true} // Check if the book's return is disabled
                >
                  Return Book
                </Button>
                <HStack>
                <CountdownTimer
                  bookId={book._id}
                  book={book}
                  initialDurationInSeconds={691200} // 8 days in seconds
                  onTimerEnd={() => handleTimerEnd(book._id)}
                />
                </HStack>
              </CardFooter>
            </Stack>
          </Card>
        ))
      )}
    </Flex>
  );
};

export default Holdings;
