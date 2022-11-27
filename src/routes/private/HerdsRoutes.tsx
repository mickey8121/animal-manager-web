import { FC } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import HerdsPage from 'pages/private/HerdsPage';
import HerdPage from 'pages/private/HerdPage';
import CreateAnimalPage from 'pages/private//CreateAnimalPage';
import AnimalPage from 'pages/private/AnimalPage';

import { HERDS_ROUTE } from 'helpers/constants';

const HerdsRoutes: FC = () => (
  <Switch>
    <Route exact path={`/${HERDS_ROUTE}`} component={HerdsPage} />
    <Route exact path={`/${HERDS_ROUTE}/:herdId`} component={HerdPage} />
    <Route exact path={`/${HERDS_ROUTE}/:herdId/create-animal`} component={CreateAnimalPage} />

    <Route path={`/${HERDS_ROUTE}/:herdId/:animalId/:tabName`} component={AnimalPage} />

    <Route render={() => <Redirect to='/herds' />} />
  </Switch>
);

export default HerdsRoutes;
