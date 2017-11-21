import * as types from '../types';
import { isValue } from '../../function/general';

const initialState = {}

export default (state = initialState, action) => {
    let new_state = { ...state };
    if(action.payload && 
        typeof action.payload.fieldName === "string"
    ) {
        const { fieldName } = action.payload;
        if(action.payload.state &&
            typeof action.payload.state === "object" &&
            (action.type === types.PAGE_STORE_INIT || action.type === types.PAGE_STORE_UPDATE)
        ) {
            new_state[fieldName] = action.payload.state;
        }
        else if(typeof action.payload.key === "string" &&
            isValue(action.payload.value) && action.type === types.PAGE_STORE_UPDATE_FIELD
        ) {
            if(!new_state[fieldName]) new_state[fieldName] = {};
            new_state[fieldName][action.payload.key] = action.payload.value;
        }
    }
    return { ...new_state }
}