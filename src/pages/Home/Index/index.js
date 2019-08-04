import React from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Flex, Grid } from 'antd-mobile'
import axios from 'axios'
import './index.scss'
import Nav1 from 'assets/images/nav-1.png'
import Nav2 from 'assets/images/nav-2.png'
import Nav3 from 'assets/images/nav-3.png'
import Nav4 from 'assets/images/nav-4.png'

const navList = [
  { content: '整租', path: '/home/house', src: Nav1 },
  { content: '合租', path: '/home/house', src: Nav2 },
  { content: '地图找房', path: '/map', src: Nav3 },
  { content: '去出租', path: '/rent', src: Nav4 }
]
class Index extends React.Component {
  state = {
    swiper: [],
    imgHeight: 212,
    isLoaded: false,
    group: [],
    news: [],
    cityName: '北京'
  }
  async getSwiper() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    // console.log(res)
    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        swiper: body,
        isLoaded: true
      })
    }
  }
  async getGroup() {
    const { data } = await axios.get(
      'http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    console.log(data)
    this.setState({
      group: data.body
    })
  }
  async getNews() {
    const { data } = await axios.get(
      'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    // console.log(data)
    this.setState({
      news: data.body
    })
  }
  componentDidMount() {
    this.getSwiper()
    this.getGroup()
    this.getNews()
    // h5的获取地理定位的方法， 获取的是经度和纬度
    // navigator.geolocation.getCurrentPosition(
    //   function(position) {
    //     console.log(position)
    //   },
    //   function(error) {
    //     console.log(error)
    //   }
    // )
    const myCity = new window.BMap.LocalCity()
    myCity.get(async result => {
      // console.log(result)
      const name = result.name
      const res = await axios.get('http://localhost:8080/area/info', {
        params: {
          name: name
        }
      })
      // console.log(res)
      const { body, status } = res.data
      if (status === 200) {
        localStorage.setItem('current_city', JSON.stringify(body))
        this.setState({
          cityName: body.label
        })
      }
    })
  }
  renderSwiper() {
    return (
      this.state.isLoaded && (
        <Carousel autoplay infinite>
          {this.state.swiper.map(item => (
            <a
              key={item.id}
              href="http://www.alipay.com"
              style={{
                display: 'inline-block',
                width: '100%',
                height: this.state.imgHeight
              }}
            >
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  window.dispatchEvent(new Event('resize'))
                  this.setState({ imgHeight: 'auto' })
                }}
              />
            </a>
          ))}
        </Carousel>
      )
    )
  }
  renderSearch() {
    return (
      <Flex className="search-box">
        <Flex className="search-form">
          <div className="location">
            <span className="name">{this.state.cityName}</span>
            <i className="iconfont icon-arrow" />
          </div>
          <div className="search-input">
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区地址</span>
          </div>
        </Flex>
        <i
          className="iconfont icon-map"
          onClick={() => this.props.history.push('/map')}
        />
      </Flex>
    )
  }
  renderNav() {
    return navList.map(v => (
      <Flex.Item key={v.content}>
        <Link to={v.path}>
          <img src={v.src} alt="" />
          <p>{v.content}</p>
        </Link>
      </Flex.Item>
    ))
  }
  renderNews() {
    return this.state.news.map(v => (
      <div className="news-item" key={v.id}>
        <div className="img">
          <img src={`http://localhost:8080${v.imgSrc}`} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{v.title}</h3>
          <Flex className="info" justify="between">
            <span>{v.from}</span>
            <span>{v.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render() {
    return (
      <div className="index">
        <div className="swiper">
          {this.renderSearch()}
          {this.renderSwiper()}
        </div>
        <div className="nav">
          <Flex>{this.renderNav()}</Flex>
        </div>
        <div className="group">
          <div className="group-title">
            <h3>租房小组</h3>
            <span className="more">更多</span>
          </div>
          <div className="group-content">
            <Grid
              data={this.state.group}
              activeStyle
              columnNum={2}
              hasLine={false}
              square={false}
              renderItem={el => (
                <Flex justify="around">
                  <div className="desc">
                    <p>{el.title}</p>
                    <span>{el.desc}</span>
                  </div>
                  <img src={`http://localhost:8080${el.imgSrc}`} alt="" />
                </Flex>
              )}
            />
          </div>
        </div>
        <div className="news">
          <h3 className="news-title">最新资讯</h3>
          {this.renderNews()}
        </div>
      </div>
    )
  }
}
export default Index
