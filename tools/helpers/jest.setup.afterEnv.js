// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { cleanup } from '@testing-library/react'
import startMirage from '../__mocks__/startMirage'
import mockMutationObserver from './mockMutationObserver'
import mockNavigator from './mockNavigator'

function noop() {}

beforeEach(() => {
  global.server = startMirage('test')
  String.prototype.matchAll = function (...args) {
    let pointerIndex = -1
    const groups = matchAll(this, ...args)

    return {
      next: () => {
        if (groups.next) {
          return groups.next()
        }

        pointerIndex += 1
        const group = groups[pointerIndex]
        if (!group) {
          return {
            done: true,
          }
        }

        return group
      },
    }
  }
  mockMutationObserver()
  mockNavigator()
  HTMLElement.prototype.scrollIntoView = noop
  localStorage.setItem('language', 'en')
  jest.useRealTimers()
})

afterEach(() => {
  global.server.shutdown()
  cleanup()
})
