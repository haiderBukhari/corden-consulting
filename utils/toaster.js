import { toast } from 'react-toastify';

export const successToaster = (message) => {
  toast.success(message, {
    theme: 'light',
    position: 'top-right',
    autoClose: 1500,
    className:'bg-white text-default_text px-2',
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
    
  });
};

export const errorToaster = (
  message,
  autoClose = 1500,
  closeOnClick = true
) => {
 

  toast.error(message, {
    position: 'top-right',
    autoClose: autoClose,
    className:'bg-white text-default_text px-2',
    hideProgressBar: true,
    closeOnClick: closeOnClick,
    theme: 'dark',
    draggable: true,
    progress: undefined,
    limit: 1
  });
};
