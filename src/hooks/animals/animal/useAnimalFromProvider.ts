import { useContext } from 'react';

import { AnimalContext, AnimalContextValue } from 'providers/AnimalProvider';

const useAnimalFromProvider = (): AnimalContextValue => useContext(AnimalContext);

export default useAnimalFromProvider;
