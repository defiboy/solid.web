import { ActionCreator, Action } from 'redux'

import { TransactionReceipt } from '@solidstudio/solid.types'

import { ActionType, TransactionsReceivedAction, GetTransactionsAction } from './action-types'

export const transactionsReceived: ActionCreator<Action> = (
  transactions: TransactionReceipt[]
): TransactionsReceivedAction => {
  return {
    type: ActionType.TRANSACTIONS_RECEIVED,
    payload: transactions
  }
}

export const getTransactions: ActionCreator<Action> = (): GetTransactionsAction => {
  return {
    type: ActionType.GET_TRANSACTIONS
  }
}
