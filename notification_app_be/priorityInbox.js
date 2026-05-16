const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const parseTimestamp = (timestamp) => new Date(timestamp.replace(" ", "T")).getTime();

/** Positive when `a` outranks `b` (higher type weight, then newer time). */
const comparePriority = (a, b) => {
  const weightDiff = (TYPE_WEIGHT[a.Type] || 0) - (TYPE_WEIGHT[b.Type] || 0);
  if (weightDiff !== 0) return weightDiff;
  return parseTimestamp(a.Timestamp) - parseTimestamp(b.Timestamp);
};

/**
 * Fixed-size min-heap of the current top-K notifications.
 * Root holds the lowest-priority item among the K kept items.
 */
class PriorityInbox {
  constructor(capacity = 10) {
    this.capacity = capacity;
    this.heap = [];
  }

  _parent(i) {
    return Math.floor((i - 1) / 2);
  }

  _left(i) {
    return i * 2 + 1;
  }

  _right(i) {
    return i * 2 + 2;
  }

  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  /** Min-heap order: parent has lower or equal priority than children. */
  _lowerPriority(a, b) {
    return comparePriority(a, b) < 0;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = this._parent(index);
      if (!this._lowerPriority(this.heap[index], this.heap[parent])) break;
      this._swap(index, parent);
      index = parent;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      const left = this._left(index);
      const right = this._right(index);
      let smallest = index;

      if (left < length && this._lowerPriority(this.heap[left], this.heap[smallest])) {
        smallest = left;
      }
      if (right < length && this._lowerPriority(this.heap[right], this.heap[smallest])) {
        smallest = right;
      }
      if (smallest === index) break;
      this._swap(index, smallest);
      index = smallest;
    }
  }

  add(notification) {
    if (this.heap.length < this.capacity) {
      this.heap.push(notification);
      this._bubbleUp(this.heap.length - 1);
      return;
    }

    if (comparePriority(notification, this.heap[0]) > 0) {
      this.heap[0] = notification;
      this._bubbleDown(0);
    }
  }

  addMany(notifications) {
    for (const notification of notifications) {
      this.add(notification);
    }
  }

  getTopSorted() {
    return [...this.heap].sort((a, b) => comparePriority(b, a));
  }
}

module.exports = {
  PriorityInbox,
  comparePriority,
  TYPE_WEIGHT,
};
