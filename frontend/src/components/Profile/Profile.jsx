import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import MyBooks from "../pages/MyBooks";
import Requests from "../pages/Requests";
import Holdings from "../pages/Holdings";

const Profile = () => {
  return (
    <Flex mt={10} px={4} justifyContent="center">
      <Box w={{ base: "100%", md: "90%", lg: "80%" }} bg={useColorModeValue("white", "gray.800")} p={6} borderRadius="md" boxShadow="md">
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
          Your Library Dashboard 📚
        </Text>
        <Tabs isFitted variant="soft-rounded" colorScheme="yellow">
          <TabList mb="1em">
            <Tab>My Books</Tab>
            <Tab>Requests</Tab>
            <Tab>My Holdings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <MyBooks />
            </TabPanel>
            <TabPanel>
              <Requests />
            </TabPanel>
            <TabPanel>
              <Holdings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Profile;
