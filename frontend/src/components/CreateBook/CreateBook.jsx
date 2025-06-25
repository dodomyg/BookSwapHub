import React, { useContext, useRef, useState } from 'react';
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
} from '@chakra-ui/react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';

axios.defaults.withCredentials = true;

const CreateBook = () => {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState(['']);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [edition, setEdition] = useState('');
  const [frontPage, setFrontPage] = useState('');
  const [backPage, setBackPage] = useState('');
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');

  const toast = useToast();
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleAddCategory = () => {
    setCategories([...categories, '']);
  };

  const handleCategoryChange = (index, value) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
  };

  const handleClickFront = () => frontInputRef.current.click();
  const handleClickBack = () => backInputRef.current.click();

  const onFileChange = (e, type) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') {
        setFrontPage(file);
        setFrontPreview(reader.result);
      } else {
        setBackPage(file);
        setBackPreview(reader.result);
      }
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('isbn', isbn);
      formData.append('category', categories);
      formData.append('edition', edition);
      formData.append('frontPage', frontPage);
      formData.append('backPage', backPage);

      const resp = await axios.post(
        'http://localhost:8080/api/books/create',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      toast({
        title: resp.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data?.error || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!user) return null;

  return (
    <Box w="full" maxW="6xl" mx="auto" px={6} py={8}>
      <Heading textAlign="center" mb={6}>
        📚 Create a Book for Swapping
      </Heading>

      <form onSubmit={handleSubmit}>
        <Wrap spacing={6}>
          <WrapItem flex="1">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <FormHelperText>Ensure the book title is correct.</FormHelperText>
            </FormControl>
          </WrapItem>

          <WrapItem flex="1">
            <FormControl isRequired>
              <FormLabel>Author</FormLabel>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
              <FormHelperText>Provide the accurate author name.</FormHelperText>
            </FormControl>
          </WrapItem>

          <WrapItem flex="1">
            <FormControl>
              <FormLabel>Edition</FormLabel>
              <Input value={edition} onChange={(e) => setEdition(e.target.value)} />
              <FormHelperText>Eg: First, Second, Revised, etc.</FormHelperText>
            </FormControl>
          </WrapItem>

          <WrapItem flex="1">
            <FormControl>
              <FormLabel>ISBN</FormLabel>
              <Input
                type="number"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
              <FormHelperText>Enter the book's ISBN number.</FormHelperText>
            </FormControl>
          </WrapItem>
        </Wrap>

        <Box my={6}>
          <FormLabel>Categories</FormLabel>
          <VStack spacing={3} align="stretch">
            {categories.map((cat, i) => (
              <Select
                key={i}
                placeholder="Select Category"
                value={cat}
                onChange={(e) => handleCategoryChange(i, e.target.value)}
              >
                {[
                  'Fiction',
                  'Adventure',
                  'Non-Fiction',
                  'Education',
                  'Mystery',
                  'Fantasy',
                  'Drama',
                  'Romance',
                  'Thriller',
                  'Kids',
                  'Other',
                ].map((opt) => (
                  <option key={opt} value={opt}>
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
          {/* Front Page */}
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
                <Image src={frontPreview} alt="Front" objectFit="cover" w="100%" h="100%" />
              ) : (
                <FaCloudUploadAlt size={30} />
              )}
            </Box>
            <Input
              hidden
              ref={frontInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, 'front')}
            />
            <FormHelperText>Upload a clear front page.</FormHelperText>
          </FormControl>

          {/* Back Page */}
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
                <Image src={backPreview} alt="Back" objectFit="cover" w="100%" h="100%" />
              ) : (
                <FaCloudUploadAlt size={30} />
              )}
            </Box>
            <Input
              hidden
              ref={backInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, 'back')}
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