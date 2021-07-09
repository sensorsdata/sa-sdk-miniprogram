<template>
  <div class="cnt">
    <Header></Header>
    <div>
      <button @click="onClickJump">点击事件测试</button>
      <button @click="onClickOpen">新开页面跳转</button>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Header from '../common/Header.vue'
import Footer from '../common/Footer.vue'
import Web from 'reduce-loader!../common/Web.vue'
import 'reduce-loader!./web'

export default Vue.extend({
  name: 'Home',
  components: {
    Header,
    Footer,
    Web,
  },
  created() {
    window.addEventListener('wxload', query => console.log('page1 wxload', query))
    window.addEventListener('wxshow', () => console.log('page1 wxshow'))
    window.addEventListener('wxready', () => console.log('page1 wxready'))
    window.addEventListener('wxhide', () => console.log('page1 wxhide'))
    window.addEventListener('wxunload', () => console.log('page1 wxunload'))

    if (process.env.isMiniprogram) {
      console.log('I am in miniprogram')
    } else {
      console.log('I am in Web')
    }
    console.log('index.vue', this)
  },
  methods: {
    onClickJump() {
      // 点击事件全埋点无法采集，通过自定义埋点触发
      getApp().globalData.sensors.track("$MPClick")
    },

    onClickOpen() {
      window.open('/test/detail/123')
    },
  },
})
</script>

<style lang="less">
.cnt {
  margin-top: 20px;
}

a, button {
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}

.miniprogram-root {
  .for-web {
    display: none;
  }
}
</style>
