import { makeVar } from '@apollo/client';

const isNotActiveOnlyCollectionVar = makeVar<Record<string, boolean>>({});

export default isNotActiveOnlyCollectionVar;
