import { FC } from 'react';

import { Toaster } from 'react-hot-toast';

const ToasterNotifications: FC = () => (
  <Toaster
    position='bottom-right'
    toastOptions={{
      style: {
        fontSize: '20px',
        borderRadius: '8px',
        minWidth: '200px',
        transition: 'background-color 1s ease',
      },
      success: { style: { backgroundColor: '#deffec' } },
      error: { style: { backgroundColor: '#ffd6d6' } },
    }}
  />
);

export default ToasterNotifications;
