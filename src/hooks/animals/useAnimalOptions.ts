import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import map from 'lodash/map';
import camelCase from 'lodash/camelCase';

import { Option } from 'components/common/select/Select';

import { AnimalStatus, AnimalSex, Maybe, AlpacaPhenotype } from 'generated/graphql';

interface useAnimalOptionsResult {
  animalStatusOptions: Option[];
  forSaleStatusOptions: Option[];
  animalSexOptions: Option[];
  phenotypeOptions: Option[];
}

// temporarily while we wait for the api
const ForSaleStatus = {
  ForSale: 'FOR_SALE',
  NotForSale: 'NOT_FOR_SALE',
  FreeToAGoodHome: 'FREE_TO_A_GOOD_HOME',
};

const useAnimalOptions = (sex?: Maybe<string>): useAnimalOptionsResult => {
  const { t } = useTranslation();

  const animalStatusOptions = useMemo(
    () =>
      map(AnimalStatus, (value, key) => ({
        value,
        label: t(`animals.statusOptions.${camelCase(key)}`, {
          context: camelCase(sex ?? ''),
        }),
      })),
    [sex, t],
  );

  const forSaleStatusOptions = useMemo(
    () =>
      map(ForSaleStatus, (value, key) => ({
        value,
        label: t(`animals.forSaleStatusOptions.${camelCase(key)}`),
      })),
    [t],
  );

  const animalSexOptions = useMemo(
    () =>
      map(AnimalSex, (value, key) => ({
        value,
        label: t(`animals.sexOptions.${camelCase(key)}`),
      })),
    [t],
  );

  const phenotypeOptions = useMemo(
    () =>
      map(AlpacaPhenotype, (value, key) => ({
        value,
        label: key,
      })),
    [],
  );

  return {
    animalStatusOptions,
    forSaleStatusOptions,
    animalSexOptions,
    phenotypeOptions,
  };
};

export default useAnimalOptions;
