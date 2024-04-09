import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import Card from '../Card/Card';
import {Flex,Box,Image,Text,Input, IconButton,InputGroup,InputRightElement} from "@chakra-ui/react"
import axios from "axios"
import { CiSearch } from "react-icons/ci";


const Home = () => {

  const {user}=useContext(UserContext)
  const [books ,setBooks]=useState([])
  const [loading , setLoading]=useState(false)
  const [search,setSearch]=useState("")
  const fetchBooks = async ()=>{
    try {
      setLoading(true)
        const resp = await axios.get(`http://localhost:8080/api/books/allBooks?search=${search}`,{withCredentials:true})
        // console.log(resp.data);
        setBooks(resp.data)
        setLoading(false)
        setSearch("")
    } catch (error) {
      console.log(error);
    }
}


  
  useEffect(()=>{
    
      
    //   const fetchBooks = async ()=>{
    //     try {
    //       setLoading(true)
    //         const resp = await axios.get(`http://localhost:8080/api/books/allBooks?search=${search}`,{withCredentials:true})
    //         // console.log(resp.data);
    //         setBooks(resp.data)
    //         setLoading(false)
    //     } catch (error) {
    //       console.log(error);
    //     }
    // }

  
    // } catch (error) {
    //   console.log(error);
    // }
    fetchBooks()
  },[])

  

  if(!user){
    return;
  }
  if(loading){
    return <h1>Loading...</h1>
  }
  return (
    <div>
      <Box mb={10} position="relative">
        <Image
          src="https://source.unsplash.com/1600x900/?books"
          objectFit="cover"
          alt="banner"
          width="100%"
          height="72vh"
          filter={"brightness(50%)"}
        />
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" textAlign="center">
          <Text color="white" fontSize="2xl" fontWeight="bold" mb={4}>
            Welcome to BookSwapHub
          </Text>
          <form onSubmit={fetchBooks} style={{ display: 'flex', alignItems: 'center' }}>
          <InputGroup size="lg" width="300px">
  <Input
    placeholder="Search books"
    bg="white"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    borderRadius="full"
    boxShadow="md"
    _focus={{ outline: 'none' }}
  />
  <InputRightElement width="3.5rem">
  
      <IconButton
  isRound={true}
  variant='solid'
  colorScheme='pink'
  type='submit'
  aria-label='Done'
  fontSize='20px'
  icon={<CiSearch/> }
/>
  </InputRightElement>
</InputGroup>
</form>
        </Box>
      </Box>
      <Text my={2} textAlign={"center"} fontSize={'25px'}>All Available Books</Text>
      {books.length===0 && <Text textAlign={"center"} my={4}  fontSize={'25px'} color={"gray.400"}>No Books Found , try searching by Book title or author</Text>}
      <Flex mx={10} flexDir={"row"} flexWrap={"wrap"} alignItems={'start'}justifyContent={'flex-start'}  gap={4}>
          { 
          !loading && books.map((book)=>{
            return <Card key={book._id} title={book.title} author={book.author} id={book._id} frontPage={book.frontPage} edition={book.edition}/>
          })}
      </Flex>


    </div>
  )
}

export default Home