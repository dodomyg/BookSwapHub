import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@chakra-ui/react";
import axios from "axios";
import { FaIdCardAlt } from "react-icons/fa";
import ChatButton from "../ChatButton/ChatButton";
import { UserContext } from "../../context/UserContext";

const SinglePage = () => {
  const { bookId } = useParams();
  const { user } = useContext(UserContext);
  const toast = useToast();

  const [book, setBook] = useState(null);
  const [req, setReq] = useState(false);

  useEffect(() => {
    const fetchSingleBook = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/books/${bookId}`,
          {
            withCredentials: true,
          }
        );
        setBook(data);
        setReq(data?.requester?._id === user?._id);
      } catch (error) {
        console.error(error);
      }
    };

    if (bookId && user) fetchSingleBook();
  }, [bookId, user]);

  const requestBook = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:8080/api/books/request/${bookId}`,
        {},
        { withCredentials: true }
      );
      setReq(!req);
      toast({
        title: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!book)
    return (
      <Text textAlign="center" mt={10}>
        Loading Book...
      </Text>
    );

  return (
    <Container maxW="7xl" py={{ base: 8, md: 14 }}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        <VStack spacing={6} align="center">
          <Image
            src={book?.frontPage}
            alt="Front Page"
            rounded="md"
            w="100%"
            maxW="350px"
            objectFit="cover"
            boxShadow="md"
          />
          <Image
            src={book?.backPage}
            alt="Back Page"
            rounded="md"
            w="100%"
            maxW="350px"
            objectFit="cover"
            boxShadow="md"
          />
        </VStack>

        <Stack spacing={6}>
          <Box>
            <Heading fontSize={{ base: "2xl", md: "4xl" }}>
              {book?.title}
            </Heading>
            <Text fontSize="xl" color="gray.600" mt={2}>
              by {book?.author}
            </Text>
          </Box>

          <Stack spacing={4} divider={<StackDivider borderColor="gray.200" />}>
            <VStack align="start" spacing={2}>
              <Text fontWeight="semibold">Edition: {book?.edition}</Text>
              <Text fontWeight="semibold">ISBN: {book?.isbn}</Text>
              <Text fontWeight="semibold">
                Categories: {book?.category.join(", ")}
              </Text>
              <Text>
                <b>Availability:</b>{" "}
                {book?.isAvailable
                  ? "Available for swapping"
                  : "Currently held"}
              </Text>
            </VStack>

            <Box>
              <Text
                fontSize="md"
                fontWeight="semibold"
                color="yellow.500"
                mb={2}
              >
                Owner Info
              </Text>
              <Text>Name: {book?.owner?.username}</Text>
              <Text>Email: {book?.owner?.email}</Text>
            </Box>
          </Stack>

          {user && (
            <Box>
              {!req ? (
                <Button
                  colorScheme="teal"
                  size="lg"
                  onClick={requestBook}
                  w="full"
                  mt={4}
                >
                  Request This Book
                </Button>
              ) : (
                <VStack spacing={3} align="stretch">
                  <Button
                    colorScheme="red"
                    size="lg"
                    onClick={requestBook}
                    w="full"
                    mt={4}
                  >
                    Cancel Request
                  </Button>
                  <Text color="teal.500" fontWeight="medium" textAlign="center">
                    You have already requested this book. Await approval.
                  </Text>
                </VStack>
              )}
            </Box>
          )}

          <HStack mt={6} justify="space-between" spacing={4}>
            <HStack>
              <FaIdCardAlt />
              <Text fontSize="sm">2-3 business days delivery</Text>
            </HStack>
            <ChatButton owner={book?.owner} />
          </HStack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default SinglePage;
