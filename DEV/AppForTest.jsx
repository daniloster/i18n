import React, { useCallback, useEffect, useMemo, useState } from 'react'
import I18nContext from './I18nContext'
import I18nResolver from './I18nResolver'
import transform from './transform'
import useObservableState from './useObservableState'

/**
 * @typedef Props
 * @property {import("@daniloster/i18n/lib/types").I18nState} i18n
 */

/**
 * Application test
 * @param {Props} props 
 */
export default function AppForTest({ i18n }) {
  const [language] = useObservableState(i18n.language)
  const [t] = useObservableState(i18n.t)
  const [status] = useObservableState(i18n.status)
  const [asyncError, setAsyncError] = useState(null)
  const handleDebounceError = useCallback((e) => {
    if (e.debounced) {
      return null
    }
 
    setAsyncError(e)
  }, [])

  useEffect(() => {
    i18n.init()
  }, [i18n])
  const i18nContextValue = useMemo(() => [i18n, transform], [i18n])

  return (
    <I18nContext.Provider value={i18nContextValue}>
      <div>
        <div>
          <button type="button" data-testid="EN" onClick={() => i18n.languageService.set('en').catch(handleDebounceError)}>EN</button>
          <button type="button" data-testid="PT" onClick={() => i18n.languageService.set('pt').catch(handleDebounceError)}>PT</button>
          <button type="button" data-testid="ES" onClick={() => i18n.languageService.set('es').catch(handleDebounceError)}>ES</button>
        </div>
        {!!asyncError && <p>error: {asyncError.message}</p>}
        <p>status: {status}</p>
        <p>language: {language}</p>
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