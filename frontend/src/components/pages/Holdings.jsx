// App/pages/Holdings.jsx
import React, { useContext, useEffect, useState } from "react";
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
  Spinner,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import CountdownTimer from "./CountdownTimer";
import Loader from "../CustomLoader/Loading";

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, fine } = useContext(UserContext);
  const toast = useToast();
  const [disableReturn, setDisableReturn] = useState({});

  useEffect(() => {
    const getHoldings = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          "https://bookswaphub-ejar.onrender.com/api/books/holdings",
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
      const resp = await axios.post(
        `https://bookswaphub-ejar.onrender.com/api/books/return/${id}`,
        {
          withCredentials: true,
        }
      );
      toast({
        title: resp.data.message,
        status: "success",
        duration: 2000,
      });
      setHoldings((prev) => prev.filter((b) => b._id !== id));
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

  const handleTimerEnd = (bookId) => {
    setDisableReturn((prev) => ({ ...prev, [bookId]: true }));
  };

  if (!user) return null;

  if (loading) {
    return <Loader />;
  }

  return (
    <Flex flexDir={"column"} alignItems={"center"} gap={5}>
      <Text fontWeight={"600"} fontSize={"xl"}>
        My Holdings
      </Text>

      {!loading && holdings.length === 0 ? (
        <Text textAlign="center" color="gray.500" maxW="850px">
          You are not holding any books right now.
        </Text>
      ) : (
        holdings.map((book) => (
          <Card
            key={book._id}
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
              src={book.frontPage}
              alt="Book Cover"
            />

            <Stack spacing={2} flex={1} p={4}>
              <CardBody>
                <Heading size="md">{book?.title}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {book?.author}
                </Text>
              </CardBody>

              <HStack spacing={4} px={4}>
                <Text fontSize="sm">
                  Approved by: <b>{book?.owner?.username}</b>
                </Text>
              </HStack>

              <HStack spacing={4} px={4} flexWrap="wrap">
                <Text fontSize="sm">
                  Category: <b>{book?.category.join(", ")}</b>
                </Text>
                <Text fontSize="sm">
                  Edition: <b>{book?.edition}</b>
                </Text>
                <Text fontSize="sm">
                  ISBN: <b>{book?.isbn}</b>
                </Text>
              </HStack>

              <CardFooter justifyContent="space-between" alignItems="center">
                <Button
                  type="button"
                  colorScheme="twitter"
                  onClick={() => returnBook(book._id)}
                  isDisabled={disableReturn[book._id] || fine === true}
                >
                  Return Book
                </Button>
                <CountdownTimer
                  bookId={book._id}
                  book={book}
                  initialDurationInSeconds={691200} // 8 days
                  onTimerEnd={() => handleTimerEnd(book._id)}
                />
              </CardFooter>
            </Stack>
          </Card>
        ))
      )}
    </Flex>
  );
};

export default Holdings;
