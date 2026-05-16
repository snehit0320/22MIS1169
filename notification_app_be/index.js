const express = require("express");
const path = require("path");
const { getTopNotifications } = require("./notificationService");

const app = express();
const PORT = process.env.PORT || 3000;
const TOP_N = 10;

const getToken = () => process.env.NOTIFICATION_TOKEN || "";

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/priority-inbox", async (req, res) => {
  const token = getToken();
  if (!token) {
    return res.status(500).json({
      error: "Set NOTIFICATION_TOKEN in your environment before starting the server.",
    });
  }

  try {
    const top = await getTopNotifications(token, TOP_N);
    res.json({ notifications: top });
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Failed to load notifications";
    console.error("API error:", message);
    res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Priority Inbox UI: http://localhost:${PORT}`);
  if (!getToken()) {
    console.warn("Warning: NOTIFICATION_TOKEN is not set.");
  }
});
