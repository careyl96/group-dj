import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueueList from './QueueList';
import { updateQueue } from '../../../../../actions/queueActions';

class Queue extends Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    const queue = document.querySelectorAll('.track-container');
    queue.forEach(queueItem => queueItem.style.removeProperty('pointer-events'));
    if (oldIndex !== newIndex) this.props.updateQueue(oldIndex, newIndex);
  };

  onSortStart = () => {
    const queue = document.querySelectorAll('.track-container');
    queue.forEach(queueItem => queueItem.style.setProperty('pointer-events', 'none', 'important'));
  }

  render() {
    return (
      <QueueList
        lockAxis="y"
        lockOffset={0}
        lockToContainerEdges
        onSortStart={this.onSortStart}
        onSortEnd={this.onSortEnd}
        transitionDuration={0}
        queue={this.props.queue}
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
