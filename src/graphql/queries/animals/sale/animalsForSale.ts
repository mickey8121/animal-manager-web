import { gql } from '@apollo/client';

const ANIMALS_FOR_SALE = gql`
  query animalsForSale(
    $skip: Int
    $take: Int
    $orderBy: OrderByAnimalForSaleInput
    $where: WhereAnimalForSaleInput
  ) {
    animalsForSale(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
      nodes {
        id
        name
        birthday
        sex
        coloration
        type

        details {
          createdAt
        }

        images {
          id
          url
        }

        owner {
          country
        }

        profile {
          ... on AlpacaForSaleProfile {
            phenotype
          }
        }
      }
      totalCount
    }
  }
`;

export default ANIMALS_FOR_SALE;
