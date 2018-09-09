import store from '../../../../store/store';
import { seekTrack } from '../../../../actions/trackActions';

// const handleProgressBarClick = (e) => {
//   const { trackLength } = store.getState().trackData;
//   const progressBar = document.querySelector('.progress-bar-clickable');
//   const progressBarProgress = document.querySelector('.progress-bar-progress');
//   const progressBarSlider = document.querySelector('.progress-bar-slider');

//   const percentBuffered = e.offsetX / progressBar.offsetWidth;
//   const newTrackPosition = Math.floor(trackLength * percentBuffered);

//   progressBarProgress.style.width = (`${percentBuffered * 100}%`);
//   progressBarSlider.style.left = (`${percentBuffered * 100}%`);

//   console.log(`seeking to ${newTrackPosition}`);
//   store.dispatch(seekTrack(newTrackPosition));
// };

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
    mousePositionStart = e.clientX;
    startingWidthPercentage = e.offsetX / progressBar.offsetWidth * 100;
    progressBarProgress.style.width = `${startingWidthPercentage}%`;
    progressBarSlider.style.left = `${startingWidthPercentage}%`;
  }

  function onMouseMove(e) {
    if (!isMouseDown) return;

    const { trackLength } = store.getState().trackData;
    const mousePositionCurrent = e.clientX;

    const deltaXPercentage = (mousePositionCurrent - mousePositionStart) / progressBar.offsetWidth * 100;
    percentBuffered = startingWidthPercentage + deltaXPercentage;
    if (percentBuffered < 0) percentBuffered = 0;
    if (percentBuffered > 100) percentBuffered = 100;

    const newTrackPosition = Math.floor(trackLength * percentBuffered / 100);
    context.setState({ trackProgress: newTrackPosition });

    progressBarProgress.style.width = `${percentBuffered}%`;
    progressBarSlider.style.left = `${percentBuffered}%`;
  }

  function onMouseUp(e) {
    if (!isMouseDown) return;

    const { trackLength } = store.getState().trackData;
    const mousePositionCurrent = e.clientX;

    const deltaXPercentage = (mousePositionCurrent - mousePositionStart) / progressBar.offsetWidth * 100;
    percentBuffered = startingWidthPercentage + deltaXPercentage;
    if (percentBuffered < 0) percentBuffered = 0;
    if (percentBuffered > 100) percentBuffered = 100;

    const newTrackPosition = Math.floor(trackLength * percentBuffered / 100);
    context.setState({ trackProgress: newTrackPosition });

    store.dispatch(seekTrack(newTrackPosition));
    isMouseDown = false;
  }

  element.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

const addEventListeners = (context) => {
  const progressBar = document.querySelector('.progress-bar-clickable');
  draggable(progressBar, context);
};

module.exports = addEventListeners;
