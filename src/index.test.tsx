import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent, createEvent } from '@testing-library/dom';
import { useNavigatorOnline } from './';

beforeEach(() => {
  overwriteGlobalNavigatorOnline();
})

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

describe("syncs with window.navigator.onLine when rendering with different 'startOnline' value",() => {
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
})

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
