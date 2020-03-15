import React from 'react';
import { Checkbox } from 'antd';

//import './style.css'

class CheckboxEncryption extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      symmetricChecked: false,
      symmetricDisabled: false,
      asymmetricChecked: false,
      asymmetricDisabled: false,
    };
  }

  symmetricToggleChecked() {
    this.setState({ 
        symmetricChecked: !this.state.symmetricChecked, 
        asymmetricDisabled: !this.state.asymmetricDisabled
      }
    ,() => {
      this.props.symmetricChecked(this.state.symmetricChecked)
    });
  };

  asymmetricToggleChecked() {
    this.setState({ 
      asymmetricChecked: !this.state.asymmetricChecked, 
      symmetricDisabled: !this.state.symmetricDisabled
    },() => {
      this.props.asymmetricChecked(this.state.asymmetricChecked)
    })
  }

  render() {
    return <div>
        <Checkbox 
            onChange={() => this.symmetricToggleChecked()}
            disabled={this.state.symmetricDisabled}
            checked={this.state.symmetricChecked}>
            Symmetric
        </Checkbox>
              
        <Checkbox 
            onChange={() => this.asymmetricToggleChecked()} 
            disabled={this.state.asymmetricDisabled}
            checked={this.state.asymmetricChecked}>
            Asymmetric
        </Checkbox>
    </div>
  }
}

export default CheckboxEncryption