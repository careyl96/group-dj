
class Node {
  constructor(item = null) {
    this.prev = null;
    this.item = item;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.node = new Node();
  }

  addNode(item) {
    console.log('adding node');
    const node = new Node(item);
    if (!this.node.item) {
      this.node = node;
    } else {
      this.node.next = node;
      node.prev = this.node;
      this.node = node;
    }
  }

  getPrev() {
    if (this.node.prev) {
      this.node = this.node.prev;
    }
    return this.node;
  }

  getNext() {
    if (this.node.next) {
      this.node = this.node.next;
    }
    return this.node;
  }
}

module.exports = DoublyLinkedList;
