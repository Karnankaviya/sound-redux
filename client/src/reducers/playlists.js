import * as types from '../constants/ActionTypes';
import { HISTORY_PLAYLIST, SESSION_LIKES_PLAYLIST } from '../constants/PlaylistConstants';

const initialState = {
  isFetching: false,
  items: [],
  futureUrl: null,
  nextUrl: null,
};

function playlist(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_SONGS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case types.FETCH_SONGS_SUCCESS:
      return {
        ...state,
        futureUrl: action.futureUrl,
        isFetching: false,
        items: [...state.items, ...action.items],
        nextUrl: action.nextUrl,
      };

    case types.PLAY_SONG:
      return {
        ...state,
        items: [
          ...state.items.filter(id => id !== action.id),
          action.id,
        ],
      };

    case types.TOGGLE_LIKE_SUCCESS:
      return {
        ...state,
        items: action.liked
          ? [action.id, ...state.items]
          : state.items.filter(id => id !== action.id),
      };

    default:
      return state;
  }
}

export default function playlists(state = {}, action) {
  switch (action.type) {
    case types.FETCH_SONGS_REQUEST:
    case types.FETCH_SONGS_SUCCESS:
      return {
        ...state,
        [action.playlist]: playlist(state[action.playlist], action),
      };

    case types.PLAY_SONG:
      return {
        ...state,
        [HISTORY_PLAYLIST]: playlist(
          state[HISTORY_PLAYLIST],
          {
            ...action,
            id: state[action.playlist].items[action.playingIndex],
          },
        ),
      };

    case types.TOGGLE_LIKE_SUCCESS:
      return {
        ...state,
        [SESSION_LIKES_PLAYLIST]: playlist(state[SESSION_LIKES_PLAYLIST], action),
      };

    default:
      return state;
  }
}
