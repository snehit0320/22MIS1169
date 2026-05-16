# Stage 1 — Notification System Design

## Objective

Build a **Priority Inbox** that surfaces the top 10 most important notifications from the evaluation API, ordered by type importance and recency—without persisting notifications in a database.

## Priority rules

| Type       | Weight | Meaning          |
|------------|--------|------------------|
| Placement  | 3      | Highest priority |
| Result     | 2      | Medium priority  |
| Event      | 1      | Lowest priority  |

When two notifications share the same type, the **newer** `Timestamp` ranks higher.

## Architecture

```
Browser (public/)  →  GET /api/priority-inbox  →  Express (index.js)
                                                      ↓
                                              notificationService + PriorityInbox
                                                      ↓
                                              Evaluation API (Bearer token via env)
```

- **No database**: notifications exist only in the HTTP response and in-memory heap.
- **No hard-coded notifications**: all items come from the live API.
- **Frontend**: static UI at `notification_app_be/public/` served by Express.

## Maintaining the top 10 efficiently

`PriorityInbox` (`priorityInbox.js`) uses a **min-heap of fixed size K = 10**:

1. Heap has fewer than 10 items → insert (**O(log 10)**).
2. Heap is full and new item outranks the root → replace root (**O(log 10)**).
3. Otherwise → discard (**O(1)** compare).

For a one-time API fetch, each notification is streamed through `add()`. The same structure supports live polling or push feeds without re-sorting the full list (**O(n log K)** vs **O(n log n)**).

Display uses `getTopSorted()` — sort 10 items only (**O(K log K)**).

## Files

| File | Role |
|------|------|
| `priorityInbox.js` | Min-heap priority logic |
| `notificationService.js` | Fetch API + build top 10 |
| `priorityNotifications.js` | CLI script (Stage 1 terminal output) |
| `index.js` | HTTP server + `/api/priority-inbox` |
| `public/` | Priority Inbox web UI |

## How to run

```bash
cd notification_app_be
npm install
set NOTIFICATION_TOKEN=<your-bearer-token>
npm start
```

Open http://localhost:3000

CLI only:

```bash
node priorityNotifications.js
```

## Trade-offs

- **Memory**: O(K) for the heap.
- **Token security**: use `NOTIFICATION_TOKEN` environment variable; never commit tokens.
