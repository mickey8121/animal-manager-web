import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import Select, { Target } from 'components/common/select/Select';

import { LANGUAGES } from 'helpers/constants';

const SelectLanguage: FC = () => {
  const { i18n } = useTranslation();

  const handleChange = ({ target: { value } }: Target): void => {
    if (value) void i18n.changeLanguage(value);
  };

  return (
    <div className='select-language'>
      <Select
        name='language'
        options={LANGUAGES}
        initialValue='en'
        onChange={handleChange}
        value={i18n.language.slice(0, 2)}
        menuPlacement='top'
        className='select'
      />
    </div>
  );
};

export default SelectLanguage;
