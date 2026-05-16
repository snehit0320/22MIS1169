import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "readNotificationIds";

const loadIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

export const useReadState = () => {
  const [readIds, setReadIds] = useState(loadIds);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds]));
  }, [readIds]);

  const isRead = useCallback((id) => readIds.has(id), [readIds]);

  const markRead = useCallback((id) => {
    setReadIds((prev) => new Set(prev).add(id));
  }, []);

  const markUnread = useCallback((id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return { isRead, markRead, markUnread };
};
