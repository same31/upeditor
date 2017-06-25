import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import EditorComponent from './components/EditorComponent';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import './style.css';

export default () => (
    <MuiThemeProvider>
        <EditorComponent className="Editor"/>
    </MuiThemeProvider>
);
