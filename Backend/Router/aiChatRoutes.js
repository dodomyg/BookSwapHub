require("dotenv").config();
const express = require("express");
const axios = require("axios");
const verifyToken = require("../middleware/verifyToken");
const AISESSION = require("../Schema/AISESSION");
const uuid = require("uuid").v4;
const router = express.Router();

const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

router.get("/currentSession", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const findLatestSession = await AISESSION.findOne({ userId }).sort({
      updatedAt: -1,
    });
    if (!findLatestSession) {
      const newSession = new AISESSION({
        userId,
        sessionId: uuid(),
        messages: [],
      });
      await newSession.save();
      const { _id, ...updated } = newSession._doc;
      return res.status(200).json(updated);
    } else {
      const { _id, ...updated } = findLatestSession._doc;
      return res.status(200).json(updated);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ask", verifyToken, async (req, res) => {
  const { session_id } = req.query;
  const { query } = req.body;
  const user = req.user;
  if (!session_id || session_id.trim() === "") {
    return res.status(400).json({ error: "Session ID cannot be empty" });
  }
  const preferences = req?.user?.preferences || [];
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query cannot be empty" });
  }
  try {
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: query }],
          },
        ],
        systemInstruction: {
          role: "system",
          parts: [
            {
              text: `You are a helpful AI chatbot with expert knowledge of books across all genres. 
              You respond only to book-related queries — including recommendations, short two-line reviews, or specific book questions. 
              Keep all responses concise and under 150 words. Do not go off-topic.
              You are currently chatting with ${user?.username}. 
              Their preferred genres are: ${
                preferences.length > 0
                  ? preferences.join(", ")
                  : "None set yet. Politely suggest they set their preferences using the top-right button in the app."
              }`,
            },
          ],
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    if (!text) {
      return res.status(500).json({ error: "No response generated" });
    }

    const findSession = await AISESSION.findOneAndUpdate(
      { userId: req.userId, sessionId: session_id },
      {
        $push: {
          messages: {
            query: query,
            response: text,
            updatedat: new Date().toISOString(),
          },
        },
      }
    );

    return res.status(200).json({
      query: query,
      response: text,
      sessionId: findSession.sessionId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/deleteSession", verifyToken, async (req, res) => {
  const { session_id } = req.query;
  try {
    await AISESSION.findOneAndUpdate(
      { sessionId: session_id, userId: req.userId },
      { $set: { messages: [] } },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      message: "Session cleared successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
