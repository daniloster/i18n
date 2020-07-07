import AsyncStatus from "./AsyncStatus"
import factoryAsyncDebounce from "./factoryAsyncDebounce"
import factoryStatusHooks from "./factoryStatusHooks"
import ObservableState from "./ObservableState"

/**
 * 
 * @param {import('@daniloster/i18n/lib/types').ResourcesService} resourcesService 
 * @param {import('@daniloster/i18n/lib/types').ObservableState<import('@daniloster/i18n/lib/types').Resource>} resourceState  
 * @param {number} debounce  
 * @returns {import('@daniloster/i18n/lib/types').ResourcesServiceObservable<import('@daniloster/i18n/lib/types').Resource>}
 */
export default function factoryResourcesService(resourcesService, resourceState, debounce) {
  /**
   * @type {{
   * get: import('@daniloster/i18n/lib/types').ObservableState<import('@daniloster/i18n/lib/types').AsyncStatus>,
   * set: import('@daniloster/i18n/lib/types').ObservableState<import('@daniloster/i18n/lib/types').AsyncStatus>
   * }}
   * */
  const status = {
    get: ObservableState.create(AsyncStatus.Initial),
    set: ObservableState.create(AsyncStatus.Initial),
  }

  function isResourceLoaded(language) {
    return !!resourceState.get()[language]
  }

  /** @type {import('@daniloster/i18n/lib/types').ResourcesServiceObservable<import('@daniloster/i18n/lib/types').Resource>} */
  const service = {
    status,
    get: factoryAsyncDebounce(async (language) => {
      const loadedResource = resourceState.get()[language]
      if (loadedResource) {
        return loadedResource
      }
      
      const resource = await resourcesService.get(language)
      resourceState.set(oldResources => {
        if (!oldResources[language]) {
          return {
            ...oldResources,
            [language]: resource
          }
        }

        return oldResources
      })

      return resource
    }, factoryStatusHooks(status.get, isResourceLoaded, debounce)),
    set: factoryAsyncDebounce(async (language, resource) => {
      const response = await resourcesService.set(language, resource)
      resourceState.set(oldResources => {
        if (!oldResources[language]) {
          return {
            ...oldResources,
            [language]: resource
          }
        }

        return oldResources
      })

      return response
    }, factoryStatusHooks(status.set, () => false, debounce)),
  }

  return Object.freeze(service)
}