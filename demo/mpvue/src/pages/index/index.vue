<template>
  <div >
    <div class="userinfo" >
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <img class="userinfo-avatar" src="/static/images/user.png" background-size="cover" />
    </div>
    <button @click.stop="clickHandle" data-content="anniu" data-type="按钮">按钮的点击</button>

  </div>
</template>

<script>
var sensors = getApp().sensors;
export default {
  data () {
    return {
      userInfo: {
        nickName: 'mpvue',
        avatarUrl: 'http://mpvue.com/assets/logo.png'
      }
    }
  },
  methods: {
    clickHandle (e) {
      // $MPClick 事件添加自定义属性
      e.mp.event_prop = {click_prop: 'button'};
      // 自定义埋点事件上报
      sensors.track("test001");
    },
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
</style>
