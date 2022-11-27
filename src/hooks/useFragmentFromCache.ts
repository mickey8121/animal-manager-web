import { DocumentNode, useApolloClient } from '@apollo/client';

type UseFragmentFromCache = (props: {
  fragment: DocumentNode;
  fragmentName?: string;
  id: string;
}) => { __typename?: string; [key: string]: any } | null;

const useFragmentFromCache: UseFragmentFromCache = props => {
  const client = useApolloClient();

  try {
    const data = client.readFragment(props);

    return data;
  } catch (error) {
    return null;
  }
};

export default useFragmentFromCache;
