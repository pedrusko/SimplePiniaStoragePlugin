# SimplePiniaStoragePlugin
Simple plugin for Pinia to use LocalStorage or SessionStorage por persistence between page reloads.

## Options
`useSessionStorage` - If true uses browser session storage. If false or not preset uses browser local storage.
`sessionExpiration` - Miliseconds for session expiration between page reloads. If a page is reloaded after the number of miliseconds indicated the store is removed and the state is reset.
