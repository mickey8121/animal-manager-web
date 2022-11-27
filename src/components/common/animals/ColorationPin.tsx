import { FC, memo } from 'react';

import { useTranslation } from 'react-i18next';

const ColorationPin: FC<{ coloration?: string[] | null }> = ({ coloration }) => {
  const { t } = useTranslation();

  if (!coloration?.length) return null;

  const visibleValue = t(`animals.colors.${coloration[0]}`);
  const hiddenCount = coloration.length - 1;

  return (
    <div className='coloration-pin'>
      <div className='visible-value'>{visibleValue}</div>
      {!!hiddenCount && <div className='hidden-count'>{`+${hiddenCount}`}</div>}
    </div>
  );
};

export default memo(ColorationPin);
