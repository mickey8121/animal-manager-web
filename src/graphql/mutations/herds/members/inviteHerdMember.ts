import { gql } from '@apollo/client';
import USER_FRAGMENT from 'graphql/fragments/user/user';

const INVITE_HERD_MEMBER = gql`
  mutation inviteHerdMember($data: InviteHerdMemberInput!) {
    inviteHerdMember(data: $data) {
      __typename
      ... on HerdInvitation {
        id
        recipientEmail
        status
        tokenExpiresAt
        createdAt
        updatedAt
      }
      ... on HerdMember {
        id
        role
        user {
          ...userFragment
        }
        createdAt
        updatedAt
      }
    }
  }
  ${USER_FRAGMENT}
`;

export default INVITE_HERD_MEMBER;
