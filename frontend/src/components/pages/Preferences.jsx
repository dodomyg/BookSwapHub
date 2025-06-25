import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Container,
  Heading,
  useColorModeValue,
  Tooltip,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import PrefModal from "../PrefModal/PrefModal";
import axios from "axios";
import Markdown from "react-markdown";

axios.defaults.withCredentials = true;

const BookChat = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser } = useContext(UserContext);
  const [pref, setPref] = useState([]);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [input, setInput] = useState("");
  const [sessionData, setSessionData] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const msgRef = useRef(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const resp = await axios.get(
          "http://localhost:8080/api/aiChat/currentSession",
          { withCredentials: true }
        );
        setSessionData(resp?.data);
        setMsgs(resp?.data?.messages || []);
      } catch (error) {
        console.error("Error fetching session data:", error);
        setSessionData(null);
        setMsgs([]);
      }
    };
    fetchSessionData();
  }, []);

  useEffect(() => {
    if (user?.preferences) {
      setPref(user.preferences);
      setOpenTooltip(user?.preferences?.length > 0);
    } else {
      setOpenTooltip(false);
      setPref([]);
    }
  }, [user]);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionData) return;

    const userMessage = {
      query: input,
      response: null, // placeholder
    };

    setMsgs((prev) => [...prev, userMessage]); // show user message immediately
    setIsTyping(true); // show typing bubble
    const currentQuery = input;
    setInput(""); // clear input field

    try {
      const resp = await axios.post(
        `http://localhost:8080/api/aiChat/ask?session_id=${sessionData.sessionId}`,
        { query: currentQuery }
      );

      const botMessage = {
        query: currentQuery,
        response: resp?.data?.response || "No response",
      };

      setMsgs((prev) => [...prev.slice(0, -1), botMessage]); // replace last (incomplete) message with full
    } catch (error) {
      console.error("Error in AI chat:", error);
      // Optional: show an error message in chat
      setMsgs((prev) => [
        ...prev.slice(0, -1),
        {
          query: currentQuery,
          response: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const bgUser = useColorModeValue("blue.100", "blue.700");
  const bgBot = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="80%" py={8}>
      <Box position="fixed" top={20} right={5} zIndex={10}>
        <Tooltip
          label="Set your preferences here"
          placement="left-end"
          isOpen={!openTooltip}
        >
          <Button onClick={onOpen} colorScheme="teal">
            Set Preferences
          </Button>
        </Tooltip>
      </Box>

      <PrefModal
        isOpen={isOpen}
        onClose={onClose}
        currentPrefs={pref}
        setPref={setPref}
        setUser={setUser}
      />

      <Heading fontSize="2xl" mb={6} textAlign="center">
        What’s good, {user?.username} 🤙?
      </Heading>

      <VStack
        spacing={4}
        bg={useColorModeValue("gray.50", "gray.800")}
        p={6}
        borderRadius="lg"
        h="60vh"
        overflowY="auto"
        boxShadow="md"
        align="stretch"
      >
        {msgs.length === 0 ? (
          <VStack
            justify="center"
            align="center"
            flex={1}
            textAlign="center"
            spacing={4}
          >
            <Icon as={FaRobot} boxSize={10} color="gray.400" />
            <Text fontSize="lg" color="gray.500" fontWeight="medium">
              👋 Hello {user?.username || "there"}!
              <br />
              Ask me for <b>book suggestions</b> based on your favorite{" "}
              <b>genre</b> or <b>author</b>.
            </Text>
            <Text fontSize="sm" color="gray.400">
              Try: “Recommend fantasy novels” or “Books by Orwell”
            </Text>
          </VStack>
        ) : (
          msgs.map((msg, idx) => (
            <VStack key={idx} w="100%" spacing={4} align="stretch">
              {/* User message on the right */}
              <HStack justify="flex-end" w="100%">
                <Box
                  bg={bgUser}
                  px={4}
                  py={2}
                  borderRadius="xl"
                  maxW="75%"
                  boxShadow="sm"
                  textAlign="right"
                >
                  <Text fontSize="sm" fontWeight="semibold" mb={1}>
                    You:
                  </Text>
                  <Text>{msg.query}</Text>
                </Box>
              </HStack>

              {/* Bot response on the left */}
              {msg?.response !== null && (
                <HStack justify="flex-start" w="100%">
                  <Box
                    bg={bgBot}
                    px={4}
                    py={2}
                    borderRadius="xl"
                    maxW="75%"
                    boxShadow="sm"
                    textAlign="left"
                  >
                    <Text fontSize="sm" fontWeight="semibold" mb={1}>
                      BookBot:
                    </Text>
                    <Markdown>{msg.response}</Markdown>
                  </Box>
                </HStack>
              )}
            </VStack>
          ))
        )}

        {/* Typing animation */}
        {isTyping && (
          <HStack justify="flex-start" w="100%">
            <Box
              bg={bgBot}
              px={4}
              py={2}
              borderRadius="xl"
              maxW="75%"
              boxShadow="sm"
              fontStyle="italic"
            >
              <Text fontSize="sm" fontWeight="semibold" mb={1}>
                BookBot:
              </Text>
              <Text>Typing...</Text>
            </Box>
          </HStack>
        )}
        <Box ref={msgRef} />
      </VStack>

      <HStack mt={4}>
        <Input
          placeholder="Type your favorite genre or author..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          bg={useColorModeValue("white", "gray.700")}
        />
        <Button colorScheme="teal" onClick={sendMessage}>
          <FaPaperPlane />
        </Button>
      </HStack>
    </Container>
  );
};

export default BookChat;
