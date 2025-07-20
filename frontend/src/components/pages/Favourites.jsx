import {
  Box,
  Heading,
  Text,
  VStack,
  Image,
  SimpleGrid,
  Container,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Loader from "../CustomLoader/Loading";
import { Link } from "react-router-dom";

const Favourites = () => {
  const { user } = useContext(UserContext);
  const [favBooks, setFavBooks] = useState([]);

  useEffect(() => {
    setFavBooks(user?.favBooks || []);
  }, [user]);

  //   if (loading) return <Loader />;

  if (favBooks.length === 0) {
    return (
      <Container maxW="container.md" py={10}>
        <Heading size="lg" textAlign="center">
          You have no favorite books...
        </Heading>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={10}>
      <Heading mb={6}>Your Favorite Books</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
        {favBooks.map((book) => (
          <Link key={book._id} to={`/books/${book._id}`}>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              shadow="md"
              _hover={{ shadow: "lg", transform: "scale(1.02)" }}
              transition="all 0.2s"
            >
              <Image
                src={book.frontPage || "https://via.placeholder.com/150"}
                alt={book.title}
                objectFit="cover"
                w="100%"
                h="250px"
              />
              <Box p={4}>
                <VStack align="start" spacing={1}>
                  <Heading size="md">{book.title}</Heading>
                  <Text fontSize="sm" color="gray.600">
                    by {book.author}
                  </Text>
                  <HStack spacing={2} fontSize="sm">
                    <Text fontWeight="semibold">Edition:</Text>
                    <Text>{book.edition}</Text>
                  </HStack>
                  <HStack spacing={2} fontSize="sm">
                    <Text fontWeight="semibold">ISBN:</Text>
                    <Text>{book.isbn}</Text>
                  </HStack>
                  <Text fontSize="sm">
                    Categories: {book.category?.join(", ")}
                  </Text>
                </VStack>
              </Box>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Favourites;
