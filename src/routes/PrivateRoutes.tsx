import { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HerdsRoutes from 'routes/private/HerdsRoutes';
import ProfilePage from 'pages/private/ProfilePage';
import AccountPage from 'pages/private/AccountPage';
import NotesRoutes from 'routes/private/NotesRoutes';
import SaleRoutes from 'routes/private/SaleRoutes';

import Layout from 'components/layout/Layout';
import UserListener from 'components/common/UserListener';
import UnderDevelopmentPlug from 'components/common/UnderDevelopmentPlug';

import useGATracker from 'hooks/useGATracker';
import useScrollToTop from 'hooks/useScrollToTop';

import HerdsProvider from 'providers/HerdsProvider';

import { HERDS_ROUTE } from 'helpers/constants';

const AppRouter: React.FC = () => {
  const { pageView, getTimings } = useGATracker();

  useScrollToTop();

  useEffect(() => {
    if (document.title !== 'Loading') {
      pageView();
      getTimings();
    }
  }, [getTimings, pageView]);

  return (
    <HerdsProvider>
      <Layout>
        <Switch>
          <Route path={`/${HERDS_ROUTE}`} component={HerdsRoutes} />
          <Route path='/notes' component={NotesRoutes} />
          <Route exact path='/profile' component={ProfilePage} />
          <Route exact path='/account' component={AccountPage} />
          <Route path='/sale' component={SaleRoutes} />

          <Route
            exact
            path={['/admin', '/partnership', '/convenor', '/fleece']}
            component={UnderDevelopmentPlug}
          />

          <Route render={() => <Redirect to={`/${HERDS_ROUTE}`} />} />
        </Switch>

        <UserListener />
      </Layout>
    </HerdsProvider>
  );
};

export default AppRouter;
