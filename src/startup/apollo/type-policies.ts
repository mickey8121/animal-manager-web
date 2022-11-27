import { TypePolicies } from '@apollo/client';

import isEqual from 'lodash/isEqual';

import HERD_MAIN_FRAGMENT from 'graphql/fragments/herdMain';

import { HerdMainFragmentFragment } from 'generated/graphql';

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      notes: {
        merge: false,
      },
      herds: {
        merge: (existing = [], comming, { cache }) => {
          if (!comming) return null;
          if (isEqual(existing, comming)) return existing;

          const commingRefs = comming.map((item: { __ref: string }) => item.__ref);

          const herds: HerdMainFragmentFragment[] = commingRefs.reduce(
            (acc: HerdMainFragmentFragment[], id: string) => {
              const fragment = cache.readFragment({
                fragment: HERD_MAIN_FRAGMENT,
                fragmentName: 'herdMainFragment',
                id,
              });

              if (fragment) acc.push(fragment as HerdMainFragmentFragment);

              return acc;
            },
            [],
          );

          if (!herds.length) return herds;

          const sortedHerds = herds.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          return sortedHerds.map((herd: any) => ({ __ref: `Herd:${herd?.id}` }));
        },
      },
      animals: {
        merge: false,
      },
      weights: {
        merge: false,
      },
    },
  },
  Herd: {
    fields: {
      animals: { merge: false },
      members: { merge: false },
      invitations: { merge: false },
      images: { merge: false },
    },
  },
  Animal: {
    fields: {
      images: { merge: false },
    },
  },
};

export default typePolicies;
