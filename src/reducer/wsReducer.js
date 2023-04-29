import {createSlice} from '@reduxjs/toolkit'

export const connSlice = createSlice({
    name: 'connReducer',
    initialState: {
        connections: {}
    },
    reducers: {
        addWebsocket: (state, action) => {
            return {
                ...state,
                connections: {
                    ...state.connections,
                    [action.payload.id]: {
                        socket: action.payload.socket,
                        scheduleTask: action.payload.scheduleTask,
                        sending:action.payload.sending || false,
                        messages: []
                    }
                }
            };
        },
        removeWebsocket: (state, action) => {
            const { [action.payload.id]: _, ...restConnections } =
            state.connections || {};
            return {
                ...state,
                connections: restConnections
            };
        },

        addScheduleTask: (state, action) => {
            console.log('task',action.payload.scheduleTask)
            return {
                ...state,
                connections: {
                    ...state.connections,
                    [action.payload.id]: {
                        ...state.connections[action.payload.id],
                        scheduleTask: action.payload.scheduleTask,
                    }
                }
            };
        },
        cancelScheduleTask:(state, action) => {
            let scheduleTask = state.connections[action.payload.id].scheduleTask;
            if (scheduleTask){
                clearInterval(scheduleTask)
            }
            return {
                ...state,
                connections: {
                    ...state.connections,
                    [action.payload.id]: {
                        ...state.connections[action.payload.id],
                        sending: false,
                    }
                }
            };

        },

        updateSendingState:(state, action) => {
            if(state.connections[action.payload.id] == null) {
                return state;
            }
            return {
                ...state,
                connections: {
                    ...state.connections,
                    [action.payload.id]: {
                        ...state.connections[action.payload.id],
                        sending: action.payload.sending,
                    }
                }
            };
        },
        receiveMsg: (state, action) => {
            console.log(state.connections,action.payload.id)
            if(state.connections[action.payload.id] == null) {
                return state;
            }
            return {
                ...state,
                connections: {
                    ...state.connections,
                    [action.payload.id]: {
                        socket: state.connections[action.payload.id].socket,
                        messages: [
                            ...state.connections[action.payload.id].messages,
                            action.payload.message
                        ]
                    }
                }
            };
        },

        cleanMsg: (state, action) => {
            if(state.connections[action.payload.id] == null) {
                return state;
            }
            return {
                ...state,
                connections: {
                    ...state.connections,
                    [action.payload.id]: {
                        socket: state.connections[action.payload.id].socket,
                        messages: []
                    }
                }
            };
        },

    },
})
export const selectSocket = (state) => state.connections
// Action creators are generated for each case reducer function
export const { addWebsocket,addScheduleTask,removeWebsocket,cancelScheduleTask, updateSendingState } = connSlice.actions

export default connSlice.reducer
