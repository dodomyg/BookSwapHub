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
} from '@chakra-ui/react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';
axios.defaults.withCredentials = true;

const CreateBook = () => {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState(['Select Category']);
  const [title, setTiltle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const [frontPage, setFrontPage] = useState('');
  const [backPage, setBackPage] = useState('');
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');
  const [edition, setEdition] = useState('');
  const toast = useToast();

  const handleAddCategory = () => {
    setCategories([...categories, '']);
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

  const onFileChange = (e, type) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') {
        setFrontPage(file);
        setFrontPreview(reader.result);
      } else if (type === 'back') {
        setBackPage(file);
        setBackPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
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
      console.log(formData);
      const resp = await axios.post(
        `http://localhost:8080/api/books/create`,
        formData,
        { withCredentials: true },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
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
      if (error.response) {
        toast({
          title: error.response.data.error || 'Server error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (error.request) {
        toast({
          title: 'Network error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Unexpected error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (!user) {
    return null;
  }

  const handleClickFront = () => {
    frontInputRef.current.click();
  };

  const handleClickBack = () => {
    backInputRef.current.click();
  };

  return (
    <Box width={'100%'}>
      <Box display={'flex'} justifyContent={'center'} mt={10}>
        <Text fontSize={'24px'} fontWeight={600}>
          Create a book for swapping
        </Text>
      </Box>
      <Box mx={4} my={7}>
        <form onSubmit={handleSubmit}>
          <HStack gap={4} justifyContent={'space-between'}>
            <div style={{ width: '48%' }}>
              <FormControl>
                <FormLabel>Book Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTiltle(e.target.value)}
                  type="text"
                />
                <FormHelperText>
                  Book title should be correct , double check before entering
                  the title
                </FormHelperText>
              </FormControl>
            </div>
            <div style={{ width: '48%' }}>
              <FormControl>
                <FormLabel>Book Author</FormLabel>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  type="text"
                />
                <FormHelperText>Book author should be accurate</FormHelperText>
              </FormControl>
            </div>
          </HStack>
          <HStack gap={4} justifyContent={'space-between'}>
            <div style={{ marginTop: '20px', width: '48%' }}>
              <FormControl>
                <FormLabel>Edition</FormLabel>
                <Input
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  type="text"
                />
                <FormHelperText>
                  Enter the edition of the book, such as first edition, second
                  edition, etc.
                </FormHelperText>
              </FormControl>
            </div>
            <div style={{ marginTop: '20px', width: '48%' }}>
              <FormControl>
                <FormLabel>ISBN number</FormLabel>
                <Input
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  type="number"
                />
                <FormHelperText>Enter correct ISBN number</FormHelperText>
              </FormControl>
            </div>
          </HStack>
          <HStack gap={20}>
            <div style={{ marginTop: '20px' }}>
              <FormLabel>Form Category</FormLabel>
              {categories.map((category, index) => (
                <FormControl key={index}>
                  <Select
                    placeholder="Select Category"
                    my={5}
                    value={category}
                    onChange={(e) =>
                      handleCategoryChange(index, e.target.value)
                    }>
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
                    ].map((categoryOption) => (
                      <option
                        key={categoryOption}
                        value={categoryOption}>{categoryOption}</option>
                    ))}
                  </Select>
                </FormControl>
              ))}
              <Button colorScheme="teal" onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>
          </HStack>
          <HStack my={4}>
            <FormControl>
              <h1>Front Page</h1>
              <Box
                boxShadow={'lg'}
                my={3}
                bgColor={'gray.200'}
                rounded={'md'}
                height={'100px'}
                width={'150px'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                cursor={'pointer'}
                onClick={handleClickFront}>
                {frontPreview ? (
                  <img
                    src={frontPreview}
                    alt="Front Page Preview"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <FaCloudUploadAlt size={34} />
                )}
              </Box>
              <Input
                hidden
                ref={frontInputRef}
                width={'60%'}
                accept="image/*"
                onChange={(e) => onFileChange(e, 'front')}
                type="file"
              />
              <FormHelperText>
                Upload front page, clear frontpage
              </FormHelperText>
            </FormControl>
            <FormControl>
              <h1>Back Page</h1>
              <Box
                boxShadow={'lg'}
                my={3}
                bgColor={'gray.200'}
                rounded={'md'}
                height={'100px'}
                width={'150px'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                cursor={'pointer'}
                onClick={handleClickBack}>
                {backPreview ? (
                  <img
                    src={backPreview}
                    alt="Back Page Preview"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <FaCloudUploadAlt size={34} />
                )}
              </Box>
              <Input
                hidden
                ref={backInputRef}
                width={'60%'}
                accept="image/*"
                onChange={(e) => onFileChange(e, 'back')}
                type="file"
              />
              <FormHelperText>
                Upload back page, clear back page
              </FormHelperText>
            </FormControl>
          </HStack>
          <Flex mt={10} justifyContent={'center'} alignItems={'center'}>
            <Button colorScheme="teal" type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default CreateBook;
