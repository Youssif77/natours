/* eslint-disable */

// type is 'success' or 'error'
export function showAlert(type, messgae) {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${messgae}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(hideAlert, 5000);
}

export function hideAlert(type, messgae) {
  const el = document.querySelector('.alert');
  if (el) el.remove();
}
