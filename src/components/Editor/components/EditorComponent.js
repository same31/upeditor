/**
 * Created by mael on 24/06/17.
 */
import React, {Component} from 'react';
import {
    Drawer, AppBar, List, ListItem, Paper,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, Menu,
    IconMenu, IconButton, MenuItem, FlatButton, Popover, Subheader,
    Snackbar
} from 'material-ui';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import Title from 'material-ui/svg-icons/editor/title';
import InsertPhoto from 'material-ui/svg-icons/editor/insert-photo';
import FormatListBulleted from 'material-ui/svg-icons/editor/format-list-bulleted';
import FormatListNumbered from 'material-ui/svg-icons/editor/format-list-numbered';
import ActionLanguage from 'material-ui/svg-icons/action/language';
import {getHTMLSemanticErrorList} from '../htmlUtils';
import htmlOKContent from '../input/Example_01_deux_colonnes.html';
import Internalisation from '../Internalisation.js';

const documentStyle = {
    margin:    20,
    textAlign: 'center',
    display:   'block'
};

export default class EditorComponent extends Component {

    constructor (props) {
        super(props);
        this.htmlInput = [];
        this.state     = {
            open:          false,
            content:       {
                __html: "<div class='info-div" +
                        "' contenteditable='false'>" +
                        "No document, select a document to edit in the main menu.</div>"
            },
            title:         "No document",
            openFileMenu:  false,
            languageMenu:  false,
            errorSelected: false,
            errorMessage:  "",
            language:      'en-EN',
            intel:         null
        };
    }

    clickHandler = (e) => {
        // Getting an array of DOM elements
        // Then finding which element was clicked
        const index        = e.target,
              errorMessage = index.getAttribute("data-error-message");
        if (errorMessage) {
            this.setState({
                errorSelected: true,
                errorMessage:  errorMessage,
                currentNode:   index
            });
        } else {
            this.setState({
                errorSelected: false,
                errorMessage:  "",
                currentNode:   index
            });
        }
    };

    componentWillMount () {
        this.setLanguage(this.state.language);
    }

    setLanguage (language) {
        const intel = Internalisation(language);
        this.setState({
            intel:   intel,
            content: {
                __html: "<div class='info-div'" +
                        " contenteditable='false'>" +
                        intel.getMsg("noDocumentLong") + "</div>"
            },
            title:   intel.getMsg("noDocument")
        }, () => {
            this.htmlInput = [
                {
                    title:   "HTML OK",
                    content: { __html: htmlOKContent }
                },
                {
                    title:   "HTML KO",
                    content: { __html: "<h2>HELLO WORLD</h2><p>A stepping stone to the ultimate success</p><div>Say hello to my little DIV</div>" }
                },
                {
                    title:   intel.getMsg("emptyDocument"),
                    content: { __html: "" }
                }
            ];
        });
    }

    toggleDrawer () {
        this.setState({ open: !this.state.open });
    }

    handleOpenFileMenu = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openFileMenu: true,
            anchorEl:     event.currentTarget
        });
    };

    handleRequestFileMenuClose = () => {
        this.setState({
            openFileMenu: false
        });
    };

    openLanguageMenu = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            languageMenu: true,
            anchorEl:     event.currentTarget
        });
    };

    handleLanguageMenuClose = () => {
        this.setState({
            languageMenu: false
        });
    };

    /**
     * @description Changes the current selected HTML node to the given anchor {h1,h2,h3}
     * @param anchor
     * @param event
     */
    setAnchor = (anchor, event) => {
        let currentSelection = document.getSelection().anchorNode;
        if (currentSelection.nodeName === "#text") {
            currentSelection = currentSelection.parentNode;
        }
        let newNode = document.createElement(anchor);
        if (currentSelection.nodeName !== "DIV") {
            let parentNode = currentSelection.parentNode;
            newNode.setAttribute("contentEditable", "true");
            newNode.innerHTML = currentSelection.innerHTML;
            parentNode.replaceChild(newNode, currentSelection);
        } else {
            currentSelection.appendChild(newNode);
            newNode.innerHTML = "New Title";
        }
        this.checkHTMLSemantic();
    };

    checkHTMLSemantic = () => {
        const htmlSemanticErrorList = getHTMLSemanticErrorList(document.getElementById('accessibleDocument').childNodes);

        htmlSemanticErrorList.forEach(htmlSemanticError => {
            if (htmlSemanticError.errorLevel) {
                htmlSemanticError.htmlElement.setAttribute('data-error-level', htmlSemanticError.errorLevel);
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
                this.checkHTMLSemantic();
            }
            else {
                document.getElementById('accessibleDocument').focus();
            }
            this.toggleDrawer();
        });
    }

    modifyLanguage (newLanguage) {
        if (this.state.intel.locales[newLanguage] !== undefined) {
            this.setLanguage(newLanguage);
            this.handleLanguageMenuClose();
        }
    }

    clickInsertPhoto () {
        document.getElementById("chooseFileModal").click();
    }

    onFileSelected (event) {
        var tgt   = event.target || window.event.srcElement,
            files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {
            var fr    = new FileReader();
            fr.onload = function () {

                //TODO it will be in an other div to put this img, but the BASE64 is in fr.result
                document.getElementById('imgShowed').src = fr.result;
            };
            fr.readAsDataURL(files[0]);
        }

        // Not supported
        else {
            this.setState({
                errorSelected: true,
                errorMessage:  this.state.intel.getMsg("functionalityNotWorking")
            });
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
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
                        <Subheader>{getMsg("titreSelectDocument")}</Subheader>
                        {this.htmlInput.map(listItem => <ListItem key={"htmlInput." + listItem.title} primaryText={listItem.title}
                                                                  leftIcon={<InsertDriveFile />}
                                                                  onClick={this.editDocument.bind(this, listItem)}/>)}
                    </List>
                </Drawer>

                <AppBar title="UpEditor"
                        onLeftIconButtonTouchTap={this.toggleDrawer.bind(this)}
                        iconElementRight={<IconButton><ActionLanguage /></IconButton>}
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
                                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                targetOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                                <MenuItem primaryText={<h1>h1.Title 1</h1>} onTouchTap={this.setAnchor.bind(this, "h1")}/>
                                <MenuItem primaryText={<h2>h2.Title 2</h2>} onTouchTap={this.setAnchor.bind(this, "h2")}/>
                                <MenuItem primaryText={<h3>h3.Title 3</h3>} onTouchTap={this.setAnchor.bind(this, "h3")}/>
                            </IconMenu>
                            <IconButton><FormatListNumbered/></IconButton>
                            <IconButton><FormatListBulleted/></IconButton>
                            <ToolbarSeparator/>
                            <IconButton onClick={this.clickInsertPhoto}><InsertPhoto />
                                <input id="chooseFileModal" type="file" accept="image/*" onChange={this.onFileSelected}/>
                                { /*TODO: DELETE THIS LINE IMG, ONLY FOR TEST*/}
                                <img id="imgShowed" alt=""></img>
                            </IconButton>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.title}/>
                            <ToolbarSeparator />
                            <FlatButton
                                label={getMsg("file")}
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
                    <div id="accessibleDocument" className="document-edit"
                         contentEditable={true} dangerouslySetInnerHTML={this.state.content}
                         onClick={this.clickHandler}/>
                    <Snackbar message={"Error : " + this.state.errorMessage} open={this.state.errorSelected}/>
                </Paper>
            </div>
        );
    }
}
