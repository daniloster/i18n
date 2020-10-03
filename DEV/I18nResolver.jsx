import React from 'react'
import useI18nResolver from './useI18nResolver'


/**
 * @typedef Props
 * @property {string} namespace
 * @property {string} path 
 * @property {{ [key: string]: any }} modifiers 
 */

/**
 * 
 * @param {Props} props 
 */
export default function I18nResolver(props) {
  const { namespace, path, modifiers } = props
  const t = useI18nResolver({ namespace })
  
  return (
    <>{t(path, modifiers)}</>
  )
}
