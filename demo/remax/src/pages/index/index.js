import * as React from 'react';
import { View, Text, Image, Button } from 'remax/wechat';
import styles from './index.css';

export default () => {
  function clickHandle(event) {
    console.log('点击事件')
    // 无法采集点击事件，通过自定义埋点触发
    getApp().sensors.track('$MPClick');
  }

  return (
    <View className={styles.app}>
      <View className={styles.header}>
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*OGyZSI087zkAAAAAAAAAAABkARQnAQ"
          className={styles.logo}
          alt="logo"
        />
        <View className={styles.text}>
          编辑 <Text className={styles.path}>src/pages/index/index.js</Text>{' '}
          开始
        </View>
        <Button type='button' size='large' onTap={clickHandle}>测试点击</Button>
      </View>
    </View>
  );
};
