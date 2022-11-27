import { FC, useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

import { toast } from 'react-hot-toast';
import classNames from 'classnames';

import Button from 'components/common/buttons/Button';
import ImageCropper from 'components/common/Image/ImageCropper';

import useUploadImage from 'hooks/images/useUploadImage';

const UploadImageModalBody: FC<{ toggle?: () => void }> = ({ toggle }) => {
  const { t } = useTranslation();
  const { animalId } = useParams<{ animalId: string }>();
  const { uploadImage, loading } = useUploadImage();

  const [file, setFile] = useState<File | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const onDrop = useCallback(([droppedFile]: File[]) => setFile(droppedFile), []);

  const onUpload = useCallback(() => {
    if (loading) return;

    void toast
      .promise(uploadImage({ animalId, image: imageBlob as File }), {
        loading: t('common.uploading'),
        success: t('common.imageUploaded'),
        error: err => err.message,
      })
      .finally(() => toggle?.());
  }, [animalId, imageBlob, loading, t, toggle, uploadImage]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/jpeg, image/png',
  });

  return (
    <div className='upload-image-modal-body'>
      <div className='image-preview'>
        <div {...getRootProps()}>
          <Button
            color='primary'
            className={classNames('dropbox-btn', {
              compact: !!imageBlob,
              'btn-transparent': !imageBlob,
            })}
          >
            {t('common.clickOrDrag')}
            <input {...getInputProps()} />
          </Button>
        </div>

        <ImageCropper file={file} onImageChange={setImageBlob} />
      </div>

      {imageBlob && (
        <div className='upload-image-btns'>
          <Button type='submit' color='primary' onClick={onUpload} autoFocus>
            {t('common.upload')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadImageModalBody;
