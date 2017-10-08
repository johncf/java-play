class UniqueQueue {
  constructor() {
    this.idQueue = [];
    this.dataMap = {};
  }

  // time complexity: O(n)
  enQ(id, data) {
    if (this.dataMap.hasOwnProperty(id)) {
      this.idQueue.splice(this.idQueue.indexOf(id), 1);
    }
    this.idQueue.push(id);
    this.dataMap[id] = data;
  }

  // time complexity: O(n)
  deQ() {
    let id = this.idQueue.shift();
    let data = this.dataMap[id];
    delete this.dataMap[id];
    return [id, data];
  }

  get length() {
    return this.idQueue.length
  }
}

module.exports = UniqueQueue;
