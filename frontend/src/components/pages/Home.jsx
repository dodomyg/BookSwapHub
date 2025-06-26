import React, { useContext, useEffect, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Input,
  Select,
  Stack,
  Heading,
  Divider,
  Spinner,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { UserContext } from "../../context/UserContext";
import Card from "../Card/Card";
import axios from "axios";
import Loader from "../CustomLoader/Loading";

const Home = () => {
  const { user } = useContext(UserContext);

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [unAvailableBooks, setUnAvailableBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Fiction",
    "Adventure",
    "Non-Fiction",
    "Education",
    "Mystery",
    "Fantasy",
    "Drama",
    "Romance",
    "Thriller",
    "Kids",
    "Other",
  ];

  const filteredBooks = books?.filter((b) => {
    return (
      b?.title?.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || b?.category?.includes(category))
    );
  });

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/api/books/allBooks",
          {
            withCredentials: true,
          }
        );
        setBooks(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnavailableBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/books/notAvailable",
          {
            withCredentials: true,
          }
        );
        setUnAvailableBooks(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBooks();
    // fetchUnavailableBooks();
  }, []);

  if (!user) return null;

  if (loading) {
    return <Loader />;
  }

  return (
    <Flex direction={{ base: "column", md: "row" }} px={6} py={8} gap={8}>
      {/* Sidebar */}
      <Box
        minW={{ base: "100%", md: "250px" }}
        borderWidth="1px"
        borderRadius="lg"
        p={5}
        bg="white"
        boxShadow="md"
        h="fit-content"
      >
        <Heading size="md" mb={4}>
          Filter Books
        </Heading>
        <Stack spacing={4}>
          <Box>
            <Text fontWeight="medium" mb={1}>
              Search Title
            </Text>
            <Input
              placeholder="e.g. Harry Potter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Box>
            <Text fontWeight="medium" mb={1}>
              Category
            </Text>
            <Select
              placeholder="All Categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </Box>
        </Stack>
      </Box>

      {/* Book Display */}
      <Box flex="1">
        <Heading size="lg" mb={4}>
          Available Books
        </Heading>
        <Divider mb={4} />

        {loading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="teal.500" />
          </Flex>
        ) : filteredBooks?.length === 0 ? (
          <Text textAlign="center" color="gray.500" fontSize="lg">
            No books found. Try a different title or category.
          </Text>
        ) : (
          <Flex wrap="wrap" gap={6}>
            {filteredBooks.map((book) => (
              <Card
                key={book._id}
                id={book._id}
                title={book.title}
                author={book.author}
                edition={book.edition}
                frontPage={book.frontPage}
                owner={book.owner?.username}
              />
            ))}
          </Flex>
        )}

        {/* Unavailable Books */}
        {unAvailableBooks?.length > 0 && (
          <>
            <Heading size="md" mt={10} mb={3} color="gray.600">
              Currently Unavailable Books
            </Heading>
            <Flex wrap="wrap" gap={6}>
              {unAvailableBooks.map((book) => (
                <Box position="relative" key={book._id}>
                  <Card
                    id={book._id}
                    title={book.title}
                    author={book.author}
                    edition={book.edition}
                    frontPage={book.frontPage}
                    owner={book.owner?.username}
                  />
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.6)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                  >
                    <Text color="white" fontWeight="bold">
                      Not Available
                    </Text>
                  </Box>
                </Box>
              ))}
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Home;
