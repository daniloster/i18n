import factoryI18n from './factoryI18n'

export default factoryI18n({
  defaultLanguage: 'en',
  languageService: {
    get: async () => localStorage.getItem('language'),
    set: async (language) => localStorage.setItem('language', language),
  },
  resourcesService: {
    get: async (language) => {
      const response = await fetch(`/assets/locales/${language}.json`)
      return await response.json()
    },
    set: async () => Promise.resolve(null)
  },
})
