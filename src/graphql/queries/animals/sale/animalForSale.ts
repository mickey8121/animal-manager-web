import { gql } from '@apollo/client';

import SALE_FRAGMENT from 'graphql/fragments/animals/sale';

const ANIMAL_FOR_SALE = gql`
  query animalForSale($where: WhereUniqueAnimalForSaleInput!) {
    animalForSale(where: $where) {
      ...saleFragment
    }
  }

  ${SALE_FRAGMENT}
`;

export default ANIMAL_FOR_SALE;
