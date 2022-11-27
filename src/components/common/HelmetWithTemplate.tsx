import { FC } from 'react';
import Helmet from 'react-helmet';

import app from 'helpers/app';

interface Props {
  title: string;
  showTemplate?: boolean;
}

const HelmetWithTemplate: FC<Props> = ({ title, showTemplate = true }) => (
  <Helmet titleTemplate={showTemplate ? `${app.appTitle} | %s` : undefined} title={title} />
);

export default HelmetWithTemplate;
