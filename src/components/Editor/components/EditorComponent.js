/**
 * Created by mael on 24/06/17.
 */
import React, {Component} from 'react';
import { Drawer, AppBar, List, ListItem, Paper,
Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, Menu,
IconMenu, IconButton, MenuItem, FlatButton, RaisedButton, FontIcon, Popover } from 'material-ui';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import Title from 'material-ui/svg-icons/editor/title';
import InsertPhoto from 'material-ui/svg-icons/editor/insert-photo';

import Intel from '../Internalisation';

//example of us Intel -> Internalisation.getMsg("btnSave");


import {parseHTML, getHTMLSemanticErrorList} from '../htmlUtils';
import htmlKOContent from '../input/Example_01_deux_colonnes.html';


const documentStyle = {
    margin: 20,
    textAlign: 'center',
    display: 'block',
};

export default class EditorComponent extends Component {

    constructor(props){
        super(props);
        this.htmlInput = [
            {
                title: "HTML OK",
                content: {__html: "<h1>HELLO WORLD</h1><p>A stepping stone to the ultimate success</p>"}
            },
            {
                title: "HTML KO",
                content: {__html: htmlKOContent }
            },
            {
                title: "Empty Document",
                content: {__html: "" }
            }
        ];
        this.state = {
            open:false,
            content: { __html: "No document, select a document to edit in the main menu."},
            title: "No document",
            openFileMenu: false,
        };
    }

    toggleDrawer() {
        this.setState({open: !this.state.open});
    }

    handleOpenFileMenu = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openFileMenu: true,
            anchorEl: event.currentTarget,
        });
    };

    handleRequestFileMenuClose = () => {
        this.setState({
            openFileMenu: false,
        });
    };

    editDocument (listItem) {
        this.setState({
            ...listItem
        }, () => {
            if (listItem.content.__html) {
                const parsedHTML            = parseHTML(listItem.content.__html),
                      htmlSemanticErrorList = getHTMLSemanticErrorList(parsedHTML);

                console.log(htmlSemanticErrorList.filter(htmlSemanticError => htmlSemanticError.error)
                    .map(htmlSemanticError => htmlSemanticError.error));
            }
            this.toggleDrawer();
        });
    }

    render() {


        return (
            <div>
                <Drawer
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}>
                    <List>
                        {this.htmlInput.map(listItem => <ListItem key={"htmlInput."+listItem.title} primaryText={listItem.title} leftIcon={<InsertDriveFile />} onClick={this.editDocument.bind(this, listItem)} />)}

                    </List>
                </Drawer>

                <AppBar   title="UpEditor"
                          onLeftIconButtonTouchTap={this.toggleDrawer.bind(this)} />
                <Paper style={documentStyle} zDepth={1}>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconMenu
                                iconButtonElement={<IconButton><Title /></IconButton>}
                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'left', vertical: 'bottom'}}>
                                <MenuItem primaryText="Title 1" />
                                <MenuItem primaryText="Title 2" />
                                <MenuItem primaryText="Title 3" />
                            </IconMenu>
                            <InsertPhoto />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.title} />
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
                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                onRequestClose={this.handleRequestFileMenuClose}
                            >
                                <Menu>
                                    <MenuItem primaryText="Save document" />
                                    <MenuItem primaryText="Delete document" />
                                </Menu>
                            </Popover>
                        </ToolbarGroup>
                    </Toolbar>
                    <div contentEditable={true} dangerouslySetInnerHTML={this.state.content}/>
                </Paper>
            </div>
        );
    }
}
