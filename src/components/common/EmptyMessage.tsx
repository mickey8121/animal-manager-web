import { FC } from 'react';

interface EmptyMessageProps {
  message: string;
  hint?: string;
}

const EmptyMessage: FC<EmptyMessageProps> = ({ message, hint, children }) => (
  <div className='empty-message'>
    <div className='empty-message-text'>{message}</div>
    {hint && <div className='empty-message-hint'>{hint}</div>}
    {children}
  </div>
);

export default EmptyMessage;
