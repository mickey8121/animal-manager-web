import { FC, Fragment, useCallback, useMemo, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import camelCase from 'lodash/camelCase';
import isNil from 'lodash/isNil';
import toast from 'react-hot-toast';

import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import Header from 'components/common/Header';
import Button from 'components/common/buttons/Button';
import Loading from 'components/common/Loading';

import useUser from 'hooks/user/useUser';
import useLoadingToast from 'hooks/notifications/useLoadingToast';
import useUpgradeSubscription from 'hooks/useUpgradeSubscription';

import app from 'helpers/app';
import { BillingPlan, useBillingPlansQuery } from 'generated/graphql';

interface ExtendedBillingPlan extends Omit<BillingPlan, 'id' | 'price'> {
  id: string | null;
  price: number | null;
  visiblePrice?: string;
  description?: string;
  advantages?: string[];
  isCurrentPlan?: boolean;
}

const additionalPlans = [
  {
    id: null,
    name: 'Alpaca Associations',
    price: null,
    visiblePrice: 'Per member subscription',
  },
  {
    id: null,
    name: 'Developer',
    price: null,
    visiblePrice: 'Let’s have a chat',
  },
];

const AccountPage: FC = () => {
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const { subscription } = useUser() ?? {};

  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const { data: { billingPlans = [] } = {}, loading } = useBillingPlansQuery();
  const { upgradeSubscription, loading: upgradeSubscriptionLoading } = useUpgradeSubscription();

  useLoadingToast(upgradeSubscriptionLoading);

  const plans = useMemo(
    () =>
      [...billingPlans, ...additionalPlans]?.map(
        ({ price, name, ...plan }: ExtendedBillingPlan) => {
          const serviceName = camelCase(name).replace(/sheep|llama/gi, 'alpaca'); // in locales we used alpacaBreeder, alpacaAssociations and etc keys
          const appNameTranslated = t(`animals.${app.appName}`);

          const commonLocaleOptions = {
            appName: appNameTranslated,
            appNameLowerCase: appNameTranslated.toLowerCase(),
            herd: t(app.appName === 'sheep' ? 'herds.flock' : 'herds.herd').toLowerCase(),
            appNameLowerAccusativeCase: t(`animals.accusativeCase.${app.appName}s`).toLowerCase(), // for RU
          };

          const visiblePrice = t(
            `billingPlans.prices.${
              (plan.visiblePrice && camelCase(`${plan.visiblePrice}`)) ||
              (price === 0 ? 'freeForEveryone' : 'perMonth')
            }`,
            { context: `$${price}` },
          );

          return {
            ...plan,
            name: t(`billingPlans.names.${serviceName}`, commonLocaleOptions),
            price,
            visiblePrice,
            description: t(`billingPlans.descriptions.${serviceName}`, commonLocaleOptions),
            advantages: t(`billingPlans.advantages.${serviceName}`, {
              ...commonLocaleOptions,
              herds: t(app.appName === 'sheep' ? 'herds.flocks' : 'herds.herds').toLowerCase(),
              // for RU
              herdsGenitiveCase: t(
                `herds.genitiveCase.${app.appName === 'sheep' ? 'flocks' : 'herds'}`,
              ).toLowerCase(),

              joinArrays: '---', // to make the passed variables work correctly
            }).split('---'),
            isCurrentPlan: plan.id && plan.id === subscription?.plan.id,
          };
        },
      ),
    [billingPlans, subscription?.plan.id, t],
  );

  const handleChoosePlan = useCallback(
    id => () => {
      if (!id) toast.success(`${t('common.commingSoon')} ;)`);
      else if (id === subscription?.plan.id)
        toast.error(t('billingPlans.thisIsAlreadyUrCurrentPlan'));
      else if (!upgradeSubscriptionLoading) {
        setLoadingPlanId(id);
        upgradeSubscription(id).catch(err => {
          setLoadingPlanId(null);
          toast.error(err.message);
        });
      }
    },
    [subscription?.plan.id, t, upgradeSubscription, upgradeSubscriptionLoading],
  );

  if (loading) return <Loading page />;

  return (
    <Fragment>
      <HelmetWithTemplate title='Account' />

      <div className='page account'>
        <Header
          center
          text={t('billingPlans.accountPageHeader.text')}
          subText={t('billingPlans.accountPageHeader.subText')}
        />

        <Button
          color='secondary'
          className='btn btn-transparent account-close-btn'
          onClick={goBack}
        >
          {t('common.close')}
        </Button>

        <div className='page-body'>
          <div className='subscription-plans'>
            {plans.map(({ id, isCurrentPlan, advantages, ...plan }) => (
              <div key={id || plan.name} className='subscription-plan-item'>
                <div className='plan-main-info'>
                  <div className='plan-name'>{plan.name}</div>
                  <div className='plan-price'>{plan.visiblePrice}</div>
                  <div className='plan-description'>{plan.description}</div>
                  <Button
                    color='primary'
                    className='plan-btn'
                    loading={!!id && loadingPlanId === id}
                    onClick={handleChoosePlan(id)}
                  >
                    {(isCurrentPlan && t('common.currentPlan')) ||
                      (!isNil(plan.price) ? t('common.upgrade') : t('common.findOutMore'))}
                  </Button>
                </div>

                {advantages && (
                  <div className='plan-advantages'>
                    {advantages.map(item => (
                      <div key={item} className='plan-advantages-item'>
                        <div className='plan-advantages-item-icon' />
                        <span className='plan-advantages-item-text'>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AccountPage;
