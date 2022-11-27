import useUser from 'hooks/user/useUser';

const useUserName = (): string => {
  const user = useUser();

  if (!user) return '';

  if (user?.firstName || user?.lastName)
    return `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  if (user.email) return user.email.slice(0, user.email.indexOf('@')).split('.').join(' ');

  return '';
};

export default useUserName;
