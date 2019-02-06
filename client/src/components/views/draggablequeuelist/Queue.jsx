import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateQueue } from '../../../../../actions/queueActions';
import QueueList from './QueueList';

class Queue extends Component {
  onSortStart = () => { // prevent the items in the queue to activate their hover events while you're dragging and dropping.
    const queue = document.querySelectorAll('.track-item-container');
    queue.forEach(queueItem => queueItem.style.setProperty('pointer-events', 'none', 'important'));
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const queue = document.querySelectorAll('.track-item-container');
    const { updateQueue } = this.props;
    queue.forEach(queueItem => queueItem.style.removeProperty('pointer-events')); // reactivate hover events
    if (oldIndex !== newIndex) updateQueue(oldIndex, newIndex); // update the queue in state
  };

  render() {
    const { queue } = this.props;
    return (
      <QueueList
        lockAxis="y"
        lockOffset={0}
        lockToContainerEdges
        onSortStart={this.onSortStart}
        onSortEnd={this.onSortEnd}
        transitionDuration={0}
        queue={queue}
      />
    );
  }
}

const mapStateToProps = state => ({
  queue: state.view.queue,
});

const mapDispatchToProps = dispatch => ({
  updateQueue: (oldIndex, newIndex) => dispatch(updateQueue(oldIndex, newIndex)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Queue);
