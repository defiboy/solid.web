import { combineReducers } from 'redux'

import { ContractState, appReducer as contractReducer, initialState as contractsInitialState } from "./contracts/reducer"
import { ConnectionState, appReducer as connectionReducer, initialState as connectionsInitialState } from "./connections/reducer"
import { CompilerState, appReducer as compilerReducer, initialState as compilerInitialState } from "./compiler/reducer"
import { ContractDefinitionState, appReducer as contractDefinitionReducer, initialState as contractDefinitionsInitialState } from './contract-definitions/reducer'
import { TabsManagerState, appReducer as tabsReducer, initialState as tabsManagerInitialState } from './tabs/reducer'
import { BlocksState, appReducer as blocksReducer, initialState as blocksInitialState } from './blocks/reducer'
import { TransactionsState, appReducer as transactionsReducer, initialState as transactionsInitialState } from './transactions/reducer'

export interface ApplicationState {
  contractState: ContractState
  connectionState: ConnectionState,
  compilerState: CompilerState,
  contractDefinitionState: ContractDefinitionState
  tabsManagerState: TabsManagerState,
  blocksState: BlocksState,
  transactionsState: TransactionsState
}

export const initialState: ApplicationState = {
  contractState: contractsInitialState,
  connectionState: connectionsInitialState,
  compilerState: compilerInitialState,
  contractDefinitionState: contractDefinitionsInitialState,
  tabsManagerState: tabsManagerInitialState,
  blocksState: blocksInitialState,
  transactionsState: transactionsInitialState
}

const rootReducer = combineReducers<ApplicationState>({
  contractState: contractReducer,
  connectionState: connectionReducer,
  compilerState: compilerReducer,
  contractDefinitionState: contractDefinitionReducer,
  tabsManagerState: tabsReducer,
  blocksState: blocksReducer,
  transactionsState: transactionsReducer
})

export default rootReducer
