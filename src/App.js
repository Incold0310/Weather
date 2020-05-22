import React from 'react';
import SelectAddress from './SelectAddress';
import Weather from './Weather';
import NotFound from './NotFound';
import {Route, Redirect, Switch} from 'react-router-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      coordinates: [],
      city: null
    }
  }

  selected(coord, city) {
    this.setState({
      isSelected: true,
      coordinates: [...coord],
      city: city
    })
  }

  render() {
    return (
      <div className="d-flex flex-column flex-fill">
        <div className="pl-0 container-fluid d-flex flex-column flex-fill align-items-center justify-content-center">
          <Switch>
            <Route exact path="/" render={()=> <SelectAddress selected={this.selected.bind(this)}/>} />
            <Route path="/weather" render={ ()=> this.state.isSelected ?
                                  <Weather coordinates={this.state.coordinates} city={this.state.city}/> :
                                  <Redirect to="/"/>
                          }
            />
            <Route exact path='*' component={NotFound} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
