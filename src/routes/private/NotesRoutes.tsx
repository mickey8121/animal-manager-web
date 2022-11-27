import { FC } from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import NotesPage from 'pages/private/NotesPage';

const NotesRoutes: FC = () => (
  <Switch>
    <Route exact path='/notes' component={NotesPage} />

    <Route render={() => <Redirect to='/notes' />} />
  </Switch>
);

export default NotesRoutes;
