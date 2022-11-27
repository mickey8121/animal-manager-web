import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Option } from 'components/common/select/Select';

import { INITIAL_ANIMAL_COLORS } from 'helpers/constants';

const useAnimalColors = (): Option[] => {
  const { t } = useTranslation();

  const ColorOptions = useMemo(
    () =>
      INITIAL_ANIMAL_COLORS.map(color => {
        return { value: color, label: t(`animals.colors.${color}`) };
      }),
    [t],
  );

  return ColorOptions;
};

export default useAnimalColors;
