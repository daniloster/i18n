import AsyncStatus from "./AsyncStatus"
import factoryLanguageService from "./factoryLanguageService"
import factoryResolver from "./factoryResolver"
import factoryResourcesService from "./factoryResourcesService"
import ObservableState from "./ObservableState"
import onInit from "./onInit"

const DEFAULT_DEBOUNCE = 300
/**
 * Validates if a real number is passed as debounce otherwise returns
 * a default debounce (300)
 * @param {number} debounce the delay time in milliseconds (optional)
 * @returns {number} the delay time in milliseconds
 */
function getDebounce(debounce) {
  return typeof debounce === 'number' ? debounce : DEFAULT_DEBOUNCE
}

/**
 * Creates i18n object which manages internationalization asynchronously.
 * @param {import('@daniloster/i18n/lib/types').I18nConfig} config 
 * @returns {import('@daniloster/i18n/lib/types').I18nState}
 */
export default function factoryI18n(config) {
  const {
    debounceLanguageService,
    debounceResourcesService,
    defaultLanguage,
  } = config
  /** @type {import('@daniloster/i18n/lib/types').ObservableState<string>} */
  const language = ObservableState.create(defaultLanguage)
  /** @type {import('@daniloster/i18n/lib/types').ObservableState<import('@daniloster/i18n/lib/types').Resource>} */
  const resources = ObservableState.create({})

  const languageService = factoryLanguageService(
    config.languageService,
    language,
    resources,
    getDebounce(debounceLanguageService)
  )
  const resourcesService = factoryResourcesService(
    config.resourcesService,
    resources,
    getDebounce(debounceResourcesService)
  )
  language.subscribe({
    next: (lng) => {
      // Errors will be captured by statusObservableList listeners
      resourcesService.get(lng).catch(() => null)
    }
  })
  const status = ObservableState.create(AsyncStatus.Initial)
  const statusObservableList = [
    languageService.status.get,
    languageService.status.set,
    resourcesService.status.get,
    resourcesService.status.set,
  ]
  statusObservableList.forEach(statusObservable => {
    statusObservable.subscribe({
      next: () => {
        if (statusObservableList.some(currentStatus => currentStatus.get() === AsyncStatus.Loading)) {
          status.set(() => AsyncStatus.Loading)
        } else if (statusObservableList.some(currentStatus => currentStatus.get() === AsyncStatus.Error)) {
          status.set(() => AsyncStatus.Error)
        } else {
          status.set(() => AsyncStatus.Success)
        }
      }
    })
  })

  const t = factoryResolver({
    defaultLanguage,
    language,
    resources,
    status,
  })

  async function init() {
    await onInit({
      defaultLanguage,
      languageService,
      resourcesService,
      status,
    })
  }

  return {
    init,
    languageService,
    resourcesService,
    language,
    resources,
    status,
    t,
  }
}
