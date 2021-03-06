import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import { KEY } from '../secret';
import { doGet, doPost, doDelete } from './request';

const BASE = 'https://demo-api.ig.com/gateway/deal/';
const createHeaders = (cst, xst) => {
  const headers = {
    'X-IG-API-KEY': KEY,
  };

  if (cst && xst) {
    return {
      ...headers,
      'CST': cst,
      'X-SECURITY-TOKEN': xst,
    };
  }

  return headers;
};

const parseSessionResp = (session) => {
  const {
    accountInfo: {
      available: availableCash,
      profitLoss,
    },
    currencySymbol: currency,
    currentAccountId: accountId,
    ['CST']: cst,
    lightstreamerEndpoint,
    ['X-SECURITY-TOKEN']: xst,
  } = session;

  return {
    accountId,
    availableCash,
    cst,
    currency,
    lightstreamerEndpoint,
    profitLoss,
    xst,
  };
};

const parseMarketNavigationResp = ({ markets }) => {
  return markets.map((market) => {
    return _.pick(market, [
      'epic',
      'instrumentName',
      'marketStatus',
    ]);
  });
};

const parseMarketResp = ({ instrument, snapshot, dealingRules }) => {
  return {
    currency: instrument.currencies && instrument.currencies[0].symbol,
    epic: instrument.epic,
    instrumentName: instrument.name,
    marketStatus: snapshot.marketStatus,
    strike: parseFloat(snapshot.bid),
    minDealSize: dealingRules.minDealSize.value,
    minExpiry: instrument.sprintMarketsMinimumExpiryTime / 60,
    maxExpiry: instrument.sprintMarketsMaximumExpiryTime / 60,
    prices: [],
  };
};

const parseChartResp = (epic) => ({ prices }) => ({
  epic,
  dataPoints: prices.map(({ snapshotTime: timestamp, closePrice: { bid } }) => ({
    timestamp,
    price: parseFloat(bid),
  }))
});

const parsePositions = ({ sprintMarketPositions }) => {
  return sprintMarketPositions.map((position) => ({
    instrumentName: position.instrumentName,
    payoutAmount: parseFloat(position.payoutAmount),
    expiryTime: position.expiryTime,
    createdDate: position.createdDate,
    dealId: position.dealId,
    epic: position.epic,
    stake: parseFloat(position.size),
    strikeLevel: parseFloat(position.strikeLevel),
    direction: position.direction === 'BUY' ? 'ABOVE' : 'BELOW',
    isSettled: false,
  }));
};

/**
 * Parse OPU to Position.
 * @param {Object} opu OPU recieved from LS.
 * @param {Object} market Associated Market.
 * @return {Object}
 */
export const parseOpu = (opu, market) => {
  return {
    instrumentName: market.instrumentName,
    payoutAmount: parseFloat(opu.payoutAmount),
    expiryTime: opu.expiryTime,
    createdDate: opu.createdDate,
    dealId: opu.dealId,
    epic: opu.epic,
    status: opu.status,
    stake: parseFloat(opu.size),
    strikeLevel: parseFloat(opu.level),
    direction: opu.direction === 'BUY' ? 'ABOVE' : 'BELOW',
    isSettled: false,
  }
};

/**
 * Login user.
 * @param {string} identifier Users identifier.
 * @param {string} password Users password.
 * @param {string} [encryptedPassword=false] If encyrpted.
 * @return {Promise<Object>}
 */
export function auth(identifier, password, encryptedPassword=false) {
  const data = {
    identifier,
    password,
    encryptedPassword,
  };

  return doPost(`${BASE}session`, createHeaders(), null, data, ['CST', 'X-SECURITY-TOKEN'])
        .then(parseSessionResp);
}

/**
 * Logout user.
 * @param {string} cst Client auth token.
 * @param {string} xst Account auth token.
 * @return {Promise<Object>}
 */
export function unauth(cst, xst) {
  return doDelete(`${BASE}session`, createHeaders(cst, xst));
}

// Path in hierarchy...
// 357975
//    381908
//        381909
function marketNavigation(id, cst, xst) {
  const headers = createHeaders(cst, xst);
  const url = `${BASE}marketnavigation${id ? `/${id}` : ''}`;

  return doGet(url, headers);
}

/**
 * Get Fast Markets.
 * @param {string} cst Client auth token.
 * @param {string} xst Account auth token.
 * @return {Promise<Object[]>}
 */
export function sprints(cst, xst) {
  return marketNavigation('302308', cst, xst)
          .then(parseMarketNavigationResp);
}

/**
 * Get Chart Data.
 * @param {string} epic Market epic to load.
 * @param {string} cst Client auth token.
 * @param {string} xst Account auth token.
 * @return {Promise<Object>}
 */
export function market(epic, cst, xst) {
  const headers = {
    ...createHeaders(cst, xst),
    version: 3,
  };
  const url = `${BASE}markets/${epic}`;

  return doGet(url, headers)
          .then(parseMarketResp);
}

/**
 * Get Chart Data.
 * @param {string} epic Market epic to load.
 * @param {string} cst Client auth token.
 * @param {string} xst Account auth token.
 * @return {Promise<Object>}
 */
export function chart(epic, cst, xst) {
  const headers = {
    ...createHeaders(cst, xst),
    version: 2,
  };
  const url = `${BASE}prices/${epic}/SECOND/30`;

  return doGet(url, headers)
          .then(parseChartResp(epic));
}

/**
 * Get Positions.
 * @param {string} cst Client auth token.
 * @param {string} xst Account auth token.
 * @return {Promise<Object[]>}
 */
export function positions(cst, xst) {
  const headers = {
    ...createHeaders(cst, xst),
    version: 2,
  };
  const url = `${BASE}positions/sprintmarkets`;

  return doGet(url, headers)
          .then(parsePositions);
}

/**
 * Create Position.
 * @param {Object} data Trade data.
 * @param {string} cst Client auth token.
 * @param {string} xst Account auth token.
 * @return {Promise<Object>}
 */
export function createTrade(data, cst, xst) {
  const url = `${BASE}positions/sprintmarkets`;

  return doPost(url, createHeaders(cst, xst), null, data);
}
