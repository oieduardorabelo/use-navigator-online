# @oieduardorabelo/use-navigator-online

React Hooks to detect when your browser is online/offline using [`window.navigator.onLine` API](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine).

To install it:

```
yarn add @oieduardorabelo/use-navigator-online
```

## Example

An online demo is available at CodeSandbox:

- **Live demo:** https://codesandbox.io/s/live-demo-use-navigator-online-1xy56

If you've any issues, **open an issue with a CodeSandbox link** with your issue

## API Explained

In your app, you can add:

```javascript
import { useNavigatorOnline } from '@oieduardorabelo/use-navigator-online';

function App() {
  let details = useNavigatorOnline(options)
  ...
}
```

### `details` object is composed of:

- `details.isOnline`: It is a `Boolean` value, `true` when online
- `details.isOffline`: It is a `Boolean` value, `true` when offline
- `details.status`: Returns a default `String`, when online it is `"online"` and when offline it is `"offline"`. You can customize it using `options` param

### `options` object is composed of:

- `options.whenOnline`: Can be any valid React children. It will replace the `String` returned in `details.status` when online.
- `options.whenOffline`: Can be any valid React children. It will replace the `String` returned in `details.status` when offline.
- `options.startOnline`: Adding Support for SSR, a boolean value to determine which state it initializes. Defaults to `true`.

## Examples

Using `isOnline` and `isOffline` flags:

```javascript
import { useNavigatorOnline } from '@oieduardorabelo/use-navigator-online';

function App() {
  let { isOnline, isOffline } = useNavigatorOnline();

  return (
    <div>
      {isOnline && <span>We are online!</span>}
      {isOffline && <span>We are offline!</span>}
    </div>
  );
}
```

Using default `status`:

```javascript
import { useNavigatorOnline } from '@oieduardorabelo/use-navigator-online';

function App() {
  // will toggle between "online" and "offline"
  let { status } = useNavigatorOnline();

  return <div>Browser now is {status}!</div>;
}
```

Custom values for `status` with `whenOnline` and `whenOffline`:

```javascript
import { useNavigatorOnline } from '@oieduardorabelo/use-navigator-online';

function App() {
  // you can pass any React children in "whenOnline" and "whenOffline"
  let { status } = useNavigatorOnline({
    whenOnline: <h1>WE ARE ONLINE!</h1>,
    whenOffline: <h4>Damn, offline :(</h4>,
  });

  return <div>{status}</div>;
}
```

No extra configuration is needed to use it on SSR:

```javascript
import { useNavigatorOnline } from '@oieduardorabelo/use-navigator-online';

function App() {
  let { status } = useNavigatorOnline();

  return <div>{status}</div>;
}
```

You can initialize your application offline-first. This **will not re-render** your application in "online" state because `window` will not trigger an "online" change event when the page loads.

You need to manually trigger a "online" event to re-render your application:

```javascript
import { useNavigatorOnline } from '@oieduardorabelo/use-navigator-online';

function App() {
  let { status } = useNavigatorOnline({
    startOnline: false
  });

  useEffect(() => {
    window.dispatchEvent(new Event("online"))
  }, [])

  return <div>{status}</div>;
}
```

### License

[MIT License](https://oss.ninja/mit/oieduardorabelo/) © [Eduardo Rabelo](https://eduardorabelo.me)
