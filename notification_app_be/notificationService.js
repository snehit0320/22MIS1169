const axios = require("axios");
const { PriorityInbox } = require("./priorityInbox");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const fetchNotifications = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.notifications;
};

const getTopNotifications = async (token, limit = 10) => {
  const notifications = await fetchNotifications(token);
  const inbox = new PriorityInbox(limit);
  inbox.addMany(notifications);
  return inbox.getTopSorted();
};

module.exports = { getTopNotifications };
