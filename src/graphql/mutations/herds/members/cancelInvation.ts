import { gql } from '@apollo/client';

const CANCEL_INVITATION = gql`
  mutation cancelInvitation($where: WhereUniqueHerdInvitationInput!) {
    cancelInvitation(where: $where) {
      id
      recipientEmail
    }
  }
`;

export default CANCEL_INVITATION;
