import { useEffect, useState } from 'react';

export default function useNotification() {
  const duration = 2000;

  const [notificationStatus, setNotificationStatus] = useState({
    open: false,
    response: null,
    error: null,
  });

  const openNotification = (response, error) => {
    setNotificationStatus((prevState) => ({
      ...prevState,
      open: true,
      response: response,
      error: error,
    }));
  };

  const closeNotification = () => {
    setNotificationStatus((prevState) => ({
      ...prevState,
      open: false,
      response: null,
      error: null,
    }));
  };

  useEffect(() => {
    if (notificationStatus.response || notificationStatus.error) {
      //console.log(notificationStatus);
      setNotificationStatus((prevState) => ({
        ...prevState,
        open: true,
      }));
      setTimeout(() => {
        setNotificationStatus((prevState) => ({
          ...prevState,
          open: false,
        }));
      }, duration);
    }
  }, [notificationStatus.response, notificationStatus.error]);

  return { notificationStatus, setNotificationStatus, openNotification, closeNotification };
}
