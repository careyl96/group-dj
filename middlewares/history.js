
class PageNode {
  constructor(view) {
    this.prev = null;
    this.view = view;
    this.next = null;
  }
}

class PageHistory {
  constructor(view = 'home') {
    this.pageNode = new PageNode(view);
  }

  addNode(view) {
    const newPage = new PageNode(view);
    this.pageNode.next = newPage;
    newPage.prev = this.pageNode;
    this.pageNode = newPage;
  }

  getPrev() {
    if (this.pageNode.prev) {
      this.pageNode = this.pageNode.prev;
    }
    return this.pageNode;
  }

  getNext() {
    if (this.pageNode.next) {
      this.pageNode = this.pageNode.next;
    }
    return this.pageNode;
  }
}

module.exports = new PageHistory('home');

// on update view success
  // newPage = new Page(page);
  // page.next = new Page(page);
  // newPage.prev = page
    // set state to newPage

// if state.prev exists and back button is clicked 
  // set state to state.prev
  // updateView('state.view');

// if state.next exists and next is clicked
  // set state to state.next
  // updateViewSuccess('state.view')

// if state.next exists and random page is clicked
  // newPage = new Page(page)
  // page.next = newPage.prev
  // newPage.prev = page
    // set state to newPage 