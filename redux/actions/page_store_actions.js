import * as types from '../types';

export function initPageStore(pageName, store) {
    return {
        type: types.PAGE_STORE_INIT,
        payload: {
            fieldName: pageName,
            state: store
        }
    }
}

export function updatePageStore(pageName, new_store) {
    return {
        type: types.PAGE_STORE_UPDATE,
        payload: {
            fieldName: pageName,
            state: new_store
        }
    }
}

export function updateFieldPageStore(pageName, key, value) {
    return {
        type: types.PAGE_STORE_UPDATE_FIELD,
        payload: {
            fieldName: pageName,
            key: key,
            value: value
        }
    }
}