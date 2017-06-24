import React, {Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import EditorComponent from './components/EditorComponent';

import {parseHTML, getHTMLSemanticErrorList} from './htmlUtils';

import example01DeuxColonnesHTML from './input/Example_01_deux_colonnes.html';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import './style.css';

class EditorApp extends Component {
    componentWillMount () {
        const parsedHTML            = parseHTML(example01DeuxColonnesHTML),
              htmlSemanticErrorList = getHTMLSemanticErrorList(parsedHTML);

        console.log(htmlSemanticErrorList.filter(htmlSemanticError => htmlSemanticError.error)
            .map(htmlSemanticError => htmlSemanticError.error));
    }

    render () {
        return (
            <MuiThemeProvider>
                <EditorComponent className="Editor"/>
            </MuiThemeProvider>
        );
    }
}

export default EditorApp;
