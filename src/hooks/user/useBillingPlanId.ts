import { useMemo } from 'react';

import app from 'helpers/app';

import { BillingPlan, Maybe } from 'generated/graphql';

const useBillingPlanId = (planName: string, plans?: BillingPlan[]): Maybe<string | undefined> =>
  useMemo(() => {
    if (!plans?.length) return null;

    return plans.find(plan => plan.name.toLowerCase() === `${app.appName} ${planName}`)?.id;
  }, [planName, plans]);

export default useBillingPlanId;
