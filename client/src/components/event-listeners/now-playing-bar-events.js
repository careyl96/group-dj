import store from '../../../../store/store';
import { seekTrack } from '../../../../actions/trackActions';

function draggable(element, context) {
  const progressBar = document.querySelector('.progress-bar-clickable');
  const progressBarProgress = document.querySelector('.progress-bar-progress');
  const progressBarSlider = document.querySelector('.progress-bar-slider');

  let isMouseDown = false;
  let startingWidthPercentage;
  let mousePositionStart;
  let percentBuffered;

  function onMouseDown(e) {
    isMouseDown = true;
    const { length } = store.getState().trackData;
    mousePositionStart = e.clientX;
    startingWidthPercentage = e.offsetX / progressBar.offsetWidth * 100;

    progressBarProgress.style.width = `${startingWidthPercentage}%`;
    progressBarSlider.style.left = `${startingWidthPercentage}%`;

    const newTrackPosition = Math.floor(length * startingWidthPercentage / 100);
    context.setState({
      trackProgress: newTrackPosition,
      mouseDown: true,
    });
  }

  function onMouseMove(e) {
    if (!isMouseDown) return;
    const { length } = store.getState().trackData;
    const mousePositionCurrent = e.clientX;

    const deltaXPercentage = (mousePositionCurrent - mousePositionStart) / progressBar.offsetWidth * 100;
    percentBuffered = startingWidthPercentage + deltaXPercentage;
    if (percentBuffered < 0) percentBuffered = 0;
    if (percentBuffered > 100) percentBuffered = 100;

    const newTrackPosition = Math.floor(length * percentBuffered / 100);
    context.setState({ trackProgress: newTrackPosition });

    progressBarProgress.style.width = `${percentBuffered}%`;
    progressBarSlider.style.left = `${percentBuffered}%`;
  }

  function onMouseUp(e) {
    if (!isMouseDown) return;
    const { length } = store.getState().trackData;
    const mousePositionCurrent = e.clientX;

    const deltaXPercentage = (mousePositionCurrent - mousePositionStart) / progressBar.offsetWidth * 100;
    percentBuffered = startingWidthPercentage + deltaXPercentage;
    if (percentBuffered < 0) percentBuffered = 0;
    if (percentBuffered > 100) percentBuffered = 100;

    const newTrackPosition = Math.floor(length * percentBuffered / 100);
    context.setState({
      trackProgress: newTrackPosition,
      mouseDown: false,
    });
    store.dispatch(seekTrack(newTrackPosition));

    isMouseDown = false;
  }

  element.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

export const addEventListeners = (context) => {
  const progressBar = document.querySelector('.progress-bar-clickable');
  draggable(progressBar, context);
};

export const updateProgressBar = (context) => {
  const progressBar = document.querySelector('.progress-bar-progress');
  const progressBarSlider = document.querySelector('.progress-bar-slider');

  const { startTimestamp, totalTimePaused, seekDistance, length } = store.getState().trackData;
  const progressPercentage = (Date.now() - startTimestamp - totalTimePaused + seekDistance) / length * 100;
  if (progressPercentage < 100 && !context.state.mouseDown) {
    progressBar.style.width = (`${progressPercentage}%`);
    progressBarSlider.style.left = (`${progressPercentage}%`);
    const trackProgress = (length * progressPercentage) / 100;
    context.setState({ trackProgress });
  } else if (progressPercentage >= 100 && !context.state.mouseDown) {
    progressBar.style.width = ('0%');
    progressBarSlider.style.left = ('0%');
    context.setState({ trackProgress: 0 });
  }
};
