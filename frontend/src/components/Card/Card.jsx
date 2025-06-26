import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  Avatar,
  useColorModeValue,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Card = ({ title, author, frontPage, id, edition, owner }) => {
  return (
    <Link to={`/book/${id}`} style={{ textDecoration: "none" }}>
      <Flex
        direction="column"
        w="220px"
        h="400px"
        bg={useColorModeValue("white", "gray.800")}
        rounded="md"
        overflow="hidden"
        boxShadow="md"
        _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
        transition="all 0.2s ease"
      >
        <Image
          src={frontPage}
          alt={title}
          objectFit="cover"
          w="100%"
          h="160px"
        />

        <Stack spacing={2} px={4} pt={3} flex="1">
          <Text
            fontSize="xs"
            color="teal.500"
            fontWeight="bold"
            noOfLines={1}
            minH="18px"
          >
            {author}
          </Text>

          <Heading size="sm" noOfLines={2} minH="40px">
            {title}
          </Heading>

          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            Edition: {edition || "N/A"}
          </Text>
        </Stack>

        <HStack px={4} pb={4} spacing={3} mt="auto">
          <Avatar name={owner} size="sm" />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
              {owner}
            </Text>
            <Text fontSize="xs" color="gray.400">
              #{id?.slice(-5)}
            </Text>
          </Box>
        </HStack>
      </Flex>
    </Link>
  );
};

export default Card;