import { useEffect, useState } from "react";
import { initStripe } from "@stripe/stripe-react-native";

import { APPLE_MERCHANT_ID, STRIPE_PUBLISHABLE_KEY } from "@constants/config";

export function useStripePayment() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function initialize() {
      await initStripe({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
        merchantIdentifier: APPLE_MERCHANT_ID,
      });
      setConnected(true);
    }

    initialize();
  }, []);

  return { connected };
}
