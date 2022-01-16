/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export async function bookTour(tourId) {
  const stripe = Stripe('pk_test_n6lEY7VWU8DxDphMj7XBFfWn00oMGSEUnm');

  // 1) Get checkout session from API
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
  // 2) Create checkout form + charge credit card
}
