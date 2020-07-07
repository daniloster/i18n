import '@babel/polyfill'
import React from 'react'
import { render } from 'react-dom'
import App from './App'
import i18n from './i18n'


const root = document.createElement('div')
document.body.appendChild(root)

render(<App i18n={i18n} />, root)
