import { get as getPath } from 'mutation-helper'
import ObservableState from './ObservableState'

function get(obj, path) {
  try {
    return getPath(obj, path)
  } catch {
    return null
  }
}

/**
 * 
 * @param {import('@daniloster/i18n/lib/types').Resource} resources 
 * @param {string} language 
 * @param {AsyncStatus} status
 * @returns {(path: string, transform: (string) => string) => string}
 */
function factoryTemplateResolver(resources, language, status, defaultResolver) {
  /**
   * Resolves the json path into a string template that can be transformed
   * before returning
   * @param {string} path
   * @param {(string) => string} transform
   * @returns {string}
   */
  return (path, transform) => {
    const dictionary = get(resources, language)
    const template = get(dictionary, path)
    if (template === null || template === undefined) {
      if (defaultResolver) {
        const defaultTemplate = defaultResolver(path, transform)
        /**
         * Fallback to the default language. In case no value is found,
         * it will return the proper path, then, when defaultTemplate !== path
         * it means it got resolved.
         */
        if (defaultTemplate !== path) {
          return defaultTemplate
        }
      }

      return path
    }

    if (transform) {
      return transform({ path, template, status })
    }

    return template
  }
}

/**
 * Creates a resolver for i18n key
 * @param {import('@daniloster/i18n/lib/types').ResolverConfig} props
 */
export default function factoryResolver(props) {
  const {
    defaultLanguage,
    language,
    resources,
    status,
  } = props

  let [rs, lng, st] = [resources.get(), language.get(), status.get()]

  const getDefaultResolver = () => factoryTemplateResolver(resources.get(), defaultLanguage, status.get())

  const resolver = ObservableState.create(factoryTemplateResolver(rs, lng, st)) 
  const factory = () => {
    resolver.set(() => factoryTemplateResolver(rs, lng, st, getDefaultResolver()))
  }

  status.subscribe({
    next: (_st) => {
      st = _st
      factory()
    }
  })
  language.subscribe({
    next: (_lng) => {
      if (rs[_lng]) {
        lng = _lng
      }
      factory()
    }
  })
  resources.subscribe({
    next: (_rs) => {
      rs = _rs
      lng = language.get()
      factory()
    }
  })

  return resolver
}