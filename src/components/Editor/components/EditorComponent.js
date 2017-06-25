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
import initIntl from '../intl.js';
import ChooseOCRModal from './ChooseOCRModal';
import Tesseract from 'tesseract.js';

import {EventEmitter2}  from 'eventemitter2';
window.EventBus = new EventEmitter2();

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
            open:                 false,
            content:              {
                __html: "<div class='info-div' contentEditable='false'></div>"
            },
            title:                '',
            openFileMenu:         false,
            languageMenu:         false,
            errorSelected:        false,
            errorMessage:         "",
            chooseOCRModal: {
                open: false,
                image: null
            },
            language:             'en-EN',
            intl:                 null
        };
    }

    clickHandler = e => {
        // Getting an array of DOM elements
        // Then finding which element was clicked
        const currentNode  = e.target,
              errorMessage = currentNode.getAttribute("data-error-message");
        if (errorMessage) {
            this.setState({
                errorSelected: true,
                errorMessage,
                currentNode
            });
        } else {
            this.setState({
                errorSelected: false,
                errorMessage:  "",
                currentNode
            });
        }
    };

    componentWillMount () {
        this.setLanguage(this.state.language);

        window.EventBus.on('chooseOCR', (recognize, image) => {
            this.setState({chooseOCRModal: {open: false}}, () => {
                const documentEditElement = document.getElementById('document-edit');
                if (recognize) {
                    // OCR
                    Tesseract.recognize(image)
                        .progress(function  (p) { console.log('progress', p)    })
                        .then(function (result) { console.log('result', result);
                            const ocrParagraph = document.createElement('P');
                            ocrParagraph.innerHTML = result.text;
                            documentEditElement.appendChild(ocrParagraph);
                        });
                }
                else {
                    documentEditElement.appendChild(image);
                }
            });
        });

        document.addEventListener('onPaste', this.checkHTMLSem);
    }

    handlePaste = () => {
        this.checkHTMLSemantic(document.getElementById('accessibleDocument').childNodes);
    };

    setLanguage (language) {
        const intl = initIntl(language);
        this.setState({
            intl,
            content: {
                __html: `<div class='info-div' contenteditable='false'>${intl.getMsg("noDocumentLong")}</div>`
            },
            title:   intl.getMsg("noDocument")
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
                    title:   intl.getMsg("emptyDocument"),
                    content: { __html: "" }
                }
            ];
        });
    }

    toggleDrawer () {
        this.setState({ open: !this.state.open });
    }

    handleOpenFileMenu = event => {
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

    openLanguageMenu = event => {
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
     */
    setAnchor = anchor => {
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
            newNode.innerHTML = anchor === "h1" || "h2" || "h3" ? "New Title" : newNode.innerHTML;
        }
        if (anchor === "ul" || anchor === "ol") {
            let li = document.createElement("li");
            li.setAttribute("tabindex","-1");
            li.innerHTML = "...";
            newNode.appendChild(li);
            requestAnimationFrame(function() {
                // this.selectElementContents(li);
            });
        } else {
            newNode.setAttribute("tabindex","-1");
            requestAnimationFrame(function() {
                // this.selectElementContents(newNode);
            });
        }
        document.execCommand('delete', false, null);
        this.checkHTMLSemantic();
    };

    selectElementContents = (el) => {
        let range = document.createRange();
        range.selectNodeContents(el);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };


    checkHTMLSemantic = () => {
        getHTMLSemanticErrorList(document.getElementById('document-edit').childNodes)
            .forEach(htmlSemanticError => {
                if (htmlSemanticError.error.level) {
                    htmlSemanticError.htmlElement.setAttribute('data-error-level', htmlSemanticError.error.level);
                    htmlSemanticError.htmlElement.setAttribute('data-error-message',
                        this.state.intl.getMsg(htmlSemanticError.error.message, htmlSemanticError.error.data));
                }
            });
    };

    editDocument (listItem) {
        this.setState({ ...listItem }, () => {
            if (listItem.content.__html) {
                this.checkHTMLSemantic();
            }
            else {
                const emptyParagraph     = document.createElement('P');
                emptyParagraph.innerHTML = this.state.intl.getMsg('startTyping');
                document.getElementById('document-edit').appendChild(emptyParagraph);
            }
            this.toggleDrawer();
        });
    }

    modifyLanguage (newLanguage) {
        if (this.state.intl.locales[newLanguage]) {
            this.setLanguage(newLanguage);
            this.handleLanguageMenuClose();
        }
    }

    clickInsertPhoto () {
        document.getElementById("chooseFileModal").click();
    }

    onFileSelected = event => {
        const tgt   = event.target || window.event.srcElement,
              files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {
            const fr  = new FileReader();
            fr.onload = () => {
                const image = document.createElement('IMG');
                // Base 64
                image.src   = fr.result;
                image.alt   = files[0].name;

                this.setState({
                    chooseOCRModal: {
                        open: true,
                        image
                    }
                });
            };
            fr.readAsDataURL(files[0]);
        }

        // Not supported
        else {
            this.setState({
                errorSelected: true,
                errorMessage:  this.state.intl.getMsg("functionalityNotWorking")
            });
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
        }
    };

    createParagraph = e => {
        e = e || window.event;
        if (e.keyCode === 13) {
            console.info(window.getSelection().anchorNode.previousElementSibling.nodeName);
            if(window.getSelection().anchorNode.previousElementSibling.nodeName !== "LI"){
                document.execCommand('formatBlock', false, 'p');
            }
        }

    };

    render () {
        const getMsg = this.state.intl.getMsg;

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
                                <MenuItem primaryText={<h1>h1.{getMsg('title')} 1</h1>} onTouchTap={this.setAnchor.bind(this, "h1")}/>
                                <MenuItem primaryText={<h2>h2.{getMsg('title')} 2</h2>} onTouchTap={this.setAnchor.bind(this, "h2")}/>
                                <MenuItem primaryText={<h3>h3.{getMsg('title')} 3</h3>} onTouchTap={this.setAnchor.bind(this, "h3")}/>
                                <MenuItem primaryText={<h3>h4.{getMsg('title')} 4</h3>} onTouchTap={this.setAnchor.bind(this, "h4")}/>
                                <MenuItem primaryText={<h3>h5.{getMsg('title')} 5</h3>} onTouchTap={this.setAnchor.bind(this, "h5")}/>
                                <MenuItem primaryText={<h3>h6.{getMsg('title')} 6</h3>} onTouchTap={this.setAnchor.bind(this, "h6")}/>
                            </IconMenu>
                            <IconButton onTouchTap={this.setAnchor.bind(this, "ol")}><FormatListNumbered/></IconButton>
                            <IconButton onTouchTap={this.setAnchor.bind(this, "ul")}><FormatListBulleted/></IconButton>
                            <ToolbarSeparator/>
                            <IconButton onClick={this.clickInsertPhoto}><InsertPhoto />
                                <input id="chooseFileModal" type="file" accept="image/*" onChange={this.onFileSelected}/>
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
                    <div id="document-edit" className="document-edit" onPaste={this.handlePaste}
                         contentEditable={true} dangerouslySetInnerHTML={this.state.content}
                         onClick={this.clickHandler} onKeyPress={this.createParagraph} onKeyUp={this.createParagraph}/>
                    <Snackbar message={"Error : " + this.state.errorMessage} open={this.state.errorSelected}/>
                    <ChooseOCRModal getMsg={getMsg} {...this.state.chooseOCRModal}/>
                </Paper>
            </div>
        );
    }
}
