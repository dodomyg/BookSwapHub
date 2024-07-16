import { Box, SimpleGrid, Icon, Text, Stack, Flex, Heading } from '@chakra-ui/react';
import { FcAssistant, FcDonate, FcInTransit } from 'react-icons/fc';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default function AboutPage() {
  return (
    <Box my={10} p={4}>
      <Heading as="h1" mb={6} textAlign="center">
        About BookSwapHub
      </Heading>
      <Text fontSize="lg" textAlign="center" mb={10}>
        Designed and developed BookSwapHub, a secure book-sharing platform that empowers book lovers to exchange books seamlessly. 
        This application removes financial barriers to literature exploration, promoting access to a diverse range of titles.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={'Lifetime Support'}
          text={
            'At BookSwapHub, we provide lifetime support to our users, ensuring they have a smooth and enjoyable book swapping experience.'
          }
        />
        <Feature
          icon={<Icon as={FcDonate} w={10} h={10} />}
          title={'Unlimited Donations'}
          text={
            'Users can donate books without any limit, helping to grow our diverse library and provide more options for our community.'
          }
        />
        <Feature
          icon={<Icon as={FcInTransit} w={10} h={10} />}
          title={'Instant Delivery'}
          text={
            'Experience the convenience of instant delivery with our platform, making sure you get the books you want as quickly as possible.'
          }
        />
      </SimpleGrid>
      <Heading as="h2" mt={10} mb={6} textAlign="center">
        Key Features
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={'Communication'}
          text={
            'Communicate with book owners directly through our chatting system, ensuring smooth and transparent exchanges.'
          }
        />
        <Feature
          icon={<Icon as={FcDonate} w={10} h={10} />}
          title={'Advanced Filtering'}
          text={
            'Find the perfect book with our advanced filtering functionalities based on names and categories, tailored to your interests.'
          }
        />
        <Feature
          icon={<Icon as={FcInTransit} w={10} h={10} />}
          title={'Robust Return Policy'}
          text={
            'Our robust return policy ensures fair and reliable swaps, fostering trust and a sense of community among users.'
          }
        />
      </SimpleGrid>
    </Box>
  );
}
