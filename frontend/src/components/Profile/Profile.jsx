import React from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel,Flex, Divider } from '@chakra-ui/react'
import MyBooks from '../pages/MyBooks'
import Requests from '../pages/Requests'
import Holdings from '../pages/Holdings'

const Profile = () => {
  return (
    <Flex my={8} justifyContent="center">
<Tabs isFitted variant='soft-rounded' colorScheme='yellow'>
  <TabList my={2}>
    <Tab>My Books </Tab>
    <Tab>Requests</Tab>
    <Tab>My Holdings</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <MyBooks/>
    </TabPanel>
    <TabPanel>
      <Requests/>
    </TabPanel>
    <TabPanel>
      <Holdings/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Flex>
  )
}

export default Profile