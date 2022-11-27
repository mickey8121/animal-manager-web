import { gql } from '@apollo/client';

import NOTE_FRAGMENT from 'graphql/fragments/note';

const NOTES_SUBSCRIPTION = gql`
  subscription notesSubscription($animalId: String) {
    notes(animalId: $animalId) {
      mutationType
      note {
        ...noteFragment
      }
    }
  }

  ${NOTE_FRAGMENT}
`;

export default NOTES_SUBSCRIPTION;
