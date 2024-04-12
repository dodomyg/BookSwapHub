import React, { useContext, useState } from 'react';
import {
  FormControl,
  Input,
  Button,
  Box,
  useToast,
  VStack,
  Select,
} from '@chakra-ui/react';
import { UserContext } from '../../context/UserContext';
import axios from "axios";
axios.defaults.withCredentials = true;

const CreateBook = () => {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState(['Select Category']);
  const [title,setTiltle] = useState("");
  const [author,setAuthor] = useState("");
  const [isbn,setIsbn] = useState("");
  const [frontPage,setFrontPage] = useState("");
  const [backPage,setBackPage] = useState("");
  const [edition,setEdition] = useState("");
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
    if (type === 'front') {
      setFrontPage(file);
    } else if (type === 'back') {
      setBackPage(file);
    }
  };

  const handleSubmit = async(e) => {
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
      const resp =await axios.post(`http://localhost:8080/api/books/create`,formData,{withCredentials:true},{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })
      toast({
        title: resp.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

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

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={"100%"}
      height="100vh"
    >
      <Box p={4} maxW="md" borderWidth="1px" borderRadius="lg">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <VStack spacing={4}>
            <FormControl>
              <Input value={title} onChange={(e) => setTiltle(e.target.value)} type="text" placeholder="Enter Book Name" />
            </FormControl>
            <FormControl>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} type="text" placeholder="Author" />
            </FormControl>
            {categories.map((category, index) => (
              <FormControl key={index}>
                <Select
                  placeholder="Select Category"
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                >
                  {['Fiction', 'Adventure', 'Non-Fiction', 'Education', 'Mystery', 'Fantasy', 'Drama', 'Romance', 'Thriller', 'Kids', 'Other'].map((categoryOption) => (
                    <option key={categoryOption} value={categoryOption}>{categoryOption}</option>
                  ))}
                </Select>
              </FormControl>
            ))}
            <Button colorScheme="teal" onClick={handleAddCategory}>
              Add Category
            </Button>
            <FormControl>
              <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} type="number" placeholder="ISBN" />
            </FormControl>
            <FormControl>
              <Input value={edition} onChange={(e) => setEdition(e.target.value)} type="text" placeholder="Edition" />
            </FormControl>
            <FormControl>
              <h1>Front Page</h1>
              <Input accept="image/*" onChange={(e) => onFileChange(e, 'front')} type="file" />
            </FormControl>
            <FormControl>
              <h1>Back Page</h1>
              <Input accept="image/*" onChange={(e) => onFileChange(e, 'back')} type="file" />
            </FormControl>
            <Button colorScheme="teal" type="submit">
              Submit
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CreateBook;
