/**
 * Creates a debounced async function
 * @param {(...args) => Promise<T>} fn 
 * @param {import('@daniloster/i18n/lib/types').AsyncDebounceHooks} statusHooks
 * @param {number} debounce 
 * @returns {import('@daniloster/i18n/lib/types').Debounced<Promise<T>>}
 * @template T
 */
export default function factoryAsyncDebounce(fn, statusHooks) {
  let ref = null
  let lastReject = () => null
  const debounced = (...args) => new Promise((resolve, reject) => {
    clearTimeout(ref)
    lastReject({ debounced: true })
    lastReject = reject
    statusHooks.onStart()
    /** @type {boolean} */
    const skip = statusHooks.skip(...args)
    const debouncedExecutor = () => {
      fn(...args)
        .then((...response) => {
          resolve(...response)
          statusHooks.onSuccess()
        }).catch((...error) => {
          statusHooks.onError()
          reject(...error)
        })
    }
    
    ref = setTimeout(debouncedExecutor, skip ? 0 : statusHooks.debounce)
  })

  debounced.bypass = fn

  return debounced
}
