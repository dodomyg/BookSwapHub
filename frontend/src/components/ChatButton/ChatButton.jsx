import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Input,
  Button,
  ModalCloseButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import axios from "axios"
import {
  FormControl,
  Flex
} from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import ChatDrawer from '../ChatDrawer/ChatDrawer'
axios.defaults.withCredentials = true

const ChatButton = ({owner}) => {
const toast = useToast()
const [messages, setMessages] = useState([]);
const modalBodyRef = useRef(null);

    const [newMessage, setNewMessage] = useState('');
    const {chat,setChat}=useContext(UserContext)
    // const [viewMsg, setViewMsg] = useState(false);
    const {user}=useContext(UserContext)
    const { isOpen, onOpen, onClose } = useDisclosure();
  const createChat=async()=>{
    try {
      const resp = await axios.post(`http://localhost:8080/api/chat/createChat/${owner?._id}`,{withCredentials:true})
      console.log(resp.data)
      setChat([...chat,resp.data])
      toast({
        title: `Chatting with ${owner?.username}`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
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


  useEffect(() => {
    const getAllMessages = async () => {
        try {
            if (!chat.length) return; // Exit if chat array is empty
            const chatId = chat[chat.length - 1]._id; // Get the chat ID of the last chat in the array
            const resp = await axios.get(`http://localhost:8080/api/message/allMessages/${chatId}`,{withCredentials:true});
            setMessages(resp.data); // Assuming the API returns messages in the 'messages' property
            // console.log(resp.data);
            if (modalBodyRef.current) {
              modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight;
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
    };

    getAllMessages();
}, [chat, toast, modalBodyRef]);

  const sendText=async(e)=>{
    try {
     if (e.key === 'Enter'){
      const resp = await axios.post(`http://localhost:8080/api/message/sendMessage/${chat[chat.length - 1]._id}`,{message:newMessage},{withCredentials:true})
      // console.log(resp.data)
      toast({
        title: `Message sent to ${owner?.username}`,
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

  

  const name = user?._id !== owner?._id ? <>{owner?.username}</> : 'View Messages'
  useEffect(() => {
    
  },[])

  return (
    <>
       {owner?._id !== user?._id ? <>
        <Button owner={owner}  colorScheme={'teal'} position={'fixed'} top={'80px'} right={'10'} onClick={()=>{
        createChat()
        onOpen()
       }}>Chat with Owner</Button>
       </> : <>
       {/* <Button colorScheme={'teal'} position={'fixed'} top={'80px'} right={'10'}>View Messages</Button> */}
       <ChatDrawer owner={owner}/>
       </>
       }

       <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'26px'}>{name}</ModalHeader>
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
  )
}

export default ChatButton