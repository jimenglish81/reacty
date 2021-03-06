import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';

/**
 * Partially apply Function from right hand side with given number of optional
 * placeholders.
 * @param {Function} fn
 * @param {Object} args
 * @param {Number} placeholders
 * @return {Function}
 */
export const applyPartialRight = (fn, args, placeholders=0) => {
  return _.partialRight(fn, ..._.fill(Array(placeholders), _), ...[].concat(args));
}

/**
 * Transform Object into URI encoded query string.
 * @param {Object} target Object to transform.
 * @return {string}
 */
export const objectToQueryParams = (target) => {
  const encode = encodeURIComponent;
  return _.map(
            target,
            (value, key) => `${encode(key)}=${encode(value)}`)
            .join('&');
}

/**
 * Conditionally render a React component.
 * @param {boolean} cond Condition to evaluate.
 * @param {Element} node React element to render.
 * @param {Object} [empty=null]? Empty content to render.
 * @return {Element|String}
 */
export const conditionalRender = (cond, node, empty=null) => {
  return cond ? node : empty;
};

/**
 * Generate unique deal reference.
 * @param {string} accountId IG account id.
 * @param {number} timestamp Current DataTime
 * @return {string}
 */
export const generateDealReference = (accountId, timestamp=new Date().getTime()) => {
  return `MM-${timestamp}-${accountId}`;
};

/**
 * Format currency with optional symbol.
 * @param {string} value Value to format.
 * @param {number} [currency=''] Currency symbol.
 * @return {string}
 */
export const formatCurrency = (value, currency='') => {
  return `${currency}${numeral(value).format('0,0.00')}`;
};

/**
 * Generate HH:MM:SS time string from date string.
 * @param {string} timestamp DateTime string.
 * @return {string}
 */
export const formatTime = (timestamp) => {
  return moment(new Date(timestamp)).format('HH:mm:ss');
}
