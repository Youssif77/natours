/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export async function bookTour(tourId) {
  const stripe = Stripe('pk_test_n6lEY7VWU8DxDphMj7XBFfWn00oMGSEUnm');

  // 1) Get checkout session from API
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
