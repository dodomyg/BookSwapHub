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

  
  const Card = ({title,author,frontPage,id,edition}) => {
    return (
        <Link to={`/book/${id}`}>
          <Center py={6}>
        <Box
          maxW={'340px'}
          w={'full'}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'md'}
          p={6}
          overflow={'hidden'}>
          <Box h={'210x'} bg={'gray.100'} mt={-6} mx={-6} mb={6} pos={'relative'}>
            <Image
              src={frontPage}
              fill
              alt={title}
            />
          </Box>
          <Stack>
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
              fontSize={'2xl'}
              fontFamily={'body'}>
              {title}
            </Heading>
            <Text color={'gray.500'}>
              {edition}
            </Text>
          </Stack>
          <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
            <Avatar src={'https://avatars0.githubusercontent.com/u/1164541?v=4'} />
            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
              <Text fontWeight={600}>{author}</Text>
              <Text color={'gray.500'}>{id}</Text>
            </Stack>
          </Stack>
        </Box>
      </Center>
        </Link>
    )
  }
  
  export default Card