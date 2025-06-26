import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaInfo } from "react-icons/fa";
import { fetchMessages, sendMessage } from "../../util/rtdbFetch";
import { UserContext } from "../../context/UserContext";
import Loader from "../CustomLoader/Loading";

const CommunityChat = () => {
  const topBarBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("white", "gray.700");
  const navigate = useNavigate();
  const chatBg = useColorModeValue("linear(to-b, teal.50, white)", "gray.700");
  const msgBgUser = useColorModeValue("blue.100", "blue.600");
  const msgBgOther = useColorModeValue("gray.200", "gray.600");

  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const msgRef = useRef(null);

  const scrollToBottom = () => {
    if (msgRef.current) {
      msgRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages(setMessages, setLoading);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) return <Loader />;
  return (
    <Flex direction="column" h="100vh" w="100vw" bgGradient={chatBg}>
      {/* Top Bar */}
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={3}
        bg={topBarBg}
        boxShadow="md"
      >
        <HStack spacing={3}>
          <IconButton
            icon={<IoArrowBack />}
            onClick={() => navigate("/")}
            variant="ghost"
            aria-label="Back"
            size="lg"
          />
          <Heading size="md">Community Chat</Heading>
        </HStack>
        <Tooltip
          label="📢 This is a public community chat. Please be respectful and follow the guidelines."
          hasArrow
          placement="left-end"
          bg="gray.700"
          color="white"
          fontSize="sm"
          p={2}
          rounded="md"
          maxW="250px"
        >
          <Box cursor="pointer">
            <FaInfo />
          </Box>
        </Tooltip>
      </Flex>

      {/* Chat Area */}
      <VStack
        flex={1}
        px={4}
        py={4}
        spacing={4}
        overflowY="auto"
        align="stretch"
      >
        {messages.length === 0 ? (
          <Box textAlign="center" color="gray.500" mt={10}>
            <Text fontSize="lg" fontWeight="medium">
              👋 No messages yet
            </Text>
            <Text fontSize="sm">
              Be the first to say something to the community!
            </Text>
          </Box>
        ) : (
          messages.map((m, i) => (
            <Box
              key={i}
              alignSelf={
                m?.sender?.email === user?.email ? "flex-end" : "flex-start"
              }
              bg={m?.sender?.email === user?.email ? msgBgUser : msgBgOther}
              px={4}
              py={2}
              borderRadius="md"
              maxW="70%"
              boxShadow="sm"
            >
              <Text fontWeight="bold" mb={1}>
                {m?.sender?.email === user?.email ? "You" : m?.sender?.name}
              </Text>
              <Text>{m?.content}</Text>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {new Date(m?.updatedAt).toLocaleString()}
              </Text>
            </Box>
          ))
        )}
        <Box ref={msgRef} />
      </VStack>

      {/* Input Bar */}
      <HStack
        p={4}
        bg={inputBg}
        boxShadow="inner"
      >
        <Input
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(user, msg, setMessages);
              setMsg("");
            }
          }}
          bg={inputBg}
        />
        <Button
          onClick={() => {
            sendMessage(user, msg, setMessages);
            setMsg("");
          }}
          colorScheme="teal"
        >
          Send
        </Button>
      </HStack>
    </Flex>
  );
};

export default CommunityChat;
