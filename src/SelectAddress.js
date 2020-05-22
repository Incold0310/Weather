import React from 'react';
import {GoogleMap, withGoogleMap, withScriptjs, Marker} from 'react-google-maps';
import {Link} from 'react-router-dom';

/*global google*/


function debounce(func, wait) {
  let timeout;

  return () => {
    const later = () => {
      func();
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const mapApiKey = 'AIzaSyAKmrqsunhAU2hCC-IKQASlhLEncfcOVtk';

const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    center={{ lat: props.lat || 59.939, lng: props.lng || 30.315 }} // Saint-Petersburg, Russia
  >
    {props.lat && <Marker position={{ lat: props.lat, lng: props.lng }} />}
  </GoogleMap>
))

class SelectAddress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      placeLat: null,
      placeLng: null,
      isCorrect: false
    };
    this.autocomplete = React.createRef();
  }

  componentDidMount() {
    this.autocomplete.current = new google.maps.places.Autocomplete(this.autocomplete.current, {"types": ["(cities)"]});
    this.autocomplete.current.addListener('place_changed', this.getPlaces.bind(this));
  }
  getPlaces() {
    const place = this.autocomplete.current.getPlace();
    this.setState({
      placeLat: place.geometry.location.lat(),
      placeLng: place.geometry.location.lng(),
      isCorrect: true,
      city: place.formatted_address
    })
  }

  clearPlace() {
    if (this.autocomplete.current.getPlace()) this.setState({isCorrect: false});
  }

  goToWeather(e) {
    if (this.state.isCorrect) this.props.selected([this.state.placeLat, this.state.placeLng], this.state.city);
    else e.preventDefault();
  }

  render() {
    return (
      <div className="col-9 text-left" id="address">
        <div className="row">
          <div className="col-4">
            <input className="form-control mt-4" placeholder="Введите название города"
                   aria-describedby="help" ref={this.autocomplete} onChange={debounce(this.clearPlace.bind(this), 300)}/>
            <small id="help" className="form-text text-muted">
              <sup>*</sup>Выберите город из списка, иначе система не сработает
            </small>
            <div className="text-left mt-4 pt-4">
              <Link to="/weather" className="btn btn-outline-success" onClick={e => this.goToWeather.call(this, e)}>Узнать погоду</Link>
            </div>
          </div>
          <div className="col-8 pl-3 pr-0">
          <MapComponent
            isMarkerShown
            lat={this.state.placeLat}
            lng={this.state.placeLng}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${mapApiKey}`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
          </div>
        </div>
      </div>
    )
  }
}

export default SelectAddress;
