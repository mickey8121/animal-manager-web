import { FC, useEffect, useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import Cropper, { CropperProps } from 'react-easy-crop';
import { Input, InputGroup, Label } from 'reactstrap';

import Loading from 'components/common/Loading';

import useCropImage from 'hooks/images/useCropImage';

interface ImageCropperProps {
  file: File | null;
  onImageChange?: (imageBlob: Blob | null, imageUrl: string | null) => void;
  cropperProps?: CropperProps;
}

const rangeAccuracy = 100;

const ImageCropper: FC<ImageCropperProps> = ({ file = null, onImageChange, cropperProps }) => {
  const { t } = useTranslation();
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const {
    imageBlob,
    imageUrl,
    zoom,
    minZoom,
    maxZoom,
    rotation,
    onZoomChange,
    onRotationChange,
    ...cropImageProps
  } = useCropImage({ file });

  useEffect(() => {
    if (imageBlob && onImageChange) onImageChange(imageBlob, imageUrl);
  }, [imageBlob, imageUrl, onImageChange]);

  const onChangeRange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onZoomChange?.(parseInt(e.currentTarget.value, 10) / rangeAccuracy),
    [onZoomChange],
  );
  const onMediaLoaded = useCallback(() => setMediaLoaded(true), []);

  if (!imageUrl) return null;

  return (
    <div className='image-cropper'>
      <div className='image-cropper-wrap'>
        {file && !mediaLoaded && <Loading className='cropper-loading' page />}

        <Cropper
          classes={{
            containerClassName: 'image-cropper-container',
            mediaClassName: 'image-cropper-media',
            cropAreaClassName: 'image-cropper-crop-area',
          }}
          onMediaLoaded={onMediaLoaded}
          objectFit='vertical-cover'
          image={imageUrl ?? ''}
          aspect={1}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          rotation={rotation}
          onZoomChange={onZoomChange}
          onRotationChange={onRotationChange}
          {...cropImageProps}
          {...cropperProps}
        />
      </div>

      <InputGroup className='image-cropper-controls'>
        <Label>{t('common.scale')}</Label>
        <Input
          type='range'
          step={1}
          value={zoom * rangeAccuracy}
          min={minZoom * rangeAccuracy}
          max={maxZoom * rangeAccuracy}
          onChange={onChangeRange}
        />
      </InputGroup>
    </div>
  );
};

export default ImageCropper;
