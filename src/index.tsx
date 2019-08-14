import { useEffect, useState } from 'react';

let state = {
  whenOnline: 'online',
  whenOffline: 'offline',
};

function useNavigatorOnline({ whenOnline, whenOffline } = state) {
  let [value, setValue] = useState(window.navigator.onLine);

  useEffect(() => {
    function handleOnlineStatus() {
      setValue(window.navigator.onLine);
    }

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  let isOnline = value === true;
  let isOffline = value === false;
  let status = isOnline ? whenOnline : whenOffline;

  return { status, isOnline, isOffline };
}

export { useNavigatorOnline };
