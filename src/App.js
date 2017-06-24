import React, {Component} from 'react';
import EditorApp from './components/Editor/EditorApp';

import './App.css';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount () {
        this.setState({ loading: false })
    }

    render () {
        return (
            <div className="App">
                <EditorApp />
            </div>
        );
    }
}

export default App;
