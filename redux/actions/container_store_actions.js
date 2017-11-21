import * as types from '../types';

export function initContainerStore(containerName, store) {
    return {
        type: types.CONTAINER_STORE_INIT,
        payload: {
            fieldName: containerName,
            state: store
        }
    }
}

export function updateContainerStore(containerName, new_store) {
    return {
        type: types.CONTAINER_STORE_UPDATE,
        payload: {
            fieldName: containerName,
            state: new_store
        }
    }
}

export function updateFieldContainerStore(containerName, key, value) {
    return {
        type: types.CONTAINER_STORE_UPDATE_FIELD,
        payload: {
            fieldName: containerName,
            key: key,
            value: value
        }
    }
}