# @oieduardorabelo/user-navigator-online

React Hooks to detect when your browser is online/offline using [`window.navigator.onLine` API](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine).

To install it:

```
yarn add @oieduardorabelo/use-navigator-online
```

## API Explained

In your app, you can add:

```javascript
import useNavigatorOnline from '@oieduardorabelo/useNavigatorOnline';

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

## Examples

Using `isOnline` and `isOffline` flags:

```javascript
import useNavigatorOnline from '@oieduardorabelo/useNavigatorOnline';

function App() {
  let { isOnline, isOffline } = useNavigatorOnline()

  return (
    <div>
      {isOnline && <span>We are online!</span>}
      {isOffline && <span>We are offline!</span>}
    </div>
  )
}
```

Using default `status`:

```javascript
import useNavigatorOnline from '@oieduardorabelo/useNavigatorOnline';

function App() {
  // will toggle between "online" and "offline"
  let { status } = useNavigatorOnline()

  return (
    <div>
      Browser now is {status}!
    </div>
  )
}
```

Custom values for `status` with `whenOnline` and `whenOffline`:

```javascript
import useNavigatorOnline from '@oieduardorabelo/useNavigatorOnline';

function App() {
  // will toggle between "online" and "offline"
  let { status } = useNavigatorOnline({
    whenOnline: <h1>WE ARE ONLINE!</h1>,
    whenOffline: <h4>Damn, offline :(</h4>
  })

  return (
    <div>{status}</div>
  )
}
```

### License

[MIT License](https://oss.ninja/mit/oieduardorabelo/) © [Eduardo Rabelo](https://eduardorabelo.me)
