import createHTMLImg from 'helpers/image/createHTMLImg';

type GetCroppedImg = (props: {
  imageUrl: string;
  crop: any;
  type?: string;
}) => Promise<Blob | null>;

const getCroppedImg: GetCroppedImg = async ({ imageUrl, crop, type = 'image/png' }) => {
  const image = await createHTMLImg(imageUrl);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (image instanceof ErrorEvent) return null;

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);

  return new Promise(resolve =>
    canvas.toBlob(blob => {
      resolve(blob);
    }, type),
  );
};

export default getCroppedImg;
