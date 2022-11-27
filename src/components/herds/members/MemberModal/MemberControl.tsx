import { FC, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { toast } from 'react-hot-toast';

import Button from 'components/common/buttons/Button';
import { ReactComponent as XcrossIcon } from 'icons/x-cross.svg';

import useCancelInvitation from 'hooks/herds/members/useCancelInvation';
import useRemoveMember from 'hooks/herds/members/useRemoveMember';
import useUser from 'hooks/user/useUser';

import { HerdFragmentFragment, HerdMemberRole } from 'generated/graphql';

interface Props {
  herd?: HerdFragmentFragment;
}

const MemberControl: FC<Props> = ({ herd }) => {
  const { t } = useTranslation();
  const { cancelInvitation } = useCancelInvitation();
  const { removeMember } = useRemoveMember();
  const user = useUser();
  const { id: herdId = '', members, invitations } = herd || {};

  const removeMemberHandler = useCallback(
    (memberId: string): void => {
      void toast.promise(removeMember(memberId, herdId), {
        loading: t('common.deleting'),
        success: t('common.successDelete'),
        error: t('common.errorDelete'),
      });
    },
    [removeMember, herdId, t],
  );

  const cancelInvitationHandler = useCallback(
    (memberId: string): void => {
      void toast.promise(cancelInvitation(memberId, herdId), {
        loading: t('common.deleting'),
        success: t('common.successDelete', { item: t('members.members') }),
        error: t('common.errorDelete'),
      });
    },
    [cancelInvitation, herdId, t],
  );

  const getIsOwner = useCallback(
    (role, member) => {
      return role === HerdMemberRole.Owner && member?.email === user?.email;
    },
    [user?.email],
  );

  return (
    <div className='members-edit-form'>
      <h3 className='title-members-edit'>{t('members.herdMembers')}</h3>
      <ul className='member-list'>
        {members?.map(({ id, user: member, role }) => {
          if (getIsOwner(role, member)) return null;

          return (
            <li className='member-list-item' key={id}>
              <span className='member-email' title={member.email}>
                {member.email}
              </span>
              <Button className='member-remove-button' onClick={() => removeMemberHandler(id)}>
                <XcrossIcon />
              </Button>
            </li>
          );
        })}
        {invitations?.map(({ id, recipientEmail }) => (
          <li className='member-list-item' key={id}>
            <span className='member-email' title={recipientEmail}>
              {recipientEmail}
            </span>
            <Button className='member-remove-button' onClick={() => cancelInvitationHandler(id)}>
              <XcrossIcon />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberControl;
