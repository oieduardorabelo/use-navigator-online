import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent, createEvent } from '@testing-library/dom';
import { useNavigatorOnline } from './';

overwriteGlobalNavigatorOnline();

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

test('renders offline-first with `startOnline: false`', () => {
  let { result } = renderHook(() => useNavigatorOnline({ startOnline: false }));

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
