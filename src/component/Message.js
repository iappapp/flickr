import React from 'react';
import ReactDOM from 'react-dom';

class Content extends React.Component {
  render() {
    return (
      <div>
        <input type="text" value={this.props.myDataProp} onChange={this.props.updateStateProp} />
        <h4>{this.props.myDataProp}</h4>
      </div>
    );
  }
}


class HelloMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 'Hello Runoob!' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    render() {
        var value = this.state.value;
        return <div padding="10px" left="10px" style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', textAlign: 'left', fontFamily: 'Arial, sans-serif' }}>
            <br></br>
            <input type="text" value={value} onChange={this.handleChange} padding="10px" left="10px" />
            <h4>{value}</h4>
            <Content myDataProp={value} updateStateProp={this.handleChange} />
        </div>;
    }
}

export default HelloMessage;