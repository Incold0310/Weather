import React from 'react';
import moment from 'moment-timezone';
import 'moment/locale/ru';


class WeatherDayOfWeek extends React.Component {
  render() {
    return (
      <div className="col dayOfWeek text-center p-2">
        <div className="container-fluid p-0">
          {
            moment.tz(this.props.dayData.dt*1000, this.props.timezone).format('ddd, D MMM') === moment.tz(moment(), this.props.timezone).format('ddd, D MMM')
            ? 'Сегодня'
            : moment.tz(this.props.dayData.dt*1000, this.props.timezone).format('ddd, D MMM')
          }
        </div>
        <div className="container-fluid p-0">
          <img src={`http://openweathermap.org/img/wn/${this.props.dayData.weather[0].icon}@2x.png`} alt={this.props.dayData.weather[0].icon}/>
          <div>
            {this.props.dayData.weather[0].description[0].toUpperCase() + this.props.dayData.weather[0].description.slice(1)}
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-6 text-right p-2">
            <i className="fa fa-sun-o mr-1"></i>
            {Math.ceil(this.props.dayData.temp.max)}<sup>o</sup>
          </div>
          <div className="col-6 text-left p-2">
            <i className="fa fa-moon-o mr-1"></i>
            {Math.floor(this.props.dayData.temp.min)}<sup>o</sup>
          </div>
        </div>
      </div>
    )
  }
}

export default WeatherDayOfWeek;
