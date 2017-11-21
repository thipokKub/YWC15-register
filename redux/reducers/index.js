import { combineReducers } from 'redux';
import test_reducer from './test_reducer';
import map_reducer from './map_reducer';
import page_store_reducer from './page_store_reducer';
import container_store_reducer from './container_store_reducer';

const rootReducer = combineReducers({
    test: test_reducer,
    map: map_reducer,
    page: page_store_reducer,
    container: container_store_reducer
});

export default rootReducer;