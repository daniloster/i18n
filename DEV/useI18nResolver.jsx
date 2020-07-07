import { useCallback, useContext } from 'react'
import I18nContext from './I18nContext'
import useObservableState from "./useObservableState"


/**
 * @typedef Props
 * @property {string} namespace
 */

/**
 * 
 * @param {Props} props 
 */
export default function useI18nResolver(props) {
  const { namespace } = props
  /** @type {[import('@daniloster/i18n/lib/types').I18nState, import('@daniloster/i18n/lib/types').ResolverTransformer]} */
  const [i18n, transformer] = useContext(I18nContext)
  const [t] = useObservableState(i18n.t)
  
  return useCallback((path, modifiers) => {
    /** @type {import('@daniloster/i18n/lib/types').ResolverTransformer} */
    const interpolate = (options) => {
      if (transformer) {
        return transformer({ ...options, modifiers })
      }
  
      return options.template || options.path
    }
    
    return t(
      namespace ? namespace + '.' + path : path,
      transformer ? interpolate : transformer,
    )
  }, [t, transformer])
}
