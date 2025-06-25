import React, { useContext, useRef, useState } from "react";
import {
  FormControl,
  Input,
  Button,
  Box,
  useToast,
  VStack,
  Select,
  Text,
  HStack,
  FormHelperText,
  FormLabel,
  Flex,
  Image,
  Heading,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { uploadImage } from "../../util/uploadImage";
import { v4 as uuid} from "uuid";

axios.defaults.withCredentials = true;

const CreateBook = () => {
  const { user } = useContext(UserContext);
  const [uid, _] = useState(uuid());
  const toast = useToast();

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    isbn: "",
    edition: "",
    frontPage: null,
    backPage: null,
    categories: [""],
  });

  const [loading, setLoading] = useState(false);

  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleAddCategory = () => {
    setBookData((prev) => ({
      ...prev,
      categories: [...prev.categories, ""],
    }));
  };

  const handleCategoryChange = (value) => {
    setBookData((prev) => {
      const updatedCategories = prev?.categories?.map((cat) =>
        cat === "" ? value : cat
      );
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleClickFront = () => frontInputRef.current.click();
  const handleClickBack = () => backInputRef.current.click();

  const onFileChange = (e, type) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "front") {
        setBookData((prev) => ({ ...prev, frontPage: file }));
        setFrontPreview(reader.result);
      } else {
        setBookData((prev) => ({ ...prev, backPage: file }));
        setBackPreview(reader.result);
      }
    };
    if (file) reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const frontUrl = await uploadImage(
        bookData.frontPage,
        `bookImages/${uid}/front`
      );
      const backUrl = await uploadImage(
        bookData.backPage,
        `bookImages/${uid}/back`
      );

      const payload = {
        ...bookData,
        frontPage: frontUrl,
        backPage: backUrl,
      };

      const resp = await axios.post('http://localhost:8080/api/books/create', payload);

      toast({
        title: "Book created successfully!",
        description: "Your book is now available for swapping.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setBookData({ title: "", author: "", isbn: "", edition: "", frontPage: null, backPage: null, categories: [""] });
      setFrontPreview("");
      setBackPreview("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if(loading) return <Text>Loading...</Text>;

  return (
    <Box w="full" maxW="6xl" mx="auto" px={6} py={8}>
      <Heading textAlign="center" mb={6}>
        📚 Create a Book for Swapping
      </Heading>

      <form onSubmit={handleSubmit}>
        <Wrap spacing={6}>
          <WrapItem flex="1">
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={bookData.title}
                onChange={(e) =>
                  setBookData({ ...bookData, title: e.target.value })
                }
              />
              <FormHelperText>Ensure the book title is correct.</FormHelperText>
            </FormControl>
          </WrapItem>

          <WrapItem flex="1">
            <FormControl>
              <FormLabel>Author</FormLabel>
              <Input
                value={bookData.author}
                onChange={(e) =>
                  setBookData({ ...bookData, author: e.target.value })
                }
              />
              <FormHelperText>Provide the accurate author name.</FormHelperText>
            </FormControl>
          </WrapItem>

          <WrapItem flex="1">
            <FormControl>
              <FormLabel>Edition</FormLabel>
              <Input
                value={bookData.edition}
                onChange={(e) =>
                  setBookData({ ...bookData, edition: e.target.value })
                }
              />
              <FormHelperText>Eg: First, Second, Revised, etc.</FormHelperText>
            </FormControl>
          </WrapItem>

          <WrapItem flex="1">
            <FormControl>
              <FormLabel>ISBN</FormLabel>
              <Input
                type="number"
                value={bookData.isbn}
                onChange={(e) =>
                  setBookData({ ...bookData, isbn: e.target.value })
                }
              />
              <FormHelperText>Enter the book's ISBN number.</FormHelperText>
            </FormControl>
          </WrapItem>
        </Wrap>

        <Box my={6}>
          <FormLabel>Categories</FormLabel>
          <VStack spacing={3} align="stretch">
            {bookData.categories.map((cat, i) => (
              <Select
                key={i}
                placeholder="Select Category"
                value={cat}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {[
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
                ].map((opt) => (
                  <option disabled={bookData.categories?.includes(opt)} key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            ))}
            <Button onClick={handleAddCategory} colorScheme="teal" size="sm">
              + Add Category
            </Button>
          </VStack>
        </Box>

        <HStack spacing={10} my={6} flexWrap="wrap">
          <FormControl>
            <FormLabel>Front Page</FormLabel>
            <Box
              w="150px"
              h="200px"
              bg="gray.200"
              rounded="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              boxShadow="md"
              onClick={handleClickFront}
            >
              {frontPreview ? (
                <Image
                  src={frontPreview}
                  alt="Front"
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              ) : (
                <FaCloudUploadAlt size={30} />
              )}
            </Box>
            <Input
              hidden
              ref={frontInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, "front")}
            />
            <FormHelperText>Upload a clear front page.</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Back Page</FormLabel>
            <Box
              w="150px"
              h="200px"
              bg="gray.200"
              rounded="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              boxShadow="md"
              onClick={handleClickBack}
            >
              {backPreview ? (
                <Image
                  src={backPreview}
                  alt="Back"
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              ) : (
                <FaCloudUploadAlt size={30} />
              )}
            </Box>
            <Input
              hidden
              ref={backInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, "back")}
            />
            <FormHelperText>Upload a clear back page.</FormHelperText>
          </FormControl>
        </HStack>

        <Flex justify="center" mt={10}>
          <Button type="submit" colorScheme="teal" size="lg">
            Submit Book
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default CreateBook;
