import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useApolloClient } from '@apollo/client';

import pick from 'lodash/pick';

import app from 'helpers/app';
import { ACCESS_TOKEN_KEY } from 'helpers/constants';
import blobToBase64 from 'helpers/image/blobToBase64';

import { Image, Maybe, useDeleteImageMutation } from 'generated/graphql';

import ANIMAL_MAIN_FRAGMENT from 'graphql/fragments/animals/animalMain';
import HERD_FRAGMENT from 'graphql/fragments/herd';

interface FetchSuccessfulResult extends Omit<Image, 'herd' | 'animal' | 'owner' | 'originalUrl'> {
  animalId: Maybe<string>;
  herdId: Maybe<string>;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

type UploadImage = (props: {
  herdId?: string;
  animalId?: string;
  image: File;
}) => Promise<FetchSuccessfulResult & Error>;
type UseUploadImage = () => { uploadImage: UploadImage; loading: boolean };

const useUploadImage: UseUploadImage = () => {
  const { t } = useTranslation();
  const client = useApolloClient();
  const [deleteImage] = useDeleteImageMutation();

  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => new Headers({ Authorization: localStorage.getItem(ACCESS_TOKEN_KEY) ?? '' }),
    [],
  );

  const uploadImage: UploadImage = useCallback(
    async ({ animalId, herdId, image }) => {
      if (image.size / 1000000 > 5) throw Error(t('errors.413')); // if > 5 MB

      setLoading(true);

      const formData = new FormData();

      if (animalId) formData.append('animalId', animalId);
      else if (herdId) formData.append('herdId', herdId);

      formData.append('file', image);

      const requestOptions = {
        method: 'POST',
        headers,
        body: formData,
      } as RequestInit;

      const result = await fetch(`${app.apiMainUrl}/images/upload`, requestOptions)
        .then(res => res.text())
        .then(res => JSON.parse(res))
        .catch(err => err);

      if (result instanceof Error) {
        setLoading(false);
        throw result;
      }

      if (result?.statusCode >= 400) {
        setLoading(false);
        throw Error(t(`errors.${result.statusCode >= 500 ? 500 : result.statusCode}`));
      }

      const uploadedImage = pick(result, ['id', 'name', 'url', 'thumbUrl', 'updatedAt']);

      if (animalId) {
        const fragmentProps = {
          fragment: ANIMAL_MAIN_FRAGMENT,
          fragmentName: 'animalMainFragment',
          id: `Animal:${animalId}`,
        };

        const animal = client.readFragment(fragmentProps);

        if (animal) {
          const { images = [] } = animal;

          if (images.length) {
            await deleteImage({ variables: { where: { id: images[images.length - 1].id } } });
          }

          const imageUrl = await blobToBase64(image);

          client.writeFragment({
            ...fragmentProps,
            data: {
              ...animal,
              images: [{ ...uploadedImage, thumbUrl: imageUrl, url: imageUrl }],
            },
          });
        }
      } else if (herdId) {
        const fragmentProps = {
          fragment: HERD_FRAGMENT,
          fragmentName: 'herdFragment',
          id: `Herd:${herdId}`,
        };

        const herd = client.readFragment(fragmentProps);

        if (herd) {
          const { images = [] } = herd;

          if (images.length) {
            await deleteImage({ variables: { where: { id: images[images.length - 1].id } } });
          }

          client.writeFragment({
            ...fragmentProps,
            data: { ...herd, images: [uploadedImage] },
          });
        }
      }

      setLoading(false);

      return result;
    },
    [client, deleteImage, headers, t],
  );

  return { uploadImage, loading };
};

export default useUploadImage;
