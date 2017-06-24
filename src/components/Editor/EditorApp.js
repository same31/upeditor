import React, {Component} from 'react';
import $ from 'jquery';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import EditorComponent from './components/EditorComponent';
import Internalisation from './Internalisation'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import './style.css';

class EditorApp extends Component {
    render () {
        return (
            <MuiThemeProvider>
                <EditorComponent className="Editor"/>
            </MuiThemeProvider>
        );
    }
}
var message = Internalisation.getMsg("btnSave");
console.log('message', message);

export default EditorApp;
