import AsyncStatus from "./AsyncStatus"

/**
 * Creates a status hook
 * @param {import('@daniloster/i18n/lib/types').ObservableState<import('@daniloster/i18n/lib/types').AsyncStatus>} observable 
 * @param {Function(args): boolean} skip
 * @param {number} debounce 
 * @returns {import('@daniloster/i18n/lib/types').AsyncDebounceHooks}
 */
export default function factoryStatusHooks(observable, skip, debounce) {
  const onStart = () => observable.set(() => AsyncStatus.Loading)
  const onError = () => observable.set(() => AsyncStatus.Error)
  const onSuccess = () => observable.set(() => AsyncStatus.Success)

  return {
    debounce,
    skip,
    onStart,
    onError,
    onSuccess,
  }
}
