import { configureStore } from '@reduxjs/toolkit'
import authUser from './features/user/AuthSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        auth: authUser
    },
  })
}