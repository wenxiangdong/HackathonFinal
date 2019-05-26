export default function debounce(method, time) {
  var timerId = null;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      method(...args);
    }, time)
  }
}
