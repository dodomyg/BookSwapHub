import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  FormControl,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  Stack,
  Text,
  useToast,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

axios.defaults.withCredentials = true;

function ChatDrawer({ owner }) {
  const { user, chat, setChat } = useContext(UserContext);
  const [feed, setFeed] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const modalBodyRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [name,setName]=useState('')
  const [selectedChat, setSelectedChat] = useState(null); 
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
const toast = useToast();
  

  const openChat = async(otherId,name) => {
    if(otherId===user._id) return
    if(!otherId) return
    if(!name) return
    onDrawerClose(); // Close the drawer
    onModalOpen(); // Open the modal
    try {
      const resp = await axios.post(`http://localhost:8080/api/chat/createChat/${otherId}`, { withCredentials: true });
      // console.log(resp.data);
      setChat([...chat, resp.data]);
      setName(name)
      setSelectedChat(resp.data._id);
      toast({
        title: `Chatting with ${name}`,
        status: 'success',
        duration: 1500,
      })
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const resp = await axios.get(`http://localhost:8080/api/chat/getChats`, { withCredentials: true });
        setFeed(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchChats = async () => {
      try {
        const resp = await axios.get(`http://localhost:8080/api/message/allMessages/${selectedChat}`, { withCredentials: true });
        // console.log(resp.data);
        setMessages(resp.data);
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight;
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    fetchFeed();
    fetchChats();
  }, [selectedChat,modalBodyRef]);

  const sendText=async(e)=>{
    try {
     if (e.key === 'Enter'){
      const resp = await axios.post(`http://localhost:8080/api/message/sendMessage/${chat[chat.length - 1]._id}`,{message:newMessage},{withCredentials:true})
      // console.log(resp.data)
      toast({
        title: `Message sent to ${name}`,
        status: 'success',
        duration: 1500,
      })
      setMessages([...messages,resp.data])
      setNewMessage('')
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight;
      }
     }
      
    } catch (error) {
      if (error.response) {
        toast({
            title: error.response.data.error || "Server error",
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } else if (error.request) {
        
        toast({
            title: "Network error",
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    } else {
        
        toast({
            title: "Unexpected error",
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    }
    }
  }
  

  if (!user) return null;

  return (
    <>
      <Button colorScheme='teal' position='fixed' top='80px' right='10' onClick={onDrawerOpen}>
        View Messages
      </Button>
      <Drawer isOpen={isDrawerOpen} placement='right' onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>View Messages</DrawerHeader>
          <DrawerBody>
            <Flex flexDir='column' gap={5}>
              {feed.map((chat) => {
                // Find the other participant in the chat
                let otherParticipant = null;
                if (chat.users) {
                  otherParticipant = chat.users.find((participant) => participant._id !== user._id);
                }
                if (otherParticipant) {
                  return (
                    <Box
                      key={chat._id}
                      onClick={() => openChat(otherParticipant._id,otherParticipant?.username)}
                      cursor='pointer'
                      _hover={{ bg: 'gray.200' }}
                      p={3}
                      bg='gray.100'
                      borderRadius={10}
                    >
                      {otherParticipant.username}
                    </Box>
                  );
                } else {
                  return null;
                }
              })}
            </Flex>
          </DrawerBody>
          <DrawerFooter>
            <Button colorScheme='teal' variant='outline' mr={3} onClick={onDrawerClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody my={12} maxH={'45vh'} overflowY="scroll" ref={modalBodyRef}>
            <Stack direction="column">
              {messages.length===0 ? <Text textAlign={'center'} color={'gray'} fontSize={'xl'} fontWeight={'bold'}>No messages yet</Text> : messages.map((message) => (
                <Flex key={message._id} justify={message.sender._id=== user?._id ? 'flex-end' : 'flex-start'}>
                  <Text bg={message.sender._id=== owner._id ? ' gray.200' : 'blue.500'}  color={message.sender._id=== owner._id ? 'black' : 'white'} borderRadius="lg" p={2} maxW="70%" wordBreak="break-word">
                    {message.message}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <FormControl>
              <Input
                placeholder="Send a text..."
                value={newMessage}
                onKeyDown={sendText}
                onChange={(e) => setNewMessage(e.target.value)}
                mt={4}
              />
            </FormControl>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChatDrawer;
