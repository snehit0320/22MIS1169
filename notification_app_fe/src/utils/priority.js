const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const getPriorityScore = (notification) => {
  const weight = TYPE_WEIGHT[notification.Type] || 0;
  const time = new Date(notification.Timestamp.replace(" ", "T")).getTime();
  return weight * 1_000_000_000_000 + time;
};

export const getTopPriority = (notifications, topN = 10) => {
  return [...notifications]
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, topN);
};
