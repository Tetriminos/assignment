/**
 * Priority queue class taken from [this](https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026) medium article
 */
class PriorityQueue {
  /**
   * Initializes empty collection
   */
  constructor() {
    this.collection = [];
  }

  /**
   * Enqueues an element into the queue
   * @param {Array} element - a pair, value at first index is the elements value (lol),
   *                          and the value at the second index is its weight
   */
  enqueue(element) {
    if (this.isEmpty()) {
      this.collection.push(element);
    } else {
      let added = false;

      for (let i = 1; i <= this.collection.length; i++) {
        if (element[1] < this.collection[i - 1][1]) {
          this.collection.splice(i - 1, 0, element);
          added = true;
          break;
        }
      }

      if (!added) {
        this.collection.push(element);
      }
    }
  }

  /**
   * Removes element with highest priority from queue and returns it
   * @returns {Array} - a pair, value at first index is the elements value (lol, again),
   *                    and the value at the second index is its weight
  */
  dequeue() {
    const value = this.collection.shift();
    return value;
  }

  /**
   * @returns {Boolean} - true if collection is empty
   */
  isEmpty() {
    return this.collection.length === 0;
  }
}

module.exports = PriorityQueue;
