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
    if (this.length == 0) {
      return undefined;
    }
    let id = this.idQueue.shift();
    let data = this.dataMap[id];
    delete this.dataMap[id];
    return [id, data];
  }

  get length() {
    return this.idQueue.length
  }

  peek(index=0) {
    if (this.length <= index) {
      return undefined;
    }
    let id = this.idQueue[index];
    let data = this.dataMap[id];
    return [id, data];
  }
}

module.exports = UniqueQueue;
