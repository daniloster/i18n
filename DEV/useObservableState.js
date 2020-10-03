import { useEffect, useMemo, useState } from 'react'

/**
 * Listen to an observable state converting into react hook
 * @param {import('@daniloster/i18n/lib/types').ObservableState<S>} observableState
 * @returns {[S, ((value: S) => S) => void]}
 * @template S
 */
export default function useObservableState(observableState) {
  /** @type {[S, React.Dispatch<React.SetStateAction<S>>]} */
  const state = useState(() => observableState.get())
  const [value, setValue] = state

  useEffect(() => {
    const subscription = observableState.subscribe({
      next: (newValue) => {
        setValue((oldValue) => oldValue !== newValue ? newValue : oldValue)
      }
    })

    return subscription.unsubscribe
  }, [observableState])

  /** @type {[S, ((value: S) => S) => void]} */
  return useMemo(() => [value, observableState.set], [value, observableState.set])
}
