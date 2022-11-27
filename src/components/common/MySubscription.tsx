import { FC, useMemo, useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import Button from 'components/common/buttons/Button';

import useUser from 'hooks/user/useUser';
import useFormat from 'hooks/useFormat';
import useUpgradeSubscription from 'hooks/useUpgradeSubscription';

import app from 'helpers/app';
import { BILLING_PLANS } from 'helpers/constants';

import { useBillingPlansQuery, useCreateCustomerPortalSessionMutation } from 'generated/graphql';

const MySubscription: FC = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormat();
  const { data: { billingPlans = [] } = {}, loading: billingPlansLoading } = useBillingPlansQuery();
  const { upgradeSubscription, loading: upgradeSubscriptionLoading } = useUpgradeSubscription();
  const [customerPortal] = useCreateCustomerPortalSessionMutation();
  const { subscription } = useUser() || {};

  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async (): Promise<void> => {
    setLoading(true);

    if (!subscription?.currentPeriodEnd) {
      const planForUpgrade = billingPlans.find(plan => plan.name === BILLING_PLANS.breeder)?.id;

      if (planForUpgrade) return void upgradeSubscription(planForUpgrade);
    }

    try {
      const { data } = await customerPortal();

      if (data) window.location.href = data.createCustomerPortalSession;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [billingPlans, customerPortal, subscription?.currentPeriodEnd, upgradeSubscription]);

  const cancelDate = useMemo(() => {
    if (!subscription?.cancelAtPeriodEnd) return null;

    const currentDate = (formatDate(subscription.currentPeriodEnd, 'd-MMMM-yyyy') as string).split(
      '-',
    );

    return {
      day: currentDate[0],
      month: currentDate[1],
      year: currentDate[2],
    };
  }, [subscription, formatDate]);

  const planName = useMemo(() => {
    if (subscription?.plan.name) {
      return t(`profile.animal${subscription.plan.name.split(' ')[1]}`, {
        context: app.appName,
      });
    }

    return t('profile.freePlan');
  }, [subscription, t]);

  const buttonText = useMemo(() => {
    if (!subscription?.currentPeriodEnd) return t('common.upgrade');

    return subscription?.cancelAtPeriodEnd ? t('common.renew') : t('common.manage');
  }, [subscription, t]);

  return (
    <div className='my-sub'>
      <p className='my-sub-text'>
        <span className='my-sub-span'>{t('profile.mySubscription')}</span>
        {planName}
      </p>
      {cancelDate && (
        <p className='my-sub-cancel'>{t('subscription.yourPlanCancelAt', cancelDate)}</p>
      )}
      <Button
        className='btn btn-cancel-sub'
        onClick={handleClick}
        loading={loading || billingPlansLoading || upgradeSubscriptionLoading}
        color='primary'
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default MySubscription;
