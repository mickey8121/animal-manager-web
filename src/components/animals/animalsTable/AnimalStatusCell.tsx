import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { camelCase } from 'lodash';
import classNames from 'classnames';

const AnimalStatusCell: FC<{ status?: string; sex?: string }> = ({ status, sex = '' }) => {
  const { t } = useTranslation();

  if (!status) return null;

  return (
    <div className={classNames('animal-status-cell', { active: status === 'ACTIVE' })}>
      {t(`animals.statusOptions.${camelCase(status ?? 'other')}`, {
        context: camelCase(sex ?? ''),
      })}
    </div>
  );
};

export default AnimalStatusCell;
