/**
 * Created by mael on 24/06/17.
 */
import React, {Component} from 'react';
import {
    Drawer, AppBar, List, ListItem, Paper,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, Menu,
    IconMenu, IconButton, MenuItem, FlatButton, Popover
} from 'material-ui';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import Title from 'material-ui/svg-icons/editor/title';
import InsertPhoto from 'material-ui/svg-icons/editor/insert-photo';
import Intel from '../Internalisation';
//example of us Intel -> Internalisation.getMsg("btnSave");
import ActionLanguage from 'material-ui/svg-icons/action/language';
import {parseHTML, getHTMLSemanticErrorList} from '../htmlUtils';
import htmlOKContent from '../input/Example_01_deux_colonnes.html';

const documentStyle = {
    margin:    20,
    textAlign: 'center',
    display:   'block',
};

export default class EditorComponent extends Component {

    constructor (props) {
        super(props);
        this.htmlInput = [
            {
                title:   "HTML OK",
                content: { __html: htmlOKContent }
            },
            {
                title:   "HTML KO",
                content: { __html: "<h2>HELLO WORLD</h2><p>A stepping stone to the ultimate success</p>" }
            },
            {
                title:   "Empty Document",
                content: { __html: "" }
            }
        ];
        this.state     = {
            open:         false,
            content:      { __html: "No document, select a document to edit in the main menu." },
            title:        "No document",
            openFileMenu: false,
        };
    }

    toggleDrawer () {
        this.setState({ open: !this.state.open });
    }

    handleOpenFileMenu = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openFileMenu: true,
            anchorEl:     event.currentTarget,
        });
    };

    handleRequestFileMenuClose = () => {
        this.setState({
            openFileMenu: false,
        });
    };

    changeLanguage = () => {

    };

    checkHTMLSemantic = (htmlCollection) => {
        const htmlSemanticErrorList = getHTMLSemanticErrorList(htmlCollection);

        console.log('elements in error:', htmlSemanticErrorList.filter(htmlSemanticError => htmlSemanticError.error)
            .map(htmlSemanticError => htmlSemanticError.htmlElement));

        console.log('error messages:', htmlSemanticErrorList.filter(htmlSemanticError => htmlSemanticError.error)
            .map(htmlSemanticError => htmlSemanticError.error));
    };

    editDocument (listItem) {
        this.setState({
            ...listItem
        }, () => {
            if (listItem.content.__html) {
                this.checkHTMLSemantic(document.getElementById('accessibleDocument').childNodes);
            }
            else if (listItem.title === 'Empty Document') {
                document.getElementById('accessibleDocument').focus();
            }
            this.toggleDrawer();
        });
    }

    render () {

        return (
            <div>
                <Drawer
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({ open })}>
                    <List>
                        {this.htmlInput.map(listItem => <ListItem key={"htmlInput."+listItem.title} primaryText={listItem.title} leftIcon={<InsertDriveFile />} onClick={this.editDocument.bind(this, listItem)} />)}
                    </List>
                </Drawer>

                <AppBar   title="UpEditor"
                          onLeftIconButtonTouchTap={this.toggleDrawer.bind(this)} iconElementRight={<IconButton><ActionLanguage /> Language</IconButton>}
                          onRightIconButtonTouchTap={this.changeLanguage}/>
                <Paper style={documentStyle} zDepth={1}>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconMenu
                                iconButtonElement={<IconButton><Title /></IconButton>}
                                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                                <MenuItem primaryText="Title 1"/>
                                <MenuItem primaryText="Title 2"/>
                                <MenuItem primaryText="Title 3"/>
                            </IconMenu>
                            <InsertPhoto />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.title}/>
                            <ToolbarSeparator />
                            <FlatButton
                                label="File"
                                className={"toolbar-flat-button"}
                                onTouchTap={this.handleOpenFileMenu}
                                primary={true}
                                icon={<InsertDriveFile />}
                            />
                            <Popover
                                open={this.state.openFileMenu}
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                                onRequestClose={this.handleRequestFileMenuClose}
                            >
                                <Menu>
                                    <MenuItem primaryText="Save document"/>
                                    <MenuItem primaryText="Delete document"/>
                                </Menu>
                            </Popover>
                        </ToolbarGroup>
                    </Toolbar>
                    <div id="accessibleDocument" className="document-edit" contentEditable={true} dangerouslySetInnerHTML={this.state.content}/>
                </Paper>
            </div>
        );
    }
}
