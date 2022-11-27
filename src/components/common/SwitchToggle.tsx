import { FC, memo } from 'react';
import Switch, { ReactSwitchProps } from 'react-switch';

import app from 'helpers/app';

const checkedIcon = (isCheckedIcon = true): JSX.Element => (
  <div style={{ width: '100%', textAlign: 'center', lineHeight: '31px', color: '#fff' }}>
    {isCheckedIcon ? 'I' : 0}
  </div>
);

const SwitchToggle: FC<ReactSwitchProps> = props => (
  <div>
    <Switch
      width={51}
      height={31}
      handleDiameter={27}
      borderRadius={16}
      offColor='#888'
      onColor={app.themeAccentColor}
      checkedIcon={checkedIcon()}
      uncheckedIcon={checkedIcon(false)}
      activeBoxShadow={`0px 0px 2px 3px ${app.themeAccentColor}`}
      {...props}
    />
  </div>
);

export default memo(SwitchToggle);
