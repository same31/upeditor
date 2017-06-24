/**
 * Created by mael on 24/06/17.
 */
import React, {Component} from 'react';
import { Drawer, AppBar, List, ListItem, Paper,
Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle,
IconMenu, IconButton, MenuItem, FlatButton, RaisedButton, FontIcon } from 'material-ui';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';

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
            title: "No document"
        };
    }
    handleToggle() {
        this.setState({open: !this.state.open});
    }

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
                          onLeftIconButtonTouchTap={this.handleToggle.bind(this)} />
                <Paper style={documentStyle} zDepth={1}>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>

                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.title} />
                            <ToolbarSeparator />
                                <IconMenu iconButtonElement={<FontIcon className="mui-"></FontIcon>}
                                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                                    targetOrigin={{horizontal: 'left', vertical: 'top'}}>
                                    <MenuItem primaryText="Save" />
                                    <MenuItem primaryText="Delete" />
                                </IconMenu>
                            <FlatButton
                                label="File"
                                className={"toolbar-flat-button"}
                                primary={true}
                                icon={<IconButton><InsertDriveFile /></IconButton>}
                            />
                        </ToolbarGroup>
                    </Toolbar>
                    <div contentEditable={true} dangerouslySetInnerHTML={this.state.content}/>
                </Paper>
            </div>
        );
    }
}
