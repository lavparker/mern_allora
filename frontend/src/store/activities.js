import jwtFetch from "./jwt";
import { fetchTripActivities } from "./trips";

// const RECEIVE_NEW_ACTIVITY = 'activities/RECEIVE_NEW_ACTIVITY';
// const RECEIVE_TRIP_ACTIVITIES = 'activities/RECEIVE_TRIP_ACTIVITIES';
const RECEIVE_ACTIVITY_ERRORS = 'activities/RECEIVE_ACTIVITY_ERRORS';
const CLEAR_ACTIVITY_ERRORS = 'activities/CLEAR_ACTIVITY_ERRORS';
const RECEIVE_ACTIVITY = 'activities/RECEIVE_ACTIVITY';

const RECEIVE_ACTIVITY_COMMENTS = 'comments/RECEIVE_ACTIVITY_COMMENTS';

// const receiveNewActivity = activity => ({
//     type: RECEIVE_NEW_ACTIVITY,
//     activity
// })
const receiveActivity = activity => ({
    type: RECEIVE_ACTIVITY,
    activity
})

// const receiveTripActivities = activities => ({
//     type: RECEIVE_TRIP_ACTIVITIES,
//     activities
// })

const receiveActivityComments = comments => ({
    type: RECEIVE_ACTIVITY_COMMENTS,
    comments
})

const receiveActivityErrors = errors => ({
    type: RECEIVE_ACTIVITY_ERRORS,
    errors
})

const clearActivityErrors = errors => ({
    type: CLEAR_ACTIVITY_ERRORS,
    errors
})

// export const getTripActivities = tripId => state => (
//     Object.values(state.activities)
//     .filter(activity => activity.tripId === tripId)
//     .map(activity => ({
//         ...activity,
//         creator: state.users[activity.creatorId]?.username
//     }))
// );

// export const fetchTripActivities = tripId => async dispatch => {
//     try {
//         const res = await jwtFetch(`/api/activities/trip/${tripId}`);
//         const activities = await res.json();
//         dispatch(receiveTripActivities(activities));
//     } catch(err) {
//         const resBody = await err.json();
//         if (resBody.statusCode === 400) {
//             return dispatch(receiveActivityErrors(resBody.errors));
//         }
//     }
// }


export const createActivity = data => async dispatch => {
    try {
        const res = await jwtFetch('/api/activities', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const activity = await res.json();
        dispatch(receiveActivity(activity));
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
          return dispatch(receiveActivityErrors(resBody.errors));
        }
    }
}

export const fetchActivity = activityId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/activities/${activityId}`);
        const activity = await res.json();
        dispatch(receiveActivity(activity));
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
          return dispatch(receiveActivityErrors(resBody.errors));
        }
    } 
    
}

export const deleteActivity = (activityId) => async (dispatch) => {
    const res = await jwtFetch(`/api/activities/${activityId}`, {
        method: "DELETE",
    });
    const data = await res.json();
    dispatch(fetchTripActivities(data.trip));
    return;
};

export const upvoteActivity = activityId => async dispatch => {
    // try {
        const res = await jwtFetch(`/api/activities/${activityId}/upvote`, {
            method: 'PUT'
        })
        const activity = await res.json();
        dispatch(fetchTripActivities(activity.trip));
        // dispatch(receiveActivity(activity));
        // return;
    // } catch(err) {
    //     const resBody = await err.json();
    //     if (resBody.statusCode === 400) {
    //         return dispatch(receiveActivityErrors(resBody.errors));
    //     }
    // }
}

export const downvoteActivity = activityId => async dispatch => {
    // try {
        const res = await jwtFetch(`/api/activities/${activityId}/downvote`, {
            method: 'PUT'
        })
        const activity = await res.json();
        dispatch(fetchTripActivities(activity.trip));
        // return;
    // } catch(err) {
    //     const resBody = await err.json();
    //     if (resBody.statusCode === 400) {
    //         return dispatch(receiveActivityErrors(resBody.errors));
    //     }
    // }
}


export const fetchActivityComments = activityId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/comments/activity/${activityId}`);
        const comments = await res.json();
        dispatch(receiveActivityComments(comments));
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch (receiveCommentErrors(resBody.errors));
        }
    }
}

const nullErrors = null;

export const activityErrorsReducer = (state = nullErrors, action) => {
    switch(action.type) {
      case RECEIVE_ACTIVITY_ERRORS:
        return action.errors;
      case CLEAR_ACTIVITY_ERRORS:
        return nullErrors;
      default:
        return state;
    }
};



// const activitiesReducer = (state = {}, action) => {
//     switch(action.type) {
//         case RECEIVE_NEW_ACTIVITY:
//             let newState = { ...state };
//             newState.all[action.activity.id] = action.activity; 
//             newState.new = action.activity;
//             return newState;
//         case RECEIVE_TRIP_ACTIVITIES:
//             return { ...state, all: action.activities, new: undefined };
//         case RECEIVE_ACTIVITY:
//             return {activity : action.activity };
//         default:
//             return state;
//     }


const activitiesReducer = (state = {}, action) => {
    switch(action.type) {
        case RECEIVE_ACTIVITY:
            return { ...state, ...action.activity };
        case RECEIVE_ACTIVITY_COMMENTS:
            state.activity = action.comments;
            return {...state};
        default:
            return state;
    }
};

export default activitiesReducer;