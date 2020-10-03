import React, { useEffect, useMemo } from 'react'
import I18nContext from './I18nContext'
import I18nResolver from './I18nResolver'
import transform from './transform'
import useObservableState from './useObservableState'


/**
 * @typedef Props
 * @property {import("@daniloster/i18n/lib/types").I18nState} i18n
 */


/**
 * Application dev
 * @param {Props} props 
 */
export default function App({ i18n }) {
  const [language] = useObservableState(i18n.language)
  const [t] = useObservableState(i18n.t)
  const [status] = useObservableState(i18n.status)

  useEffect(() => {
    i18n.init()
  }, [i18n])
  const i18nContextValue = useMemo(() => [i18n, transform], [i18n])

  return (
    <I18nContext.Provider value={i18nContextValue}>
      <div>
        <div>
          <button type="button" onClick={() => i18n.languageService.set('en').catch(() => null)}>EN</button>
          <button type="button" onClick={() => i18n.languageService.set('pt').catch(() => null)}>PT</button>
          <button type="button" onClick={() => i18n.languageService.set('es').catch(() => null)}>ES</button>
        </div>
        <p>{status}</p>
        <p>{language}</p>
        <p>{t('PageOne.hello')}</p>
        <p><I18nResolver path="PageOne.hello" /></p>
        <p><I18nResolver path="PageOne.interpolation.text" /></p>
        <p><I18nResolver path="PageOne.interpolation.nodes" /></p>
        <div>
          <I18nResolver path="PageOne.interpolation.simple" modifiers={{ name: 'Guest' }} />
        </div>
      </div>
    </I18nContext.Provider>
  )
}