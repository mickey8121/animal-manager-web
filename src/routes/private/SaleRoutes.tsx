import { FC } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import AlpacasForSale from 'pages/private/AlpacasForSale';
import AlpacaForSale from 'pages/private/AlpacaForSale';

const SaleRoutes: FC = () => (
  <Switch>
    <Route exact path='/sale' component={AlpacasForSale} />
    <Route exact path='/sale/:id' component={AlpacaForSale} />

    <Route render={() => <Redirect to='/sale' />} />
  </Switch>
);

export default SaleRoutes;
