import {
    Box,
    Center,
    Heading,
    Text,
    Stack,
    Image,
    Avatar,
    useColorModeValue,
  } from '@chakra-ui/react'

  import React from 'react'
import { Link } from 'react-router-dom'

  
  const Card = ({title,author,frontPage,id,edition,owner}) => {
    return (
        <Link to={`/book/${id}`}>
          <Center  mt={6}>
          <Box
        maxW={"320px"}
          // w={'full'}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'lg'}
        
          overflow={'hidden'}>

            <Image
              w={'full'}
              height={'60%'}
              src={frontPage}
              fill
              alt={title}
            />
          <Stack p={6}>
            <Text
              color={'green.500'}
              textTransform={'uppercase'}
              fontWeight={800}
              fontSize={'sm'}
              letterSpacing={1.1}>
              {author}
            </Text>
            <Heading
              // eslint-disable-next-line react-hooks/rules-of-hooks
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'md'}
              fontFamily={'body'}>
              {title}
            </Heading>
            <Text color={'gray.500'}>
              {edition}
            </Text>
          </Stack>
          <Stack m={4} direction={'row'} spacing={4} align={'center'}>
            <Avatar name={owner} />
            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
              <Text fontWeight={600}>{owner}</Text>
              <Text color={'gray.500'}>{id}</Text>
            </Stack>
          </Stack>
        </Box>
      </Center>
        </Link>
    )
  }
  
  export default Card