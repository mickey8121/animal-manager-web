import { FC, useMemo } from 'react';

import classnames from 'classnames';

interface Props {
  change: string;
}

const WeightChangePin: FC<Props> = ({ change }) => {
  const parsedChangeValue = useMemo(() => parseInt(change, 10), [change]);

  const changeArrow = useMemo(() => {
    if (!parsedChangeValue) return '';

    if (parsedChangeValue > 0) return '↑';

    return '↓';
  }, [parsedChangeValue]);

  const className = useMemo(() => {
    if (!parsedChangeValue) return 'neutral';

    if (parsedChangeValue > 0) return 'positive';

    return 'negative';
  }, [parsedChangeValue]);

  return (
    <p className={classnames('weight-change-cell', className)}>{`${changeArrow} ${change}`}</p>
  );
};

export default WeightChangePin;
