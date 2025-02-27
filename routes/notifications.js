import { Router } from "express";
import axios from "axios";

const router = Router();

// Endpoint to send chat notifications
router.post("/send-chat-notification", async (req, res) => {
  try {
    const { message, username, senderUserId } = req.body;

    // Validate required fields
    if (!message || !username) {
      return res
        .status(400)
        .json({ error: "Message and username are required" });
    }

    // Prepare the request options for OneSignal API
    const options = {
      method: "POST",
      url: "https://api.onesignal.com/notifications",
      headers: {
        accept: "application/json",
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        app_id: process.env.ONESIGNAL_APP_ID,
        contents: { en: message },
        headings: { en: username },
        included_segments: ["Subscribed Users"],
        filters: [
          {
            field: "tag",
            key: "userId",
            relation: "!=",
            value: senderUserId || "",
          },
        ],
        buttons: [{ id: "open_chat", text: "Open Chat" }],
        data: {
          type: "chat_message",
          timestamp: new Date().toISOString(),
        },
      },
    };

    // Send request to OneSignal API
    const response = await axios.request(options);

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      error: "Failed to send notification",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
