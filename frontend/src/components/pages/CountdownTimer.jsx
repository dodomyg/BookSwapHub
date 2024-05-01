import React, { useState, useEffect, useContext } from 'react';
import { Button, Text,  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalFooter,
  ModalBody,
  ModalCloseButton} from '@chakra-ui/react';
import { UserContext } from '../../context/UserContext';

const CountdownTimer = ({ bookId, book, initialDurationInSeconds, onTimerEnd }) => {
  
  const [remainingTime, setRemainingTime] = useState(null);
  const {fine,setFine} = useContext(UserContext)
  const [endTime, setEndTime] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const savedEndTime = localStorage.getItem(`endTime-${bookId}`);

    if (savedEndTime) {
      setEndTime(parseInt(savedEndTime, 10));
    } else {
      const newEndTime = Date.now() + initialDurationInSeconds * 1000;
      setEndTime(newEndTime);
      localStorage.setItem(`endTime-${bookId}`, newEndTime.toString());
    }
  }, [bookId, initialDurationInSeconds]);

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, endTime - now);

      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        localStorage.removeItem(`endTime-${bookId}`);
        if (onTimerEnd) {
          setFine(true)
          onTimerEnd(); // Notify when the timer ends
        }
      }
    };

    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [endTime, bookId, onTimerEnd]);

  const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
        {remainingTime > 0 ? <Text display={'flex'} gap={'10px'} alignItems={'center'} fontSize={'22px'} fontWeight={'500'}>
                <Text mx={'10px'}>Time remaining for this book : </Text>
                <Text>{formatTime(remainingTime)}</Text>
            </Text> : <Text px={'10px'} display={'flex'} alignItems={'center'} color={'red'} fontSize={'21px'} >
                Deadline for this book has passed
                <Button onClick={onOpen} colorScheme='red' mx={2}>Fine</Button>
                <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader my={3}>
            <Text>
              Important Notice: Overdue Book and Fine Payment
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              We appreciate your participation in our book swap platform!  However, we've noticed that a book you borrowed has exceeded the designated return deadline. 

To ensure a smooth and fair experience for all users, we kindly ask that you return the book at your earliest convenience.  A late fee has been applied to your account. You can view the details of the fee and easily make a payment within the platform itself. 

Please note that timely returns are essential for keeping our book exchange running smoothly.  Settling any outstanding fees will ensure you can continue enjoying the benefits of our platform and keep discovering new literary treasures!

            </Text>
            <Text my={6} display={'flex'} gap={'5px'} flexDir={'column'} fontSize={'18px'} fontWeight={'500'}>
              <Text>Owner : {book.owner?.username}</Text>
              <Text>Book : {book?.title}</Text>
              <Text>Book : {book?.isbn}</Text>
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={()=>setFine(false)} colorScheme='red'>
            ₹ 500
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Text>
            }
    </div>
  );
};

export default CountdownTimer;
