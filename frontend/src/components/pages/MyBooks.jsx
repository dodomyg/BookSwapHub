// App/pages/MyBooks.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Heading,
  Text,
  Stack,
  Image,
  CardFooter,
  HStack,
  Flex,
  useToast,
  Button,
  Spinner,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
axios.defaults.withCredentials = true;

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const toast = useToast();

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          `http://localhost:8080/api/users/myBooks`,
          {
            withCredentials: true,
          }
        );
        setBooks(resp.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    fetchMyBooks();
  }, []);

  const deleteBook = async (id) => {
    try {
      const resp = await axios.delete(`http://localhost:8080/api/books/${id}`, {
        withCredentials: true,
      });
      toast({
        title: resp.data.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error(error);
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

  if (!user) return null;

  return (
    <Flex flexDir="column" alignItems="center" gap={5}>
      <Text fontWeight="600" fontSize="xl">
        My Books
      </Text>

      {loading ? (
        <Spinner size="lg" />
      ) : books.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          You don’t have any books yet. Add one from the “Create” page!
        </Text>
      ) : (
        books.map((book) => (
          <Card
            key={book?._id}
            width={{ base: "100%", sm: "850px" }}
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            borderRadius="md"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
            _hover={{
              boxShadow: "lg",
              transform: "scale(1.01)",
              transition: "0.2s",
            }}
          >
            <Image
              objectFit="cover"
              maxW={{ base: "100%", sm: "130px" }}
              src={book?.frontPage}
              alt={book?.title}
            />

            <Stack spacing={2} flex={1} p={4}>
              <CardBody>
                <Heading size="md">{book?.title}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {book?.author}
                </Text>

                {book?.holder && (
                  <Box mt={2} fontSize="sm">
                    <Text>
                      Holder: <b>{book?.holder?.username}</b>
                    </Text>
                    <Text>
                      Email: <b>{book?.holder?.email}</b>
                    </Text>
                  </Box>
                )}
              </CardBody>

              <HStack spacing={4} px={4}>
                <Text fontSize="sm">
                  Available: <b>{book?.isAvailable ? "Yes" : "No"}</b>
                </Text>
                <Text fontSize="sm">
                  Edition: <b>{book?.edition}</b>
                </Text>
                <Text fontSize="sm">
                  ISBN: <b>{book?.isbn}</b>
                </Text>
              </HStack>

              <HStack px={4} pb={3} flexWrap="wrap">
                <Text fontSize="sm">
                  Category: <b>{book?.category?.join(", ")}</b>
                </Text>
              </HStack>

              <CardFooter>
                <Button colorScheme="red" onClick={() => deleteBook(book?._id)}>
                  Delete Book
                </Button>
              </CardFooter>
            </Stack>
          </Card>
        ))
      )}
    </Flex>
  );
};

export default MyBooks;
