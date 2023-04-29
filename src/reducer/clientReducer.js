import {createSlice} from '@reduxjs/toolkit'

export const clientSlice = createSlice({
    name: 'clientReducer',
    initialState: {
        clients: {}
    },
    reducers: {
        addClient: (state, action) => {
            return {
                ...state,
                clients: {
                    ...state.clients,
                    [action.payload.id]: {
                        id: action.payload.id,
                        title: action.payload.title,
                        addr: action.payload.addr,
                        sendConfig: action.payload.sendConfig,
                        content:action.payload.content|| '',
                        messages: []
                    }
                }
            };
        },
        removeClient: (state, action) => {
            console.log(action.payload.id)
            const { [action.payload.id]: _, ...restClients } =
            state.clients || {};
            return {
                ...state,
                clients: restClients
            };
        },
        updateSendConfig: (state, action) => {
            // console.log(state.clients,action.payload.id)
            if(state.clients[action.payload.id] == null) {
                return state;
            }
            return {
                ...state,
                clients: {
                    ...state.clients,
                    [action.payload.id]: {
                        ...state.clients[action.payload.id],
                        sendConfig: action.payload.sendConfig,
                    }
                }
            };
        },
        updateAddr: (state, action) => {
            // console.log(state.clients,action.payload.id)
            if(state.clients[action.payload.id] == null) {
                return state;
            }
            return {
                ...state,
                clients: {
                    ...state.clients,
                    [action.payload.id]: {
                        ...state.clients[action.payload.id],
                        addr: action.payload.addr,
                    }
                }
            };
        },

        updateContent: (state, action) => {
            if(state.clients[action.payload.id] == null) {
                return state;
            }
            return {
                ...state,
                clients: {
                    ...state.clients,
                    [action.payload.id]: {
                        ...state.clients[action.payload.id],
                        content: action.payload.content,
                    }
                }
            };
        },
        addMsg: (state, action) => {
            if(state.clients[action.payload.id] == null) {
                return state;
            }
            return {
                ...state,
                clients: {
                    ...state.clients,
                    [action.payload.id]: {
                        ...state.clients[action.payload.id],
                        messages: [
                            ...state.clients[action.payload.id].messages,
                            action.payload.message
                        ]
                    }
                }
            };
        },
        cleanMsg: (state, action) => {
            if(state.clients[action.payload.id] == null) {
                return state;
            }
            return {
                ...state,
                clients: {
                    ...state.clients,
                    [action.payload.id]: {
                        ...state.clients[action.payload.id],
                        messages: []
                    }
                }
            };
        },
    },
})

export const { addClient,removeClient, updateContent,updateAddr,updateSendConfig,addMsg,cleanMsg } = clientSlice.actions

export default clientSlice.reducer
