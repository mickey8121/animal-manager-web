import { gql } from '@apollo/client';

const REMOVE_MEMBER = gql`
  mutation removeMember($where: WhereUniqueHerdMemberInput!) {
    removeMember(where: $where) {
      id
      user {
        email
      }
    }
  }
`;

export default REMOVE_MEMBER;
