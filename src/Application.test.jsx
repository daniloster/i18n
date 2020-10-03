import { act, fireEvent, render } from '@testing-library/react'
import { Response } from 'miragejs'
import React from 'react'
import AppForTest from '../DEV/AppForTest'
import factoryI18n from '../DEV/factoryI18n'
import delay from '../tools/helpers/tests/delay'

/**
 * 
 * @param {any} props 
 * @returns {[import('@testing-library/react').RenderResult, import('@daniloster/i18n/lib/types').I18nState]}
 */
function renderComponent(props = {}) {
  const i18n = factoryI18n(props)
  return [render(<AppForTest i18n={i18n} />), i18n]
}

describe('Application', () => {
  test('if Application renders the default language (en)', async () => {
    const [wrapper] = renderComponent()
    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: en')).toBeTruthy()
    const helloWorlds = await wrapper.findAllByText('Hello World')
    expect(helloWorlds).toBeTruthy()
    expect(helloWorlds).toHaveLength(2)

    expect(await wrapper.findByText('Hey {name}! It is good to have you here. Thanks {name} for coming.')).toBeTruthy()
    expect(await wrapper.findByText('Hey {name}! It is good <decorator>to have you here</decorator>. Thanks {name} for coming.')).toBeTruthy()
  }, 10000)

  test('if Application renders the stored language (pt)', async () => {
    localStorage.setItem('language', 'pt')
    const [wrapper] = renderComponent()
    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: pt')).toBeTruthy()
    const helloWorlds = await wrapper.findAllByText('Ola Mundo', {}, { timeout: 5000 })
    expect(helloWorlds).toBeTruthy()
    expect(helloWorlds).toHaveLength(2)

    expect(await wrapper.findByText('Ei, {name}! É bom ter você aqui. Obrigado {name} por ter vindo.')).toBeTruthy()
    expect(await wrapper.findByText('Ei, {name}! É bom <decorator> tê-lo aqui </decorator>. Obrigado {name} por ter vindo.')).toBeTruthy()
  }, 10000)

  test('if Application is notified when load language after initialization', async () => {
    const [wrapper, i18n] = renderComponent()
    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: en')).toBeTruthy()

    localStorage.setItem('language', 'es')
    const next = jest.fn()
    i18n.language.subscribe({ next })
    await act(async () => {
      await i18n.languageService.get()
    })

    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
    expect(next).toHaveBeenCalledWith('es')

    // request is made to not affect next test
    await delay(1000)
  }, 10000)

  test('if Application is forced to not notify when load language', async () => {
    const [wrapper, i18n] = renderComponent()
    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: en')).toBeTruthy()

    localStorage.setItem('language', 'es')
    const next = jest.fn()
    i18n.language.subscribe({ next })
    await act(async () => {
      await i18n.languageService.get(true)
    })

    expect(next).not.toHaveBeenCalled()

    // request is made to not affect next test
    await delay(1000)
  }, 10000)

  test('if Application do not fetch loaded resource', async () => {
    /**
     * For this test, we are going to try against the default language
     */
    localStorage.setItem('language', 'pt')
    const [wrapper, i18n] = renderComponent()
    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: pt')).toBeTruthy()

    const helloWorlds = await wrapper.findAllByText('Hello World')
    expect(helloWorlds).toBeTruthy()
    expect(helloWorlds).toHaveLength(2)

    const next = jest.fn()
    i18n.resources.subscribe({ next })
    const en = await wrapper.findByTestId('EN')
    fireEvent.click(en)
    await delay(1000)

    expect(next).not.toHaveBeenCalled()
  }, 10000)

  test('if Application changes language with debounce', async () => {
    const [wrapper] = renderComponent()
    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: en')).toBeTruthy()
    const helloWorlds = await wrapper.findAllByText('Hello World')
    expect(helloWorlds).toBeTruthy()
    expect(helloWorlds).toHaveLength(2)

    const pt = await wrapper.findByTestId('PT')

    fireEvent.click(pt)
    await delay(100)
    fireEvent.click(pt)
    await delay(100)
    fireEvent.click(pt)
    await delay(100)

    expect(global.server.pretender.handledRequests).toHaveLength(1)
    await delay(1500)
    const requests = global.server.pretender.handledRequests
    expect(requests).toHaveLength(2)
    expect(requests[0].responseURL).toEqual('/assets/locales/en.json')
    expect(requests[1].responseURL).toEqual('/assets/locales/pt.json')
  }, 10000)

  test('if Application changes language', async () => {
    const [wrapper] = renderComponent()
    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: en')).toBeTruthy()
    const helloWorlds = await wrapper.findAllByText('Hello World')
    expect(helloWorlds).toBeTruthy()
    expect(helloWorlds).toHaveLength(2)

    const pt = await wrapper.findByTestId('PT')

    fireEvent.click(pt)
    await delay(1000)

    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: pt')).toBeTruthy()
    
    await delay(3000)

    const olaMundos = await wrapper.findAllByText('Ola Mundo', {}, { timeout: 5000 })
    expect(olaMundos).toBeTruthy()
    expect(olaMundos).toHaveLength(2)
  }, 20000)

  test('if Application handler error on changing language', async () => {
    const [wrapper] = renderComponent()
    expect(await wrapper.findByText('status: Success', {}, { timeout: 5000 })).toBeTruthy()
    expect(await wrapper.findByText('language: en')).toBeTruthy()
    const helloWorlds = await wrapper.findAllByText('Hello World')
    expect(helloWorlds).toBeTruthy()
    expect(helloWorlds).toHaveLength(2)

    const pt = await wrapper.findByTestId('PT')

    global.server.get('/:language', () => new Response(500))

    fireEvent.click(pt)
    await delay(1000)

    expect(await wrapper.findByText('status: Error', {}, { timeout: 5000 })).toBeTruthy()
  }, 10000)
})
