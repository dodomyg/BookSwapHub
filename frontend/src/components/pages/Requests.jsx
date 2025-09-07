import React, { useContext, useEffect, useState } from "react";
import {
  Flex,
  Text,
  Card,
  Heading,
  Stack,
  Image,
  useToast,
  CardBody,
  Button,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import Loader from "../CustomLoader/Loading";

const Requests = () => {
  const { user } = useContext(UserContext);
  const [req, setReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAccordionBookId, setOpenAccordionBookId] = useState(null);
  const [requestList, setRequestList] = useState([]);
  const toast = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(
        `https://bookswaphub-ejar.onrender.com/api/books/view/requests`,
        { withCredentials: true }
      );
      setReq(resp.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequest = async (bookId, userId, type) => {
    const url = `https://bookswaphub-ejar.onrender.com/api/books/approve_reject?bookId=${bookId}&approvee=${userId}&status=${type}`;
    try {
      const resp = await axios.put(url, { withCredentials: true });
      toast({
        title: resp.data.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Remove the book if accepted or no requesters left
      if (
        type === "accept" ||
        resp?.data?.updatedBook?.requester?.length === 0
      ) {
        setReq((prev) => prev.filter((b) => b._id !== bookId));
        setOpenAccordionBookId(null);
        setRequestList([]);
      } else {
        setRequestList(resp?.data?.updatedBook?.requester);
      }
    } catch (error) {
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
  if (loading) return <Loader />;

  return (
    <Flex direction="column" align="center" gap={5}>
      <Heading size="md">Book Swap Requests</Heading>

      {req.length === 0 ? (
        <Text color="gray.500">No Requests Found</Text>
      ) : (
        req.map((book) => (
          <Card
            key={book._id}
            w="100%"
            maxW="700px"
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
          >
            <Box w="110px" h="170px" flexShrink={0}>
              <Image
                objectFit="cover"
                w="100%"
                h="100%"
                src={book.frontPage}
                alt="Book Cover"
                borderRadius="md"
              />
            </Box>

            <Stack spacing={2} flex={1} p={3}>
              <CardBody pb={0}>
                <Heading size="sm">{book.title}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {book.author}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {book.category.join(", ")}
                </Text>
              </CardBody>

              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton
                    px={0}
                    onClick={() => {
                      if (openAccordionBookId === book._id) {
                        setOpenAccordionBookId(null);
                        setRequestList([]);
                      } else {
                        setOpenAccordionBookId(book._id);
                        setRequestList(book.requester || []);
                      }
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      <Text fontSize="sm" fontWeight="medium">
                        {book.requester?.length} Requesters
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>

                  {openAccordionBookId === book._id && (
                    <AccordionPanel px={0} pb={2}>
                      <VStack align="start" spacing={4}>
                        {requestList.map((r) => (
                          <Box
                            key={r._id}
                            p={2}
                            borderWidth="1px"
                            w="100%"
                            borderRadius="md"
                          >
                            <Text fontWeight="semibold">{r.username}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {r.email}
                            </Text>
                            <HStack mt={2}>
                              <Button
                                size="sm"
                                colorScheme="green"
                                onClick={() =>
                                  window.confirm(`Approve ${r.username}?`) &&
                                  handleRequest(book._id, r._id, "approve")
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() =>
                                  window.confirm(`Reject ${r.username}?`) &&
                                  handleRequest(book._id, r._id, "reject")
                                }
                              >
                                Reject
                              </Button>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    </AccordionPanel>
                  )}
                </AccordionItem>
              </Accordion>
            </Stack>
          </Card>
        ))
      )}
    </Flex>
  );
};

export default Requests;