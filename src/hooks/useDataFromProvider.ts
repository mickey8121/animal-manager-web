import { useContext } from 'react';

import { DataContext, DataContextValue } from 'providers/DataProvider';

const useDataFromProvider = (): DataContextValue => useContext(DataContext);

export default useDataFromProvider;
