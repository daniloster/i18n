import AsyncStatus from "./AsyncStatus"
import factoryAsyncDebounce from "./factoryAsyncDebounce"
import factoryStatusHooks from "./factoryStatusHooks"
import ObservableState from "./ObservableState"

/**
 * 
 * @param {import('@daniloster/i18n/lib/types').LanguageService} languageService 
 * @param {import('@daniloster/i18n/lib/types').ObservableState<string>} languageState  
 * @param {import('@daniloster/i18n/lib/types').ObservableState<import('@daniloster/i18n/lib/types').Resource>} resourceState  
 * @param {number} debounce  
 * @returns {import('@daniloster/i18n/lib/types').LanguageServiceObservable<string>}
 */
export default function factoryLanguageService(languageService, languageState, resourceState, debounce) {
  const status = {
    get: ObservableState.create(AsyncStatus.Initial),
    set: ObservableState.create(AsyncStatus.Initial),
  }

  function isResourceLoaded(language) {
    return !!resourceState.get()[language]
  }

  /** @type {import('@daniloster/i18n/lib/types').LanguageServiceObservable<string>} */
  const service = {
    status,
    get: factoryAsyncDebounce(async (bypassNotification) => {
      const language = await languageService.get()
      if (!bypassNotification) {
        languageState.set(() => language)
      }

      return language
    }, factoryStatusHooks(status.get, () => false, debounce)),
    set: factoryAsyncDebounce(async (language) => {
      const response = await languageService.set(language)
      languageState.set(() => language)

      return response
    }, factoryStatusHooks(status.set, isResourceLoaded, debounce)),
  }
  return Object.freeze(service)
}