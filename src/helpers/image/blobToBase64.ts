type BlobToBase64 = (file: Blob) => Promise<string | ArrayBuffer | null>;

const blobToBase64: BlobToBase64 = file =>
  new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = ({ target }) => resolve(target?.result ?? null);
    reader.readAsDataURL(file);
  });

export default blobToBase64;
