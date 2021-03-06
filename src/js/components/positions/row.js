import React, { PropTypes } from 'react';
import { formatCurrency, formatTime } from '../../utils';
import Sparkline from '../chart/sparkline';
import CountDown from './expiry-countdown';

/**
 * Positions for app.
 * @param {Object} props
 * @return {Element}
 */
const Row = (props) => {
  const {
    position: {
      createdDate,
      instrumentName,
      dealId,
      direction,
      stake,
      expiryTime,
      strikeLevel,
      payoutAmount,
      isSettled,
    },
    market: {
      currency,
      prices,
      strike,
    },
    isWinning,
  } = props;

  // TODO - move to component
  if (isSettled) {
    const settlementClassName = isWinning ? 'settlement--won' : 'settlement--lost';
    return (
      <div className={`settlement ${settlementClassName}`}>
        {isWinning ? `You just won ${formatCurrency(payoutAmount, currency)}!` : 'You were unsuccessful this time.'}
      </div>
    );
  }

  return (
    <div className="positions-row">
      <div className="positions-cell positions-cell__market-name">
        <div className="positions-cell__market-name-inner">{instrumentName}</div>
        <div className="positions-cell__market-name-sparkline">
          <Sparkline
            height={17}
            isWinning={isWinning}
            prices={prices}
            strikeLevel={strikeLevel}
            width={90}
          />
        </div>
      </div>
      <div className="positions-cell positions-cell__direction">
        {direction === 'ABOVE' ? 'Above' : 'Below'}
      </div>
      <div className="positions-cell positions-cell__expiry">
        <span className="positions-cell__expiry--wide">
          {formatTime(expiryTime)}
        </span>
        <span className="positions-cell__expiry--narrow">
          <CountDown
            position={props.position}
            isWinning={isWinning}
          />
        </span>
      </div>
      <div className="positions-cell positions-cell__strike">
        {formatCurrency(strikeLevel)}
      </div>
      <div className="positions-cell positions-cell__latest">
        {formatCurrency(strike)}
      </div>
      <div className="positions-cell positions-cell__stake">
        {formatCurrency(stake)}
      </div>
      <div className="positions-cell positions-cell__payout">
        {formatCurrency(payoutAmount)}
      </div>
    </div>
  )
};

Row.propTypes = {
  isWinning: PropTypes.bool,
  market: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
};

export default Row;
