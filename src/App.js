import React, { Component } from 'react';
import CodeFest             from "./components/CodeFest/CodeFest"

import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount(){
      this.setState({ loading: false })
  }

  render() {
    return (
      <div className="App">
        <CodeFest />
      </div>
    );
  }
}

export default App;
