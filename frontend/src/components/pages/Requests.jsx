// App/pages/Requests.jsx
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import {
  Flex,
  HStack,
  Text,
  Card,
  Heading,
  Stack,
  Image,
  useToast,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Box,
} from "@chakra-ui/react";
import Loader from "../CustomLoader/Loading";

const Requests = () => {
  const { user } = useContext(UserContext);
  const [req, setReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          `http://localhost:8080/api/books/view/requests`,
          {
            withCredentials: true,
          }
        );
        setReq(resp.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    fetchRequests();
  }, []);

  const handleRequest = async (id, type) => {
    const url =
      type === "approve"
        ? `http://localhost:8080/api/books/approve/${id}`
        : `http://localhost:8080/api/books/reject/${id}`;

    try {
      const resp = await axios.put(url, { withCredentials: true });
      toast({
        title: resp.data.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setReq((prev) => prev.filter((b) => b._id !== id));
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
  if (loading) return <Loader />;
  return (
    <Flex flexDir={"column"} alignItems={"center"} gap={5}>
      <Text fontWeight={"600"} fontSize={"xl"}>
        Book Swap Requests
      </Text>

      {!loading && req.length === 0 ? (
        <Text textAlign="center" color="gray.500" maxW="850px">
          No Requests Found
        </Text>
      ) : (
        !loading &&
        req.map((i) => (
          <Card
            key={i._id}
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
              src={i?.frontPage}
              alt="Book Cover"
            />

            <Stack spacing={2} flex={1} p={4}>
              <CardBody>
                <Heading size="md">{i?.title}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {i?.author}
                </Text>
              </CardBody>

              <HStack px={4}>
                <Text fontSize="sm">Requester:</Text>
                <Text as="b">{i?.requester?.username}</Text>
              </HStack>

              <HStack px={4} flexWrap="wrap">
                <Text fontSize="sm">Category:</Text>
                <Text as="b">{i?.category.join(", ")}</Text>
              </HStack>

              <CardFooter display="flex" gap={4}>
                <Button
                  onClick={() => handleRequest(i._id, "approve")}
                  colorScheme="blue"
                >
                  Approve {i?.requester?.username}
                </Button>
                <Button
                  onClick={() => handleRequest(i._id, "reject")}
                  colorScheme="red"
                >
                  Reject {i?.requester?.username}
                </Button>
              </CardFooter>
            </Stack>
          </Card>
        ))
      )}
    </Flex>
  );
};

export default Requests;
