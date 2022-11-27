import { FC, useState, useCallback, Fragment, useMemo } from 'react';

import classnames from 'classnames';

import ReactAvatar from 'react-avatar';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import 'react-lazy-load-image-component/src/effects/blur.css';

import UploadImageModal from 'components/common/Image/UploadImageModal';

interface Image {
  src: string;
  placeholderSrc?: string;
}

const Avatar: FC<{
  name?: string;
  images?: Image[];
  className?: string;
  uploadable?: boolean;
}> = ({ images, className, uploadable, ...props }) => {
  const [showModal, setShowModal] = useState(false);

  const image = useMemo(() => images?.[images.length - 1], [images]);
  const classNames = useMemo(
    () => classnames(`avatar ${uploadable ? 'avatar-uploadable' : ''}`, className),
    [className, uploadable],
  );

  const modalToggle = useCallback(() => setShowModal(!showModal), [showModal]);

  return (
    <Fragment>
      {image ? (
        <div role='none' onClick={() => uploadable && modalToggle()}>
          <LazyLoadImage wrapperClassName={classNames} effect='blur' {...image} />
        </div>
      ) : (
        <ReactAvatar
          className={classNames}
          size='120'
          round='8px'
          {...props}
          onClick={() => uploadable && modalToggle()}
        />
      )}

      {uploadable && <UploadImageModal toggle={modalToggle} show={showModal} />}
    </Fragment>
  );
};

export default Avatar;
