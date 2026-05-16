const listEl = document.getElementById("inbox-list");
const bannerEl = document.getElementById("banner");
const emptyEl = document.getElementById("empty-state");
const countBadge = document.getElementById("count-badge");
const updatedAt = document.getElementById("updated-at");
const refreshBtn = document.getElementById("refresh-btn");

const typeClass = {
  Placement: "placement",
  Result: "result",
  Event: "event",
};

const showBanner = (message, kind = "error") => {
  bannerEl.textContent = message;
  bannerEl.className = `banner ${kind}`;
  bannerEl.classList.remove("hidden");
};

const hideBanner = () => {
  bannerEl.classList.add("hidden");
};

const setLoading = (loading) => {
  refreshBtn.disabled = loading;
  refreshBtn.classList.toggle("loading", loading);
};

const renderSkeletons = () => {
  listEl.innerHTML = "";
  emptyEl.classList.add("hidden");
  for (let i = 0; i < 5; i += 1) {
    const sk = document.createElement("li");
    sk.className = "skeleton-item";
    sk.setAttribute("aria-hidden", "true");
    listEl.appendChild(sk);
  }
};

const renderList = (notifications) => {
  listEl.innerHTML = "";

  if (!notifications.length) {
    emptyEl.classList.remove("hidden");
    countBadge.textContent = "0 items";
    return;
  }

  emptyEl.classList.add("hidden");
  countBadge.textContent = `${notifications.length} items`;

  notifications.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "inbox-item";

    const rank = document.createElement("span");
    rank.className = `rank${index === 0 ? " top" : ""}`;
    rank.textContent = String(index + 1);

    const body = document.createElement("div");
    body.className = "item-body";

    const message = document.createElement("p");
    message.className = "item-message";
    message.textContent = item.Message;

    const time = document.createElement("p");
    time.className = "item-time";
    time.textContent = item.Timestamp;

    body.append(message, time);

    const badge = document.createElement("span");
    const kind = typeClass[item.Type] || "event";
    badge.className = `badge ${kind}`;
    badge.textContent = item.Type;

    li.append(rank, body, badge);
    listEl.appendChild(li);
  });
};

const loadInbox = async () => {
  hideBanner();
  setLoading(true);
  renderSkeletons();

  try {
    const res = await fetch("/api/priority-inbox");
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Could not load notifications");
    }

    renderList(data.notifications || []);
    updatedAt.textContent = `Updated ${new Date().toLocaleString()}`;
  } catch (err) {
    listEl.innerHTML = "";
    emptyEl.classList.add("hidden");
    countBadge.textContent = "—";
    showBanner(err.message);
  } finally {
    setLoading(false);
  }
};

refreshBtn.addEventListener("click", loadInbox);
loadInbox();
