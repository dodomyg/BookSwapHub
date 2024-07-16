import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Card from "../Card/Card";
import {
  Flex,
  Box,
  Image,
  Text,
  Input,
  IconButton,
  InputGroup,
  InputRightElement,
  Stack,
  HStack,
  Select,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import Banner from "../../Images/Book2.webp";
import { CiSearch } from "react-icons/ci";

const Home = () => {
  const [category, setCategory] = useState("");

  const { user } = useContext(UserContext);
  const [unAv, setUnav] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
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

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const query = [];
      if (search) {
        query.push(`search=${search}`);
      }
      if (category) {
        query.push(`category=${category}`);
      }
      const queryString = query.length > 0 ? `?${query.join("&")}` : "";
      const response = await axios.get(
        `http://localhost:8080/api/books/allBooks${queryString}`,
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

  useEffect(() => {
    const fetchUnavailableBooks = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:8080/api/books/books/notAvailable`,
          { withCredentials: true }
        );
        setUnav(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUnavailableBooks();

    fetchBooks();
  }, []);

  if (!user) {
    return;
  }
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <Box mb={10} position="relative">
        <Image
          src={Banner}
          objectFit="cover"
          alt="banner"
          width="100%"
          height="72vh"
          filter={"brightness(50%)"}
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
        >
          <Text color="white" fontSize="2xl" fontWeight="bold" mb={4}>
            Welcome to BookSwapHub
          </Text>
          <form
            onSubmit={fetchBooks}
            style={{ display: "flex", alignItems: "center" }}
          >
            <InputGroup size="lg" width="300px">
              <Input
                placeholder="Search books"
                bg="white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderRadius="full"
                boxShadow="md"
                _focus={{ outline: "none" }}
              />
              <InputRightElement width="3.5rem">
                <IconButton
                  isRound={true}
                  variant="solid"
                  colorScheme="pink"
                  type="submit"
                  aria-label="Done"
                  fontSize="20px"
                  icon={<CiSearch />}
                />
              </InputRightElement>
            </InputGroup>
          </form>
        </Box>
      </Box>
      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        my={10}
        px={10}
      >
        <Text my={2} textAlign={"center"} fontSize={"25px"}>
          All Available Books
        </Text>
        <HStack>
          <Select
            width={"200px"}
            placeholder="All Books"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Button onClick={fetchBooks}>Filter</Button>
        </HStack>
      </HStack>
      {books.length === 0 && (
        <Text textAlign={"center"} my={4} fontSize={"25px"} color={"gray.400"}>
          No Books Found , try searching by Book title or author
        </Text>
      )}
      <Flex
        mx={10}
        flexDir={"row"}
        flexWrap={"wrap"}
        alignItems={"start"}
        justifyContent={"flex-start"}
        gap={10}
      >
        {!loading &&
          books.map((book) => {
            return (
              <Card
                owner={book?.owner.username}
                key={book?._id}
                title={book?.title}
                author={book?.author}
                id={book._id}
                frontPage={book?.frontPage}
                edition={book?.edition}
              />
            );
          })}
      </Flex>

      <Box mx={1} my={20}>
        {!loading && unAv?.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
            }}
          >
            <Text mx={10} my={3} fontSize={"23px"} color={"gray.600"}>
              Currently Unavailable Books
            </Text>
            <Flex
              mx={10}
              flexDir={"row"}
              flexWrap={"wrap"}
              alignItems={"start"}
              justifyContent={"flex-start"}
              gap={10}
            >
              {unAv.map((book) => (
                <Stack position="relative">
                  <Card
                    owner={book.owner?.username}
                    title={book.title}
                    author={book.author}
                    id={book._id}
                    frontPage={book.frontPage}
                    edition={book.edition}
                  />
                  <Text
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="rgba(130, 0, 0, 0.7)"
                    color="white"
                    fontSize="sm"
                    fontWeight="bold"
                    borderRadius="md"
                  >
                    Not Available
                  </Text>
                </Stack>
              ))}
            </Flex>
          </div>
        )}
      </Box>
    </div>
  );
};

export default Home;