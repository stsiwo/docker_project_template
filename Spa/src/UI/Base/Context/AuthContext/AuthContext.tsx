import { createContext, useContext, useReducer, Reducer, ReducerState, Dispatch, ReducerAction } from "react";
import { AuthContextType, AuthContextActionType, AuthType } from "./types";
import { storeUserInfo, removeUserInfo, isUserLoggedIn, getUserInfo } from "../../../../storages/user";
import { Action } from "redux";
import { getUserTestData } from '../../../../../tests/data/UserFaker';
import { logger } from 'configs/logger';
const log = logger("AuthContext");


// for provider
export const AuthContext = createContext<AuthContextType>(null);

// for consumer 
export const useAuthContext = (): AuthContextType => {
  return useContext<AuthContextType>(AuthContext);
}

// for update this context
const updateAuthContextReducer: Reducer<AuthType, AuthContextActionType> = (state, action) => {
  switch (action.type) {
    case 'login':
      log('action:')
      log(action)
      storeUserInfo(action.user)
      return {
        authed: true,
        user: action.user
      }
    case 'logout':
      removeUserInfo()
      return {
        authed: false
      }
    default:
      return state
  }
}


export const useUpdateAuthContextReducer = (initialAuth: AuthType = null): [ReducerState<Reducer<AuthType, AuthContextActionType>>, Dispatch<ReducerAction<Reducer<AuthType, AuthContextActionType>>>] => {

  //const defaultAuth = initialAuth ? initialAuth : { authed: false }
  let defaultAuth = isUserLoggedIn() ? { authed: true, user: getUserInfo() } : { authed: false }
  if (NODE_ENV === 'development') defaultAuth = {
    authed: true,
    user: getUserTestData(1)[0]
  }
  return useReducer(updateAuthContextReducer, defaultAuth)
}

/**
 * #REFACTOR #DOUBT
 * need some ways to detect jwt token is in httponly cookie otherwise there is gap btw auth state in app and cookie
 **/
