import { act } from '@testing-library/react'

export default async function delay(ms) {
  return await act(async () => await new Promise(resolve => setTimeout(() => resolve(), ms))) 
}