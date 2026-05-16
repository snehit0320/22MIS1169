import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://4.224.186.213/evaluation-service";

const getToken = () => process.env.REACT_APP_NOTIFICATION_TOKEN || "";

const client = () => {
  const token = getToken();
  if (!token) {
    throw new Error("Set REACT_APP_NOTIFICATION_TOKEN in notification_app_fe/.env");
  }
  return axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchNotifications = async (page = 1, limit = 10, type = "") => {
  const params = { limit, page };
  if (type) params.notification_type = type;

  const response = await client().get("/notifications", { params });
  const payload = response.data;

  return {
    notifications: payload.notifications || [],
    total: payload.total ?? payload.notifications?.length ?? 0,
  };
};

/** Fetches every page so priority ranking is global. */
export const fetchAllNotifications = async (type = "") => {
  const limit = 50;
  let page = 1;
  let all = [];
  let total = Infinity;

  while (all.length < total) {
    const { notifications, total: reportedTotal } = await fetchNotifications(
      page,
      limit,
      type
    );
    all = all.concat(notifications);
    total = reportedTotal || all.length;
    if (!notifications.length || notifications.length < limit) break;
    page += 1;
  }

  return all;
};
