import {
  AUTH_SUCCESS
} from '../actions/types';
import  {
  confirmRecieved,
  positionRecieved,
  accountUpdate
} from '../actions';

// TODO - move somewhere more appropriate.
const parseOpu = (opu) => {
  return {
    instrumentName: 'Lookup on state by epic',
    payoutAmount: opu.payoutAmount,
    expiryTime: opu.expiryTime,
    dealId: opu.dealId,
    epic: opu.epic,
    status: opu.status,
    size: opu.size,
    strikeLevel: opu.level,
    direction: opu.direction,
  }
};

export default (
  tradeSubscription,
  positionSubscription,
  balanceSubscription
) => (store) => (next) => (action) => {
  if (action.type === AUTH_SUCCESS) {
    const { accountId } = action.payload;
    tradeSubscription.subscribe(accountId, (confirm) => {
      store.dispatch(confirmRecieved(confirm));
    });

    positionSubscription.subscribe(accountId, (opu) => {
      store.dispatch(positionRecieved(parseOpu(opu)));
    });

    balanceSubscription.subscribe(accountId, (updates) => {
      store.dispatch(accountUpdate(updates));
    });
  }
  next(action);
}