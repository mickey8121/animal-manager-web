import { FC, Fragment, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import TabsRoutes, { TabData } from 'routes/TabsRoutes';

import Header from 'components/common/Header';
import Loading from 'components/common/Loading';
import ButtonGoBack from 'components/common/buttons/ButtonGoBack';
import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import withErrorBoundary from 'components/common/sentry/withErrorBoundary';
import EmptyPage from 'components/common/EmptyPage';
import AnimalProfileInfo from 'components/animals/AnimalProfileInfo';

import ProfileTab from 'pages/private/animalTabs/ProfileTab';
import AanzTab from 'pages/private/animalTabs/AanzTab';
import SaleTab from 'pages/private/animalTabs/SaleTab';
import ShearingTab from 'pages/private/animalTabs/ShearingTab';
import WeightTab from 'pages/private/animalTabs/WeightTab';
import NotesTab from 'pages/private/animalTabs/NotesTab';
import MedicationTab from 'pages/private/animalTabs/MedicationTab';

import useAnimal from 'hooks/animals/animal/useAnimal';

import AnimalProvider from 'providers/AnimalProvider';

import app from 'helpers/app';
import { HERDS_ROUTE, IS_ALPACA } from 'helpers/constants';

import {
  useMedicationRemindersQuery,
  OrderDirection,
  MedicationOrderField,
} from 'generated/graphql';
import DataProvider from 'providers/DataProvider';

const AnimalPage: FC = () => {
  const { t } = useTranslation();
  const { herdId, tabName } = useParams<{ herdId: string; tabName: string }>();
  const { animal, loading } = useAnimal();

  const { data, refetch } = useMedicationRemindersQuery({
    variables: {
      where: { medication: { animalId: animal?.id ?? '' } },
      orderBy: { direction: OrderDirection.Desc, field: MedicationOrderField.Date },
    },
  });

  const tabsData: TabData[] = useMemo(() => {
    const onlyAlpacaTabs = [
      { key: 'aanz', title: 'AANZ', component: AanzTab },
      { key: 'sale', title: t('animals.sale'), component: SaleTab },
    ];

    const commonTabs = [
      { key: 'profile', title: t('animals.profile'), component: ProfileTab },
      { key: 'weight', title: t('animals.weight.weight'), component: WeightTab },
      { key: 'shearing', title: t('animals.shearing.shearing'), component: ShearingTab },
      { key: 'notes', title: t('notes.notes'), component: NotesTab },
      {
        key: 'medication',
        title: t('animals.medication.medication'),
        component: MedicationTab,
      },
    ];

    return IS_ALPACA ? [...commonTabs, ...onlyAlpacaTabs] : commonTabs;
  }, [t]);

  const [selectedTab, setSelectedTab] = useState(tabsData.find(({ key }) => key === tabName));

  /* CASE: when we change herd in an animal, we change the herdId in the url to a new herdId,
  but when the user clicks back he expects to go back to the previous herd */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const backPath = useMemo(() => `/${HERDS_ROUTE}/${herdId}`, []);
  const headerText = useMemo(() => animal?.name ?? t(`animals.${app.appName}`), [animal, t]);

  const onChangeTab = useCallback((tabData: TabData): void => setSelectedTab(tabData), []);

  if (!animal) {
    if (loading) return <Loading page />;

    return (
      <EmptyPage
        description={`${t(`animals.${app.appName}`)} ${t('common.notFound', {
          context: 'female',
        }).toLocaleLowerCase()} 😢`}
        title={t('common.notFound', {
          context: 'female',
        })}
      />
    );
  }

  return (
    <DataProvider value={{ data, refetchReminders: refetch }}>
      <AnimalProvider animal={animal} loading={loading}>
        <Fragment>
          <HelmetWithTemplate title={`${headerText} | ${selectedTab?.title}`} />

          <div className='page animal'>
            <Header text={headerText}>
              <ButtonGoBack color='light' backPath={backPath} />
            </Header>

            <div className='page-body with-tabs'>
              <AnimalProfileInfo />

              <TabsRoutes
                rootPath={`/${HERDS_ROUTE}/:herdId/:animalId`}
                tabsData={tabsData}
                redirect={{
                  to: `/${HERDS_ROUTE}/:herdId/:animalId/profile`,
                }}
                onChange={onChangeTab}
              />
            </div>
          </div>
        </Fragment>
      </AnimalProvider>
    </DataProvider>
  );
};

export default withErrorBoundary(AnimalPage);
