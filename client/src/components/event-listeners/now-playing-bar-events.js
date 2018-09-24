import store from '../../../../store/store';
import serverDate from '../../../../helpers/serverDate';
import { seekTrack, adjustVolume } from '../../../../actions/trackActions';

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
    const { length } = store.getState().playingContext;
    mousePositionStart = e.clientX;
    startingWidthPercentage = e.offsetX / progressBar.offsetWidth * 100;

    progressBarProgress.style.width = `${startingWidthPercentage}%`;
    progressBarSlider.style.left = `${startingWidthPercentage}%`;

    let newTrackPosition = Math.floor(length * startingWidthPercentage / 100);
    if (newTrackPosition < 0) newTrackPosition = 0;
    context.setState({
      trackProgress: newTrackPosition,
      mouseDown: true,
    });
  }

  function onMouseMove(e) {
    if (!isMouseDown) return;
    const { length } = store.getState().playingContext;
    const mousePositionCurrent = e.clientX;

    const deltaXPercentage = (mousePositionCurrent - mousePositionStart) / progressBar.offsetWidth * 100;
    percentBuffered = startingWidthPercentage + deltaXPercentage;
    if (percentBuffered < 0) percentBuffered = 0;
    if (percentBuffered > 100) percentBuffered = 100;

    let newTrackPosition = Math.floor(length * percentBuffered / 100);
    if (newTrackPosition < 0) newTrackPosition = 0;
    context.setState({ trackProgress: newTrackPosition });

    progressBarProgress.style.width = `${percentBuffered}%`;
    progressBarSlider.style.left = `${percentBuffered}%`;
  }

  function onMouseUp(e) {
    if (!isMouseDown) return;
    const { length } = store.getState().playingContext;
    const mousePositionCurrent = e.clientX;

    const deltaXPercentage = (mousePositionCurrent - mousePositionStart) / progressBar.offsetWidth * 100;
    percentBuffered = startingWidthPercentage + deltaXPercentage;
    if (percentBuffered < 0) percentBuffered = 0;
    if (percentBuffered > 100) percentBuffered = 100;

    let newTrackPosition = Math.floor(length * percentBuffered / 100);
    if (newTrackPosition < 0) newTrackPosition = 0;
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

function draggableVolume(element) {
  const volumeBar = element;
  const volumeBarProgress = volumeBar.children[0].children[0];
  const volumeBarSlider = volumeBar.children[0].children[1];

  let isMouseDown = false;
  let startingWidthPercentage;
  let mousePositionStart;
  let volumePercentage;

  function onMouseDown(e) {
    isMouseDown = true;
    mousePositionStart = e.clientX;
    startingWidthPercentage = e.offsetX / volumeBar.offsetWidth * 100;

    volumeBarProgress.style.width = `${startingWidthPercentage}%`;
    volumeBarSlider.style.left = `${startingWidthPercentage}%`;
  }

  function onMouseMove(e) {
    if (!isMouseDown) return;
    const mousePositionCurrent = e.clientX;

    const deltaXPercentage = (mousePositionCurrent - mousePositionStart) / volumeBar.offsetWidth * 100;
    volumePercentage = startingWidthPercentage + deltaXPercentage;
    if (volumePercentage < 0) volumePercentage = 0;
    if (volumePercentage > 100) volumePercentage = 100;

    volumeBarProgress.style.width = `${volumePercentage}%`;
    volumeBarSlider.style.left = `${volumePercentage}%`;
  }

  function onMouseUp(e) {
    if (!isMouseDown) return;
    const mousePositionCurrent = e.clientX;

    const deltaXPercentage = (mousePositionCurrent - mousePositionStart) / volumeBar.offsetWidth * 100;
    volumePercentage = startingWidthPercentage + deltaXPercentage;
    if (volumePercentage < 0) volumePercentage = 0;
    if (volumePercentage > 100) volumePercentage = 100;
    isMouseDown = false;

    store.dispatch(adjustVolume(Math.ceil(volumePercentage)));
  }

  element.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function devicesMenuHandler() {
  const devicesMenu = document.querySelector('.devices-menu');
  const { devices } = store.getState();
  if (devices) {
    devices.find(device => device.is_active === true)
      ? devicesMenu.style.display = 'block'
      : devicesMenu.style.display = 'none';
  }

  document.addEventListener('click', (e) => {
    if (e.target === document.querySelector('.btn-devices') || e.target === document.querySelector('.icon-devices')) {
      if (devicesMenu.style.display === 'none') {
        devicesMenu.style.display = 'block';
      } else {
        devicesMenu.style.display = 'none';
      }
    } else {
      devicesMenu.style.display = 'none';
    }
  });
}
export const addEventListeners = (context) => {
  const progressBar = document.querySelector('.progress-bar-clickable');
  const volumeBar = document.querySelector('.volume-bar-clickable');
  draggable(progressBar, context);
  draggableVolume(volumeBar);
  devicesMenuHandler();
};

export const updateProgressBar = (context) => {
  const progressBar = document.querySelector('.progress-bar-progress');
  const progressBarSlider = document.querySelector('.progress-bar-slider');

  const { startTimestamp, totalTimePaused, seekDistance, length } = store.getState().playingContext;
  const progressPercentage = (serverDate.now() - startTimestamp - totalTimePaused + seekDistance) / length * 100;
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
