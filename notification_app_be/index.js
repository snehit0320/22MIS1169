const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const {
  fetchNotificationsPage,
  getTopNotifications,
} = require("./notificationService");

const app = express();
const PORT = process.env.PORT || 3000;
const TOP_N = 10;

const getToken = (req) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  return process.env.NOTIFICATION_TOKEN || "";
};

app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notifications", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(500).json({
      error: "No token. Set NOTIFICATION_TOKEN on the backend or send Authorization: Bearer <token>.",
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Math.min(10, Math.max(5, Number(req.query.limit) || 10));
  const type = req.query.notification_type || req.query.type || "";

  try {
    const data = await fetchNotificationsPage(token, page, limit, type);
    res.json(data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Failed to load notifications";
    console.error("API error:", message);
    res.status(status).json({ error: message, message });
  }
});

app.get("/api/priority-inbox", async (req, res) => {
  const token = getToken(req);
  if (!token) {
    return res.status(500).json({
      error: "Set NOTIFICATION_TOKEN in your environment before starting the server.",
    });
  }

  const type = req.query.notification_type || req.query.type || "";
  const topN = Number(req.query.top) || TOP_N;

  try {
    const top = await getTopNotifications(token, topN, type);
    res.json({ notifications: top });
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Failed to load notifications";
    console.error("API error:", message);
    res.status(status).json({ error: message, message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API: http://localhost:${PORT}/api/notifications`);
  console.log(`Stage 1 UI:    http://localhost:${PORT}`);
  if (!process.env.NOTIFICATION_TOKEN) {
    console.warn("Warning: NOTIFICATION_TOKEN is not set on the backend.");
  }
});
