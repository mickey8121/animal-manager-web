import { gql } from '@apollo/client';

import ANIMAL_MAIN_FRAGMENT from 'graphql/fragments/animals/animalMain';
import HERD_MAIN_FRAGMENT from 'graphql/fragments/herdMain';

const HERD_FRAGMENT = gql`
  fragment herdFragment on Herd {
    ...herdMainFragment

    members {
      id
      role
      user {
        id
        email
      }
    }

    images {
      id
      name
      thumbUrl
      url
      updatedAt
    }

    invitations {
      id
      recipientEmail
    }

    animals {
      ...animalMainFragment
    }
  }

  ${ANIMAL_MAIN_FRAGMENT}
  ${HERD_MAIN_FRAGMENT}
`;

export default HERD_FRAGMENT;
