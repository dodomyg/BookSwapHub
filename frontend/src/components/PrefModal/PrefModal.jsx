import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  CheckboxGroup,
  VStack,
  Button,
  useDisclosure,
  Text,
  Toast,
} from "@chakra-ui/react";
import axios from "axios";
import { getUser } from "../../context/UserContext";

axios.defaults.withCredentials = true;

const genreOptions = [
  "Fiction",
  "Adventure",
  "Non-Fiction",
  "Education",
  "Mystery",
  "Fantasy",
  "Drama",
  "Romance",
  "Thriller",
  "Kids",
  "Other",
];

const PrefModal = ({
  isOpen,
  onClose,
  currentPrefs = [],
  setPref,
  setUser,
}) => {
  const [selectedGenres, setSelectedGenres] = useState(currentPrefs);
  useEffect(() => {
    setSelectedGenres(currentPrefs);
  }, [currentPrefs]);
  const savePrefs = async () => {
    const payload = {
      preferences: selectedGenres,
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/preferences",
        payload,
        { withCredentials: true }
      );
      getUser(setUser);
      Toast({
        title: res.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setPref(selectedGenres);
      onClose();
    } catch (error) {
      console.log(error);
      Toast({
        title: error.response.data.error || "Server error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Your Favorite Genres</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <CheckboxGroup
            value={selectedGenres}
            onChange={(val) => setSelectedGenres(val)}
            colorScheme="teal"
          >
            <VStack align="start" spacing={3}>
              {genreOptions.map((genre) => (
                <Checkbox
                  checked={selectedGenres.includes(genre)}
                  key={genre}
                  value={genre}
                >
                  {genre}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>

          <Button mt={6} colorScheme="blue" width="100%" onClick={savePrefs}>
            Save Preferences
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PrefModal;
