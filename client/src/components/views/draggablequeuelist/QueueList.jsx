import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import QueueItem from './QueueItem';

const QueueList = SortableContainer(({ queue }) => (
  <ul className="queue-list">
    {queue.length
      ? queue.map((queueItem, index) => (
        <QueueItem
          key={`item-${index}`}
          index={index}
          track={queueItem.track}
          name={queueItem.track.name}
          artists={queueItem.track.artists.map(artist => artist.name).join(', ')}
          duration={queueItem.track.duration_ms}
          user={queueItem.user}
        />
      )) : (
        <h2 className="queue-empty-container">
          <span>The queue is empty!</span>
          <span>Use the search bar to search for songs</span>
        </h2>
      )}
  </ul>
));

export default QueueList;
