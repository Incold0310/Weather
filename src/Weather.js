import React from 'react';
import axios from 'axios';
import LoadInfo from './LoadInfo';
import WeatherDayOfWeek from './WeatherDayOfWeek';
import moment from 'moment-timezone';
import 'moment/locale/ru';
import {Link} from 'react-router-dom';

moment.locale('ru');

const weatherApiKey = '5e2b73f8f238f20874ae3d4928244672';

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDay: {},
      days7Forecast: [],
      timezone: 'Europe/Moscow',
      dayIndex: 0
    }
  }

  componentDidMount() {
    let [lat, lng] = this.props.coordinates;

    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=hourly,minutely&appid=${weatherApiKey}&units=metric&lang=ru`)
      .then(res =>  { console.log(res); this.setState({
        currentDay: res.data.current,
        days7Forecast: res.data.daily,
        timezone: res.data.timezone
      })})
      .catch(err => console.log(err))
  }

  render() {

    if (!this.state.days7Forecast.length) return <LoadInfo />

    let style = Date.now() < this.state.currentDay.sunrise*1000 || Date.now() > this.state.currentDay.sunset*1000
                ? {background:  'rgba(6, 6, 54, 0.88)'}
                : {background:  'rgba(29, 156, 215, 0.88)'}

    return (
      <div className="col-11 my-3" id="weather" style={style}>
        <div className="row container-fluid">

          <div className="container-fluid mt-2" id="location">
            <div className="row">
              <div className="col-9">
                <div>
                  <i className="fa fa-map-marker fa-3x mr-3"></i>
                  <span>{this.props.city}</span>
                </div>
                <div className="mt-1" id="dateTime">
                  {moment.tz(this.state.currentDay.dt*1000, this.state.timezone).format('llll')}
                </div>
              </div>
              <div className="col-3 d-flex align-items-start justify-content-end pt-2 pr-0">
                <Link to="/" className="btn btn-primary btn-lg">Назад</Link>
              </div>
            </div>
          </div>

          <div className="col-6">

              <div className="container-fluid my-3">
                <div className="row">
                  <div className="col-6 text-center">
                    <div>
                      <img src={`http://openweathermap.org/img/wn/${this.state.currentDay.weather[0].icon}@2x.png`} alt={this.state.currentDay.weather[0].icon}/>
                    </div>
                    <div>
                      {this.state.currentDay.weather[0].description[0].toUpperCase() + this.state.currentDay.weather[0].description.slice(1)}
                    </div>
                  </div>
                  <div className="col-6 text-center">
                    <div id="temp">{Math.round(this.state.currentDay.temp)}<sup>o</sup></div>
                    <div id="feel">Ощущается {Math.round(this.state.currentDay.feels_like)}<sup>o</sup></div>
                  </div>
                </div>
              </div>

              <div className="container-fluid mb-2">
                <div className="row">
                  <div className="col-6 text-right timesOfDayTemp pr-4">
                    <i className="fa fa-sun-o mr-3"></i>
                    {Math.ceil(this.state.days7Forecast[this.state.dayIndex].temp.max)}<sup>o</sup>
                  </div>
                  <div className="col-6 text-left timesOfDayTemp pl-4">
                    <i className="fa fa-moon-o mr-3"></i>
                    {Math.floor(this.state.days7Forecast[this.state.dayIndex].temp.min)}<sup>o</sup>
                  </div>
                </div>
              </div>
          </div>

          <div className="col-6">

            <div className="row my-3">
              <div className="col-7">
                <div className="boldText">Атмосферное давление:</div>
                <div>{Math.ceil(this.state.currentDay.pressure/1.333)} мм рт. ст.</div>
              </div>
              <div className="col-5">
                <div className="boldText">Влажность:</div>
                <div>{this.state.currentDay.humidity} %</div>
              </div>
            </div>

            <div className="row my-3">
              <div className="col-7">
                <div className="boldText">Облачность:</div>
                <div>{this.state.currentDay.clouds} %</div>
              </div>
              <div className="col-5">
                <div className="boldText">УФ-индекс:</div>
                <div>{this.state.currentDay.uvi}</div>
              </div>
            </div>

            <div className="row my-3">
              <div className="col-7">
                <div className="boldText">Объём осадков за час:</div>
                <div>
                  {
                    this.state.currentDay.rain && this.state.currentDay.rain.hasOwnProperty('1h')
                    ? `${this.state.currentDay.rain['1h']} мм`
                    : 'Без осадков'
                  }</div>
              </div>
              <div className="col-5">
                <div className="boldText">Скорость ветра:</div>
                <div>{this.state.currentDay.wind_speed} м/с</div>
              </div>
            </div>

          </div>
        </div>
        <div className="row container-fluid mb-2 mt-4">
          {this.state.days7Forecast.map((item, index) =>
            <WeatherDayOfWeek key={index} dayData={item} timezone={this.state.timezone}/>
          )}
        </div>
      </div>
    );
  }
}

export default Weather;
