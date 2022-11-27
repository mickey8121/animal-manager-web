import { useTranslation } from 'react-i18next';

import { camelCase } from 'lodash';

import Input from 'components/common/form/Input';
import DatePicker from 'components/common/form/DatePicker';

import { AnimalStatus, Maybe, AnimalSex } from 'generated/graphql';
import InputSkeleton from 'components/common/skeletons/form/InputSkeleton';

interface Props {
  status?: Maybe<AnimalStatus>;
  sex?: Maybe<AnimalSex>;
  loading?: boolean;
}

const StatusInput = ({ status, sex, loading }: Props): JSX.Element | null => {
  const { t } = useTranslation();

  switch (status) {
    case AnimalStatus.Deceased: {
      return loading ? (
        <InputSkeleton />
      ) : (
        <DatePicker name='deathDate' label={t('animals.deathDate')} />
      );
    }

    case AnimalStatus.Transferred: {
      return (
        <Input
          loading={loading}
          name='transferredTo'
          label={t('animals.transferredTo', { context: camelCase(sex ?? '') })}
          placeholder={t('animals.transferredTo', { context: camelCase(sex ?? '') })}
        />
      );
    }

    case AnimalStatus.Sold: {
      return loading ? (
        <InputSkeleton />
      ) : (
        <DatePicker name='saleDate' label={t('animals.saleDate')} />
      );
    }

    case AnimalStatus.Other: {
      return (
        <Input
          loading={loading}
          name='statusNotes'
          label={t('animals.statusNotes')}
          placeholder={t('animals.statusNotes')}
        />
      );
    }

    default:
      return null;
  }
};

export default StatusInput;
