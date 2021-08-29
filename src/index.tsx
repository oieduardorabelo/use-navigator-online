import { useEffect, useState } from 'react';

interface IState {
  whenOnline?: string;
  whenOffline?: string;
  startOnline?: boolean;
}

let defaultState: IState = {
  whenOnline: 'online',
  whenOffline: 'offline',
  startOnline: true,
};

function useNavigatorOnline(state: IState = {}) {
  let { whenOnline, whenOffline, startOnline } = { ...defaultState, ...state };
  let [value, setValue] = useState(startOnline);

  useEffect(() => {
    if (window.navigator.onLine !== value) {
      setValue(window.navigator.onLine);
      return;
    }

    function handleOnlineStatus() {
      setValue(window.navigator.onLine);
    }

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [value, setValue]);

  let isOnline = value === true;
  let isOffline = value === false;
  let status = isOnline ? whenOnline : whenOffline;

  return { status, isOnline, isOffline };
}

export { useNavigatorOnline };
