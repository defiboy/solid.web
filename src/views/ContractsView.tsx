
import React from 'react'
import { Action, ActionCreator, bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Layout } from 'antd'

import { Contract, Connection } from '@solid-explorer/types'

import { getContracts, maximizeContractView } from 'features/contracts/actions'
import { ContractsTable, ContractDetails } from 'features/contracts/components'

import { ApplicationState } from 'features/rootReducer'
import { emitter } from 'features/common/event-emitter'

import client from '../utils/feathers'

import { StyledDiv, StyledH1, SiderView } from './components'
import { ConnectionNormalized } from 'features/connections/types'

const { Sider, Content } = Layout;

interface StateProps {
    contracts: Contract[]
    currentConnection: Connection | undefined
}

interface DispatchProps {
    maximizeContractView: ActionCreator<Action>
    getContracts: ActionCreator<Action>
}

type AllProps = DispatchProps & StateProps //  OwnProps & 

interface State {
    showContractDrawer: boolean
    drawerWidth: number
    selectedContractRowItem?: Contract
}

export class ContractsView extends React.Component<AllProps, State> {
    static defaultProps = {
        contracts: []
    }

    constructor(props: AllProps) {
        super(props)
        this.state = {
            showContractDrawer: false,
            drawerWidth: 470,
            selectedContractRowItem: undefined
        }
    }

    componentDidMount() {
        if (this.props.currentConnection) {
            this.props.getContracts(this.props.currentConnection.id)

            // TODO IMPROVE
            client.service('contracts')
                .on('created', (message: string) => {
                    setTimeout(() => {
                        if (this.props.currentConnection) {
                            this.props.getContracts(this.props.currentConnection.id)
                        }
                    }, 500);
                });
        }
    }

    onContractClick = (record: Contract) => {
        this.setState({
            showContractDrawer: true,
            selectedContractRowItem: record
        }, () => {
            emitter.emit("COLLAPSE_RIGHT_SIDEBAR_MENU")
        })
    }

    onDoubleClick = (record: Contract) => {
        console.log("DOUBLE CLICK", record)
    }

    maximiseWindow = () => {
        const contractToShow = this.state.selectedContractRowItem
        this.setState({
            showContractDrawer: false
        }, () => {
            this.props.maximizeContractView({
                ...contractToShow,
                type: 'editor'
            })
        })
    }

    closeSider = () => {
        this.setState({
            showContractDrawer: false
        })
    }
    render() {
        const { showContractDrawer, drawerWidth, selectedContractRowItem } = this.state
        const { contracts, currentConnection } = this.props
        return (
            <Layout style={{ height: "100%" }}>
                <Content style={{ height: "100%" }}>
                    <StyledDiv>
                        <StyledH1>Contracts</StyledH1>
                        <ContractsTable
                            onClick={this.onContractClick}
                            onDoubleClick={this.onDoubleClick}
                            contracts={contracts} />
                    </StyledDiv>
                </Content>
                <SiderView collapsed={!showContractDrawer} onClose={this.closeSider}>
                    {selectedContractRowItem && currentConnection &&
                        <ContractDetails currentConnection={currentConnection} contract={selectedContractRowItem} />}
                </SiderView>
            </Layout>
        )
    }
}


const mapStateToProps = ({ contractState, connectionState }: ApplicationState) => {
    const currentConnectionId = connectionState.currentConnection ? connectionState.currentConnection.id as number : 0
    const connection = connectionState.connections.byId[currentConnectionId] as ConnectionNormalized || {}
    const allContractIdsByConnection = connection.contracts as string[]

    const contractsByConnection = allContractIdsByConnection && allContractIdsByConnection.map((id: string) => {
        return contractState.contracts.byId[id];
    })

    return {
        contracts: contractsByConnection,
        currentConnection: connectionState.currentConnection
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
        {
            getContracts,
            maximizeContractView
        },
        dispatch
    )
}

export default connect<StateProps, DispatchProps, {}, ApplicationState>(
    mapStateToProps,
    mapDispatchToProps
)(ContractsView)
