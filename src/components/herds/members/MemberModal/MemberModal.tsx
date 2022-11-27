import { FC, useMemo } from 'react';

import isEmpty from 'lodash/isEmpty';

import Modal from 'components/common/Modal';
import MemberControl from 'components/herds/members/MemberModal/MemberControl';
import AddMemberForm from 'components/herds/members/MemberModal/AddMemberForm';

import { HerdFragmentFragment, HerdMemberRole } from 'generated/graphql';

interface Props {
  show: boolean;
  herd?: HerdFragmentFragment;
  toggle: () => void;
}

const MemberModal: FC<Props> = ({ show, toggle, herd }) => {
  const { members, invitations } = herd || {};
  const hasMembers = useMemo(
    (): boolean =>
      (members?.length !== 1 || !isEmpty(invitations)) &&
      !!members?.find(element => element.role === HerdMemberRole.Owner),
    [invitations, members],
  );

  return (
    <Modal showCloseButton autoFocus={false} show={show} onClose={toggle} className='member-modal'>
      {hasMembers ? <MemberControl herd={herd} /> : null}
      <AddMemberForm herd={herd} />
    </Modal>
  );
};

export default MemberModal;
