type CreateHTMLImage = (url: string) => Promise<HTMLImageElement | ErrorEvent>;

const createHTMLImg: CreateHTMLImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.src = url;
  });

export default createHTMLImg;
