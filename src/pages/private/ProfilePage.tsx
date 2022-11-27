import { FC, Fragment } from 'react';

import { useTranslation } from 'react-i18next';

import Avatar from 'react-avatar';

import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import Header from 'components/common/Header';
import LogoutButton from 'components/common/buttons/LogoutButton';
import MySubscription from 'components/common/MySubscription';
import PopupGetAccess from 'components/common/PopupGetAccess';
import withErrorBoundary from 'components/common/sentry/withErrorBoundary';

import PersonalForm from 'components/profile/PersonalForm';
import BreederForm from 'components/profile/BreederForm';
import ChangePasswordForm from 'components/profile/ChangePasswordForm';

import useUser from 'hooks/user/useUser';
import useGreeting from 'hooks/useGreeting';
import useUserName from 'hooks/user/useUserName';

const userGroups = ['AANZ Administrator', 'AANZ Member', 'Show Convenor', 'Fleece Processor'];

const ProfilePage: FC = () => {
  const { t } = useTranslation();
  const user = useUser();
  const userName = useUserName();
  const greeting = useGreeting();

  return (
    <Fragment>
      <HelmetWithTemplate title={t('profile.profile')} />

      <div className='page profile'>
        <Header text={t('profile.profile')}>
          <LogoutButton />
        </Header>

        <div className='profile-info'>
          <Avatar className='avatar profile-avatar' src='' name={userName} />
          <div className='profile-info-text'>
            <h2 className='profile-greeting'>
              {t(`profile.${greeting}`)}
              <span className='profile-greeting-span'>{` ${userName}`}</span>
            </h2>
            <p className='profile-email'>{user?.email}</p>
          </div>
        </div>
        <ul className='profile-group-list'>
          {userGroups.map(item => (
            <li className='profile-group-list-item' key={item}>
              {item}
            </li>
          ))}
        </ul>

        <div className='page-body'>
          <PersonalForm />
          <BreederForm />
          <ChangePasswordForm />
          <aside className='profile-aside'>
            <MySubscription />
            <PopupGetAccess />
          </aside>
        </div>
      </div>
    </Fragment>
  );
};

export default withErrorBoundary(ProfilePage);
