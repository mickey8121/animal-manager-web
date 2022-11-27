import { useCallback, useState } from 'react';

import getStripe from 'helpers/getStripe';

import { useCreateCheckoutSessionMutation } from 'generated/graphql';

interface UseUpgradeSubscriptionResult {
  loading: boolean;
  upgradeSubscription: (planId: string) => Promise<void>;
}

const useUpgradeSubscription = (): UseUpgradeSubscriptionResult => {
  // use manual loading managment cuz getStripe doesn't provide loading props for self
  const [loading, setLoading] = useState(false);
  const [checkoutSessionRaw] = useCreateCheckoutSessionMutation();

  const upgradeSubscription = useCallback(
    async planId => {
      setLoading(true);

      try {
        const { data: checkoutData } = await checkoutSessionRaw({
          variables: {
            data: { planId },
          },
        });

        if (checkoutData) {
          const stripe = await getStripe();

          if (stripe) {
            void stripe.redirectToCheckout({
              sessionId: checkoutData.createCheckoutSession,
            });
          }
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    },
    [checkoutSessionRaw],
  );

  return { loading, upgradeSubscription };
};

export default useUpgradeSubscription;
