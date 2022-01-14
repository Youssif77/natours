/* eslint-disable */
console.log('Hallo from parcel');
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('form');

// Delegations
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
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
