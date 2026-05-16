import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:3000/api";

const getStoredToken = () =>
  sessionStorage.getItem("notificationToken") ||
  process.env.REACT_APP_NOTIFICATION_TOKEN ||
  "";

export const setAuthToken = (token) => {
  if (token) sessionStorage.setItem("notificationToken", token.trim());
  else sessionStorage.removeItem("notificationToken");
};

export const getAuthToken = () => getStoredToken();

const client = () => {
  const token = getStoredToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.create({
    baseURL: API_BASE,
    headers,
  });
};

const parseError = (error) => {
  const data = error.response?.data;
  return data?.message || data?.error || error.message || "Request failed";
};

export const fetchNotifications = async (page = 1, limit = 10, type = "") => {
  const safeLimit = Math.min(10, Math.max(5, Number(limit) || 10));
  const params = { limit: safeLimit, page };
  if (type) params.notification_type = type;

  try {
    const response = await client().get("/notifications", { params });
    const payload = response.data;

    return {
      notifications: payload.notifications || [],
      total: payload.total ?? payload.notifications?.length ?? 0,
    };
  } catch (error) {
    throw new Error(parseError(error));
  }
};

/** Single request — backend runs priority heap (avoids dozens of paginated calls). */
export const fetchPriorityInbox = async (type = "", topN = 10) => {
  const params = { top: topN };
  if (type) params.notification_type = type;

  try {
    const response = await client().get("/priority-inbox", { params });
    return response.data.notifications || [];
  } catch (error) {
    throw new Error(parseError(error));
  }
};
