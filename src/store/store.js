import { configureStore } from '@reduxjs/toolkit'
import connReducer from '../reducer/wsReducer.js'
import clientReducer from '../reducer/clientReducer'
export default configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    reducer: {connReducer,clientReducer},
})
