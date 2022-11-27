import { useMemo } from 'react';

const useGreeting = (): string => {
  const hours = useMemo(() => new Date().getHours(), []);

  if (hours < 12 && hours >= 4) return 'goodMorning';

  if (hours >= 17 || hours < 4) return 'goodEvening';

  return 'goodAfternoon';
};

export default useGreeting;
