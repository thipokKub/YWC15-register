import * as test_actions from './test_actions';
import * as map_actions from './map_actions';
import * as page_store_actions from './page_store_actions';
import * as container_store_actions from './container_store_actions';

const rootActions = {
    ...test_actions,
    ...map_actions,
    ...page_store_actions,
    ...container_store_actions
}

export default rootActions;