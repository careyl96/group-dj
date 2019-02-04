export default () => {
  self.addEventListener('message', (e) => { // eslint-disable-line no-restricted-globals
    setInterval(() => postMessage('tick'), 300);
  });
};
