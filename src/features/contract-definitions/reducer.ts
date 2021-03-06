import { Reducer } from 'redux'

import { ContractDefinition, FileItem } from '@solid-explorer/types'

import { Status } from '../common/types'

import { ActionType, Actions } from './action-types'
import { ActionType as FileItemActionType } from '../file-items/action-types'

export interface ContractDefinitionState {
  contractDefinitions: ContractDefinition[]
  currentContractDefinition?: ContractDefinition
  getContractDefinitionsStatus: Status
  contractDefinitionModalOpen: boolean
  createContractDefinitionStatus: Status
  fileItems: FileItem[]
}

export const contractDefinitionsInitialState: ContractDefinitionState = {
  contractDefinitions: [],
  currentContractDefinition: undefined,
  getContractDefinitionsStatus: Status.NotStarted,
  contractDefinitionModalOpen: false,
  createContractDefinitionStatus: Status.NotStarted,
  fileItems: []
}

export const contractDefinitionReducer: Reducer<ContractDefinitionState, Actions> = (
  state: ContractDefinitionState = contractDefinitionsInitialState,
  action: Actions
): ContractDefinitionState => {
  switch (action.type) {
    case FileItemActionType.FILE_ITEMS_RECEIVED:
      return { ...state, fileItems: action.payload }
    case ActionType.FILES_RECEIVED:
      return { ...state, fileItems: action.payload }
    case ActionType.CLOSE_CONTRACT_DEFINITION_MODAL:
      return { ...state, contractDefinitionModalOpen: false, currentContractDefinition: undefined }
    case ActionType.OPEN_CONTRACT_DEFINITION_MODAL:
      return { ...state, contractDefinitionModalOpen: true, currentContractDefinition: action.payload }
    case ActionType.GET_CONTRACT_DEFINITIONS:
      return { ...state, getContractDefinitionsStatus: Status.InProgress }
    case ActionType.CONTRACTS_DEFINITIONS_RECEIVED:
      return {
        ...state,
        contractDefinitions: action.payload,
        currentContractDefinition: action.payload[0],
        getContractDefinitionsStatus: Status.Completed
      }
    case ActionType.CONTRACT_DEFINITION_SELECTED:
      return { ...state, currentContractDefinition: action.payload }
    case ActionType.CREATE_CONTRACT_DEFINITION:
      return { ...state, createContractDefinitionStatus: Status.InProgress }
    case ActionType.CONTRACT_DEFINITION_CREATED:
      const newContractDefinitions = [...state.contractDefinitions, action.payload]
      return {
        ...state,
        contractDefinitions: newContractDefinitions,
        currentContractDefinition: action.payload,
        createContractDefinitionStatus: Status.Completed
      }
    default:
      return state
  }
}
