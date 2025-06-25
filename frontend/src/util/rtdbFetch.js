import { get, onValue, ref, set } from "firebase/database";
import { rtdb } from "./firebase";

export const fetchMessages = async (setMessages) => {
  try {
    const mssgRef = ref(rtdb, "/community_chat/messages");
    onValue(mssgRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(data);
    });
  } catch (error) {
    console.log(error, "Error fetching messages from RTDB");
  }
};

export const sendMessage = async (user, msg, setMessages) => {
  if (!user || msg.trim() === "") return;

  try {
    const messagesRef = ref(rtdb, "/community_chat/messages");
    const usersRef = ref(rtdb, "/community_chat/users");

    // Fetch existing users
    const usersSnap = await get(usersRef);
    const existingUsers = usersSnap.val() || [];

    // Add user if not present
    const userExists =
      Array.isArray(existingUsers) &&
      existingUsers.some(
        (u) => u?.name === user?.username && u?.email === user?.email
      );

    if (!userExists) {
      await set(usersRef, [
        ...existingUsers,
        { name: user.username, email: user.email },
      ]);
    }

    // Fetch messages
    const messagesSnap = await get(messagesRef);
    const prevMessages = messagesSnap.val() || [];

    const newMessage = {
      sender: {
        name: user.username,
        email: user.email,
      },
      content: msg,
      updatedAt: new Date().toISOString(),
    };

    const updatedMessages = [...prevMessages, newMessage];
    await set(messagesRef, updatedMessages);

    // Optional: Update local state
    setMessages?.(updatedMessages);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
