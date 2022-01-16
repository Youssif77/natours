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

// ​session: Object { id: "cs_test_a1wtgF60tDnDC7UuFPEc3pSKGr2agScM4itSQs0Kw1Y5TjxJXdFNVDVTT7", object: "checkout.session", amount_subtotal: 149700, … }
// ​​​
// after_expiration: null
// ​​​
// allow_promotion_codes: null
// ​​​
// amount_subtotal: 149700
// ​​​
// amount_total: 149700
// ​​​
// automatic_tax: Object { enabled: false, status: null }
// ​​​
// billing_address_collection: null
// ​​​
// cancel_url: "http://127.0.0.1:3000/tour/the-park-camper"
// ​​​
// client_reference_id: "5c88fa8cf4afda39709c2961"
// ​​​
// consent: null
// ​​​
// consent_collection: null
// ​​​
// currency: "usd"
// ​​​
// customer: null
// ​​​
// customer_creation: "always"
// ​​​
// customer_details: Object { email: "laura@example.com", phone: null, tax_exempt: "none", … }
// ​​​
// customer_email: "laura@example.com"
// ​​​
// expires_at: 1642439198
// ​​​
// id: "cs_test_a1wtgF60tDnDC7UuFPEc3pSKGr2agScM4itSQs0Kw1Y5TjxJXdFNVDVTT7"
// ​​​
// livemode: false
// ​​​
// locale: null
// ​​​
// metadata: Object {  }
// ​​​
// mode: "payment"
// ​​​
// object: "checkout.session"
// ​​​
// payment_intent: "pi_3KIcBeIaCacm9vfc0w2VQT6c"
// ​​​
// payment_method_options: Object {  }
// ​​​
// payment_method_types: Array [ "card" ]
// ​​​
// payment_status: "unpaid"
// ​​​
// phone_number_collection: Object { enabled: false }
// ​​​
// recovered_from: null
// ​​​
// setup_intent: null
// ​​​
// shipping: null
// ​​​
// shipping_address_collection: null
// ​​​
// shipping_options: Array []
// ​​​
// shipping_rate: null
// ​​​
// status: "open"
// ​​​
// submit_type: null
// ​​​
// subscription: null
// ​​​
// success_url: "http://127.0.0.1:3000/"
// ​​​
// total_details: Object { amount_discount: 0, amount_shipping: 0, amount_tax: 0 }
// ​​​
// url: "https://checkout.stripe.com/pay/cs_test_a1wtgF60tDnDC7UuFPEc…Jz8ndmxrYmlgWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl"
