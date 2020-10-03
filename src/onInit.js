import AsyncStatus from "./AsyncStatus"

// make sure won't trigger notification by getting language
const BypassNotification = true

/**
 * 
 * @typedef InitConfig
 * @property {string} defaultLanguage
 * @property {import('@daniloster/i18n/lib/types').LanguageServiceObservable<string>} languageService
 * @property {import('@daniloster/i18n/lib/types').ResourcesServiceObservable<import('@daniloster/i18n/lib/types').Resource>} resourcesService
 * @property {import('@daniloster/i18n/lib/types').ObservableState<string>} status
 */

/**
 * 
 * @param {InitConfig} config 
 */
export default async function onInit(config) {
  const {
    defaultLanguage,
    languageService,
    resourcesService,
    status,
  } = config
  // start on loading
  status.set(() => AsyncStatus.Loading)
  try {
    const remoteLanguage = await languageService.get.bypass(BypassNotification)
    // define initial language
    const initialLanguage = remoteLanguage || defaultLanguage
    /**
     * set new language if initial different from default. This
     * will trigger load on demand
     */
    if (initialLanguage !== defaultLanguage) {
      await resourcesService.get.bypass(defaultLanguage)
      await languageService.set.bypass(initialLanguage)
      status.set(() => AsyncStatus.Success)
    } else {
      /**
       * otherwise, force load of default language
       */
      await resourcesService.get.bypass(initialLanguage)
      status.set(() => AsyncStatus.Success)
    }
  } catch (e) {
    status.set(() => AsyncStatus.Error)
    throw e
  }
}