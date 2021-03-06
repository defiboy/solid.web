import React from 'react'
import { Action, ActionCreator } from 'redux'
import { Icon } from 'antd'

import { MenuStyled, MenuItemStyled, SidebarHeader, SidebarTitle, SidebarHeaderButtons, DirectoryTreeStyled } from './GenericTreeStyledComponents';
import { emitter } from '../features/common/event-emitter'

interface MenuItemOption {
    name: string
    id: string
}

interface DataRowProps<T> {
    item: T
}

interface Props<T> {
    dataItems: T[]
    onClickDataItem?: ActionCreator<Action> | any// TODO FIX
    headerTitle: string
    showFolderUpload?: boolean
    onFolderUploadClick?: ActionCreator<Action>
    onPlusClick?: ActionCreator<Action>
    onCollapseClick?: ActionCreator<Action>
    rightClickMenuItems?: MenuItemOption[]
    selectorPrefix: string
    onExpand?: any // TODO
    onLoad?: any // TODO creo que no necesito esto
    DataRowComponentRender: (t: T) => React.ReactNode | React.ComponentClass<DataRowProps<T>> | React.StatelessComponent<DataRowProps<T>>
}

interface State {
    rightClickNodeTreeItem: any
    selectedKeys: string[] | undefined,
    expandedKeys: string[] | undefined
}

export class GenericTree<T> extends React.Component<Props<T>, State> {
    static defaultProps = {
        dataItems: []
    }

    constructor(props: Props<T>) {
        super(props)
        this.state = {
            rightClickNodeTreeItem: {},
            selectedKeys: [],
            expandedKeys: []
        }

    }

    componentDidMount() {
        emitter.on("IDECLICKED", () => {
            this.closeContextMenu()
        })

        emitter.on("UNSELECT_OTHER_TREES", (callback) => {
            this.unSelectKeys(callback) // TODO: REVIEW because maybe I should pass callback..
        })
    }

    // TODO IMPROVE TYPE
    unSelectKeys = (callback: any) => {
        this.setState({
            selectedKeys: []
        }, () => callback())
    }

    onExpand = (expandedKeys: string[] | undefined, info: any) => {
        // { expanded: bool, node }
        this.setState({
            expandedKeys
        }, () => {
            if (this.props.onExpand) {
                this.props.onExpand(expandedKeys, info)
            }
        })
    }

    onSelect = (selectedKeys: string[] | undefined, info: any) => {
        emitter.emit("UNSELECT_OTHER_TREES", () => {
            this.setState({
                selectedKeys
            }, () => {
                if (this.props.onClickDataItem) {
                    this.props.onClickDataItem(selectedKeys, info.node.props, info.node.props.extra)
                }
            })
        })
    }

    rightClickOnTree = ({ event, node }: any) => {
        const id = node.props.eventKey
        this.setState({
            rightClickNodeTreeItem: {
                pageX: event.pageX,
                pageY: event.pageY,
                id,
                categoryName: node.props.eventKey
            },
            selectedKeys: [id]
        })
    }

    getMenu = (pageX: number, pageY: number, selectorPrefix: string, options: MenuItemOption[]) => {
        return <MenuStyled style={{ position: 'absolute', left: `${pageX}px`, top: `${pageY}px` }}>
            {options && options.length > 0 && options.map((option) => {
                return <MenuItemStyled data-testid={`${selectorPrefix}-tree-rightclick-menu-option-${option.id}`}
                    key={option.id}>{option.name}</MenuItemStyled>
            })}
        </MenuStyled>
    }

    closeContextMenu = () => {
        this.setState({
            rightClickNodeTreeItem: {}
        })
    }

    getNodeTreeRightClickMenu = () => {
        const { pageX, pageY } = { ...this.state.rightClickNodeTreeItem } as any
        if (!pageX || !pageY) {
            return <div />
        }

        if (!this.props.rightClickMenuItems) {
            return <div />
        }

        const menu = this.getMenu(pageX, pageY, this.props.selectorPrefix, this.props.rightClickMenuItems)

        return menu
    }

    render() {
        const { dataItems, DataRowComponentRender, onFolderUploadClick, showFolderUpload, headerTitle, onPlusClick, selectorPrefix, onLoad } = this.props
        return (
            <div style={{ overflow: 'scroll', height: '100%' }}>
                {this.getNodeTreeRightClickMenu()}
                <SidebarHeader>
                    <SidebarTitle data-testid={`${selectorPrefix}-tree-header`}>{headerTitle}</SidebarTitle>
                    <SidebarHeaderButtons className="sidebar-header">
                        {/* <Icon type="down" data-testid={`${selectorPrefix}-tree-down`} style={{ color: 'white' }} onClick={onCollapseClick} /> */}
                        <Icon type="plus" data-testid={`${selectorPrefix}-tree-plus`} style={{ color: 'white', paddingRight: '0.5em', marginTop: "0.1em" }} onClick={onPlusClick} />
                        {showFolderUpload && onFolderUploadClick &&
                            <Icon type="folder-add" data-testid={`${selectorPrefix}-tree-folder-add`} style={{ color: 'white', paddingRight: '0.5em', fontSize: "1.2em", cursor: "pointer" }} onClick={onFolderUploadClick} />
                        }
                    </SidebarHeaderButtons>
                </SidebarHeader>
                {dataItems.length > 0 && (
                    <DirectoryTreeStyled
                        onSelect={this.onSelect}
                        multiple={true}
                        onLoad={onLoad}
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        onRightClick={this.rightClickOnTree}
                        selectedKeys={this.state.selectedKeys}
                        defaultExpandAll={true}
                        style={{ color: 'white' }}>
                        {dataItems.map((item: any) => {
                            return DataRowComponentRender(item)
                        })}
                    </DirectoryTreeStyled>
                )}
            </div>
        )
    }
}
