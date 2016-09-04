import { API_CALL } from '../middlewares/api';
import {
  auth,
  unauth,
  sprints,
  market,
  createTrade
} from '../clients/api';
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,

  UNAUTH_REQUEST,
  UNAUTH_SUCCESS,
  UNAUTH_FAILURE,

  MARKETS_REQUEST,
  MARKETS_SUCCESS,
  MARKETS_FAILURE,

  MARKET_REQUEST,
  MARKET_SUCCESS,
  MARKET_FAILURE,

  TRADE_REQUEST,
  TRADE_SUCCESS,
  TRADE_FAILURE,

  SELECT_EPIC,

  MARKET_UPDATE,
} from './types';
import { hashHistory, push } from 'react-router';

/**
 * API action to authenticate user.
 * @param {String} identifier
 * @param {String} password
 * @return {Object}
 */
export const authUser = (identifier, password) => ({
  [API_CALL]: {
    apiMethod: auth.bind(null, identifier, password),
    authenticated: false,
    types: [AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE],
  },
});

/**
 * API action to unauthenticate user.
 * @param {String} identifier
 * @param {String} password
 * @return {Object}
 */
export const unauthUser = () => ({
  [API_CALL]: {
    apiMethod: unauth,
    authenticated: true,
    types: [UNAUTH_REQUEST, UNAUTH_SUCCESS, UNAUTH_FAILURE],
  },
});

/**
 * API action to fetch all Sprint Markets.
 * @return {Object}
 */
export const fetchMarkets = () => ({
  [API_CALL]: {
    apiMethod: sprints,
    authenticated: true,
    types: [MARKETS_REQUEST, MARKETS_SUCCESS, MARKETS_FAILURE],
  },
});

/**
 * API action to fetch a given market.
 * @param {String} epic
 * @return {Object}
 */
export const fetchMarket = (epic) => ({
  [API_CALL]: {
    apiMethod: market.bind(null, epic),
    authenticated: true,
    types: [MARKET_REQUEST, MARKET_SUCCESS, MARKET_FAILURE],
  },
});

/**
 * API action to create a trade.
 * @param {Object} data
 * @return {Object}
 */
export const submitTrade = (data) => ({
  [API_CALL]: {
    apiMethod: createTrade.bind(null, data),
    authenticated: true,
    types: [TRADE_REQUEST, TRADE_SUCCESS, TRADE_FAILURE],
  },
});

/**
 * Action to select a given epic.
 * @param {String} epic
 * @return {Object}
 */
export const selectEpic = (epic) => ({
  type: SELECT_EPIC,
  payload: epic,
});

/**
 * Action to request an update a given epic.
 * @param {String} epic
 * @param {Object} updates
 * @return {Object}
 */
export const marketUpdate = (epic, updates) => ({
  type: MARKET_UPDATE,
  payload: {
    epic,
    updates,
  },
});
