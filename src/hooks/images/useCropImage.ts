import { useCallback, useEffect, useState } from 'react';

import throttle from 'lodash/throttle';

import { CropperProps } from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';

import getCroppedImg from 'helpers/image/getCroppedImg';

type OnCropComplete = ((croppedArea: Area, croppedAreaPixels: Area) => void) | undefined;
type UseCropImage = (props: {
  file: File | null;
}) => Omit<
  CropperProps,
  'aspect' | 'cropShape' | 'zoomSpeed' | 'style' | 'classes' | 'restrictPosition' | 'mediaProps'
> & { imageUrl: string | null; imageBlob: Blob | null };

const useCropImage: UseCropImage = ({ file }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const reader = new FileReader();

    reader.addEventListener('load', () => setImageUrl(reader.result as string), false);

    if (file) reader.readAsDataURL(file);
  }, [file]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCropComplete: OnCropComplete = useCallback(
    throttle(async (_, croppedAreaPixels) => {
      const croppedImg = await getCroppedImg({
        imageUrl: imageUrl as string,
        crop: croppedAreaPixels,
        type: file?.type,
      });

      setImageBlob(croppedImg);
    }, 300),
    [file?.type, imageUrl, rotation],
  );

  return {
    imageUrl,
    imageBlob,

    crop,
    zoom,
    minZoom: 1,
    maxZoom: 3,
    rotation,
    onCropComplete,
    onCropChange: setCrop,
    onZoomChange: setZoom,
    onRotationChange: setRotation,
  };
};

export default useCropImage;
