import React from 'react'
import Home from './pages/Home'
import City from './pages/City'
import Map from './pages/Map'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">我是app</div>
        <ul>
          <li>
            <Link to="/home">首页</Link>
          </li>
          <li>
            <Link to="/city">城市</Link>
          </li>
          <li>
            <Link to="/map">地图</Link>
          </li>
        </ul>
        <Route path="/home" component={Home} />
        <Route path="/city" component={City} />
        <Route path="/map" component={Map} />
      </Router>
    )
  }
}
export default App
