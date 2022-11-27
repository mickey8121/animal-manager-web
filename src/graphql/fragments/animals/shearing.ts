import { gql } from '@apollo/client';

const SHEARING_FRAGMENT = gql`
  fragment shearingFragment on Shearing {
    id
    coloration
    comfortFactor
    createdAt
    curvature
    date
    density
    deviation
    fibresPercentage
    length
    micron
    shearing
    shearingAge
    variation
    weight
  }
`;

export default SHEARING_FRAGMENT;
