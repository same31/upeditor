/**
 * Created by mael on 24/06/17.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    Drawer, AppBar, List, ListItem, Paper,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, Menu,
    IconMenu, IconButton, MenuItem, FlatButton, Popover, Subheader
} from 'material-ui';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import Title from 'material-ui/svg-icons/editor/title';
import InsertPhoto from 'material-ui/svg-icons/editor/insert-photo';
import FormatListBulleted from 'material-ui/svg-icons/editor/format-list-bulleted';
import FormatListNumbered from 'material-ui/svg-icons/editor/format-list-numbered';
import Intel from '../Internalisation';
import ActionLanguage from 'material-ui/svg-icons/action/language';
import {parseHTML, getHTMLSemanticErrorList} from '../htmlUtils';
import htmlOKContent from '../input/Example_01_deux_colonnes.html';
import Internalisation from '../Internalisation.js';


const documentStyle = {
    margin:    20,
    textAlign: 'center',
    display:   'block',
};

export default class EditorComponent extends Component {

    constructor (props) {
        super(props);
        this.htmlInput = [];
        this.state     = {
            open:         false,
            content:      { __html: "<div class='info-div" +
            "' contenteditable='false'>" +
            "No document, select a document to edit in the main menu.</div>" },
            title:        "No document",
            openFileMenu: false,
            languageMenu: false,
            language : 'fr-FR',
            intel : null
        };
    }


    componentWillMount() {
        this.setLanguage(this.state.language);
    }

    setLanguage (language) {
        const intel = Internalisation(language);
        this.setState({
            intel: intel,
            content: { __html: "<div class='info-div'" +
            " contenteditable='false'>" +
                intel.getMsg("noDocumentLong") + "</div>" },
            title: intel.getMsg("noDocument")
        }, () => {this.htmlInput = [
            {
                title:   "HTML OK",
                content: { __html: htmlOKContent }
            },
            {
                title:   "HTML KO",
                content: { __html: "<h2>HELLO WORLD</h2><p>A stepping stone to the ultimate success</p>" }
            },
            {
                title:   intel.getMsg("emptyDocument"),
                content: { __html: "" }
            }
        ];});
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

    openLanguageMenu = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            languageMenu: true,
            anchorEl:     event.currentTarget,
        });
    };

    handleLanguageMenuClose = () => {
        this.setState({
            languageMenu: false,
        });
    };

    checkHTMLSemantic = (htmlCollection) => {
        const htmlSemanticErrorList = getHTMLSemanticErrorList(htmlCollection);

        htmlSemanticErrorList.forEach(htmlSemanticError => {
            if (htmlSemanticError.error) {
                htmlSemanticError.htmlElement.setAttribute('data-error-message', htmlSemanticError.error);
            }
        });

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
    modifyLanguage (newLanguage) {
        if(this.state.intel.locales[newLanguage] !== undefined){
            this.setLanguage(newLanguage);
            this.handleLanguageMenuClose();
        }
    }

    render () {
        const getMsg = this.state.intel.getMsg;

        return (
            <div>
                <Drawer
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({ open })}>
                    <List>
                        <Subheader>Documents available for edition</Subheader>
                        {this.htmlInput.map(listItem => <ListItem key={"htmlInput."+listItem.title} primaryText={listItem.title} leftIcon={<InsertDriveFile />} onClick={this.editDocument.bind(this, listItem)} />)}
                    </List>
                </Drawer>

                <AppBar   title="UpEditor"
                          onLeftIconButtonTouchTap={this.toggleDrawer.bind(this)} iconElementRight={<IconButton><ActionLanguage /></IconButton>}
                          onRightIconButtonTouchTap={this.openLanguageMenu}/>
                <Popover
                    open={this.state.languageMenu}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    onRequestClose={this.handleLanguageMenuClose}
                >
                    <Menu>
                        <MenuItem primaryText={getMsg("english")} onClick={this.modifyLanguage.bind(this, 'en-EN')}/>
                        <MenuItem primaryText={getMsg("french")} onClick={this.modifyLanguage.bind(this, 'fr-FR')}/>
                        <MenuItem primaryText={getMsg("spanish")} onClick={this.modifyLanguage.bind(this, 'es-ES')}/>
                    </Menu>
                </Popover>
                <Paper style={documentStyle} zDepth={1}>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconMenu
                                iconButtonElement={<IconButton><Title /></IconButton>}
                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'left', vertical: 'bottom'}}>
                                <MenuItem primaryText={<h1>Title 1</h1>} />
                                <MenuItem primaryText={<h2>Title 2</h2>} />
                                <MenuItem primaryText={<h3>Title 3</h3>} />
                            </IconMenu>
                            <IconButton><FormatListNumbered/></IconButton>
                            <IconButton><FormatListBulleted/></IconButton>
                            <ToolbarSeparator/>
                            <IconButton><InsertPhoto /></IconButton>
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
