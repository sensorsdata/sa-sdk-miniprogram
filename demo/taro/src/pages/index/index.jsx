import { Component } from 'react'
import Taro, { getApp } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import './index.css'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  clickHandler () {
    console.log("点击了")
    // 如何在页面上调用 SDK 的方法
    Taro.getApp().sensors && Taro.getApp().sensors.track('test11', {a:1,b:2})
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Button onClick={this.clickHandler}>点击按钮</Button>
      </View>
    )
  }
}
