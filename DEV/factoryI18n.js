import factoryI18n from '@daniloster/i18n'

/**
 * @returns {import('@daniloster/i18n/lib/types').I18nState}
 */
export default (props) => factoryI18n({
  defaultLanguage: 'en',
  languageService: {
    get: async () => localStorage.getItem('language'),
    set: async (language) => localStorage.setItem('language', language),
  },
  resourcesService: {
    get: async (language) => {
      const response = await fetch(`/assets/locales/${language}.json`)
      if (response.ok) {
        return await response.json()
      }

      throw new Error(`[ERROR]: ${response.status} | ${response.statusText}`)
    },
    set: async () => null
  },
  ...props,
})
