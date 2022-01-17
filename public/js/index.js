/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { bookTour } from './stripe';
import { signup, login, logout } from './auth';
import { updateSettings } from './updateSettings';
import { showAlert } from './alerts';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.querySelector('#book-tour');

// Delegations
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (signupForm) {
  signupForm.addEventListener('submit', function getFormData(e) {
    e.preventDefault();

    // Read the form inputs
    const dataArr = [...new FormData(signupForm)];
    const data = Object.fromEntries(dataArr);

    signup(data);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', function getFormData(e) {
    e.preventDefault();

    // Read the form inputs value
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async function getFormData(e) {
    e.preventDefault();
    document.querySelector('.btn--save-settings').innerHTML = 'Updating...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'data');

    document.querySelector('.btn--save-settings').textContent = 'Save settings';

    location.reload();
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async function getFormData(e) {
    e.preventDefault();

    // Read the form inputs value
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    document.querySelector('.btn--save-password').innerHTML = 'Updating...';

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').innerHTML = 'Save password';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', function createSession() {
    bookBtn.textContent = 'Processing...';
    const { tourId } = bookBtn.dataset;

    bookTour(tourId);
  });
}

const alertMessage = document.body.dataset.alert;

if (alertMessage) alertMessage('success', alertMessage, 10);
