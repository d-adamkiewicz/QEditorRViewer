import { combineReducers } from 'redux'
import {
	  SET_ACTIVE
	, CHANGE_CAT_ID
	, ADD_SQL_TEXT 
    , UPDATE_SQL_TEXT
	, GET_OUTCOME
	, CLEAR_OUTCOME
	, SET_SQLTEXTS
	, SET_CATS
} from '../actions'


function active(state = {}, action) {
    switch (action.type) {
        case SET_ACTIVE:
            return {
                id: action.id
				, updateKey: Math.random()
            }         
        default:
            return state
    }
}

function catId(state = {}, action) {
	switch (action.type) {
		case CHANGE_CAT_ID:
			return action.catId
        default:
            return state
	}
}

function cats(state = {}, action) {
	switch (action.type) {
		case SET_CATS:
			return action.cats
        default:
            return state
	}
}

function sqlTexts(state = [], action) {
    switch (action.type) {
        case ADD_SQL_TEXT:
            return [
                ...state
                , {
					id: action.id
					, text: action.text                    
                }
            ]       
        case UPDATE_SQL_TEXT:
            return state.map((item) => {
                if (action.id!==item.id) {
                    return item
                }
                return {
					id: action.id
					, text: action.text                    
                };
            });
		case SET_SQLTEXTS:
			return action.sqlTexts
        default:
            return state
    }
}

function outcome(state = {}, action) {
	switch (action.type) {
		case GET_OUTCOME:
			return Object.assign({}, state, action.outcome)	
		case CLEAR_OUTCOME:
			return {}
		default:
			return state
	}
}

const rootReducer = combineReducers({
    active
	, cats
	, catId
    , sqlTexts
	, outcome
})

export default rootReducer
