const axios = require("axios");
const { PriorityInbox } = require("./priorityInbox");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const TOP_N = 10;

const getAccessToken = () => {
  const token = process.env.NOTIFICATION_TOKEN || process.argv[2];
  if (!token) {
    throw new Error(
      "Missing token. Set NOTIFICATION_TOKEN or pass it as: node priorityNotifications.js <token>"
    );
  }
  return token;
};

const fetchNotifications = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.notifications;
};

const printPriorityInbox = (notifications) => {
  const inbox = new PriorityInbox(TOP_N);

  for (const notification of notifications) {
    inbox.add(notification);
  }

  const top = inbox.getTopSorted();

  console.log("Stage 1 — Top 10 Priority Notifications\n");
  top.forEach((notification, index) => {
    console.log(
      `${index + 1}. [${notification.Type}] ${notification.Message} (${notification.Timestamp})`
    );
  });
};

const main = async () => {
  try {
    const token = getAccessToken();
    const notifications = await fetchNotifications(token);
    printPriorityInbox(notifications);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error("Error:", message);
    process.exit(1);
  }
};

main();
