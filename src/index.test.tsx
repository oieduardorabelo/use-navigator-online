import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent, createEvent } from '@testing-library/dom';
import { useNavigatorOnline } from './';

beforeEach(() => {
  overwriteGlobalNavigatorOnline();
});

test('use default `window.navigator`', () => {
  let { result } = renderHook(() => useNavigatorOnline());

  expect(result.current.status).toBe('online');
  expect(result.current.isOnline).toBe(true);
  expect(result.current.isOffline).toBe(false);

  act(() => {
    fireEvent(window, createEvent('offline', window, {}));
  });

  expect(result.current.status).toBe('offline');
  expect(result.current.isOnline).toBe(false);
  expect(result.current.isOffline).toBe(true);
});

test('renders online-first with `startOnline: true`', () => {
  let { result } = renderHook(() => useNavigatorOnline({ startOnline: true }));

  expect(result.current.status).toBe('online');
  expect(result.current.isOnline).toBe(true);
  expect(result.current.isOffline).toBe(false);

  act(() => {
    fireEvent(window, createEvent('offline', window, {}));
  });

  expect(result.current.status).toBe('offline');
  expect(result.current.isOnline).toBe(false);
  expect(result.current.isOffline).toBe(true);
});

test('toggles offline/online', () => {
  let { result } = renderHook(() => useNavigatorOnline());

  expect(result.current.status).toBe('online');
  expect(result.current.isOnline).toBe(true);
  expect(result.current.isOffline).toBe(false);

  act(() => {
    fireEvent(window, createEvent('offline', window, {}));
  });

  expect(result.current.status).toBe('offline');
  expect(result.current.isOnline).toBe(false);
  expect(result.current.isOffline).toBe(true);

  act(() => {
    fireEvent(window, createEvent('online', window, {}));
  });

  expect(result.current.status).toBe('online');
  expect(result.current.isOnline).toBe(true);
  expect(result.current.isOffline).toBe(false);
});

test('custom react element for "whenOnline" and "whenOffline"', () => {
  let { result } = renderHook(() =>
    useNavigatorOnline({ whenOffline: <h2>Hi Offline</h2>, whenOnline: <h1>Hi Online</h1> })
  );

  // @ts-ignore
  expect(result.current.status.type).toBe('h1');
  // @ts-ignore
  expect(result.current.status.props.children).toBe('Hi Online');

  act(() => {
    fireEvent(window, createEvent('offline', window, {}));
  });

  // @ts-ignore
  expect(result.current.status.type).toBe('h2');
  // @ts-ignore
  expect(result.current.status.props.children).toBe('Hi Offline');
});

test('custom string/number for "whenOnline" and "whenOffline"', () => {
  let { result } = renderHook(() => useNavigatorOnline({ whenOffline: 'Hi Offline', whenOnline: 4444 }));

  expect(result.current.status).toBe(4444);

  act(() => {
    fireEvent(window, createEvent('offline', window, {}));
  });

  expect(result.current.status).toBe('Hi Offline');
});

describe("syncs with window.navigator.onLine when rendering with different 'startOnline' value", () => {
  test('when window.navigator.onLine value is "true"', () => {
    let { result } = renderHook(() => useNavigatorOnline({ startOnline: false }));

    expect(result.current.status).toBe('online');
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);

    act(() => {
      fireEvent(window, createEvent('offline', window, {}));
    });

    expect(result.current.status).toBe('offline');
    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
  });

  test('when window.navigator.onLine value is "false"', () => {
    act(() => {
      fireEvent(window, createEvent('offline', window, {}));
    });

    let { result } = renderHook(() => useNavigatorOnline({ startOnline: true }));

    expect(result.current.status).toBe('offline');
    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);

    act(() => {
      fireEvent(window, createEvent('online', window, {}));
    });

    expect(result.current.status).toBe('online');
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });
});

function overwriteGlobalNavigatorOnline() {
  let online = true;

  Object.defineProperty(window.navigator.constructor.prototype, 'onLine', {
    get: () => {
      return online;
    },
  });

  window.addEventListener('offline', function () {
    online = false;
  });
  window.addEventListener('online', function () {
    online = true;
  });
}
