const axios = require("axios");
const { PriorityInbox } = require("./priorityInbox");

const API_URL = "http://4.224.186.213/evaluation-service/notifications";

const fetchNotificationsPage = async (token, page = 1, limit = 10, type = "") => {
  const safeLimit = Math.min(10, Math.max(5, Number(limit) || 10));
  const params = { limit: safeLimit, page };
  if (type) params.notification_type = type;

  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  const payload = response.data;
  return {
    notifications: payload.notifications || [],
    total: payload.total ?? payload.notifications?.length ?? 0,
  };
};

const fetchAllNotifications = async (token, type = "") => {
  const limit = 10;
  let page = 1;
  let all = [];
  let total = null;
  const maxPages = 50;

  while (page <= maxPages) {
    const { notifications, total: reportedTotal } = await fetchNotificationsPage(
      token,
      page,
      limit,
      type
    );
    if (total == null && reportedTotal) total = reportedTotal;
    all = all.concat(notifications);
    if (!notifications.length || notifications.length < limit) break;
    if (total != null && all.length >= total) break;
    page += 1;
  }

  return all;
};

const getTopNotifications = async (token, topN = 10, type = "") => {
  const notifications = await fetchAllNotifications(token, type);
  const inbox = new PriorityInbox(topN);
  inbox.addMany(notifications);
  return inbox.getTopSorted();
};

module.exports = {
  fetchNotificationsPage,
  fetchAllNotifications,
  getTopNotifications,
};
