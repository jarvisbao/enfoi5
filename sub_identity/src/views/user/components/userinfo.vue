<template>
  <div class="user-info">
    <div class="avatar">
      <img :src="imageUrl">
    </div>
    <ul class="userinfo">
      <li v-for="(value,item,index) in user" :key="index">
        <label>{{ item | toChina }}：</label><span>{{ value | gender }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  filters: {
    gender(str) {
      if (str === 'male') {
        return '男'
      }
      if (str === 'female') {
        return '女'
      }
      return str
    },
    toChina(str) {
      if (str === 'nickname') {
        return '昵称'
      }
      if (str === 'gender') {
        return '性别'
      }
      if (str === 'birthday') {
        return '生日'
      }
      if (str === 'first_name') {
        return '名'
      }
      if (str === 'last_name') {
        return '姓'
      }
      if (str === 'full_name') {
        return '姓名'
      }
    }
  },
  data() {
    return {
      user: {
        nickname: null,
        gender: null,
        birthday: null,
        first_name: null,
        last_name: null,
        full_name: null
      },
      imageUrl: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    get_openid() {
      if ('openid' in this.$route.query) {
        this.openid = this.$route.query.openid
        var openid = this.$route.query.openid
        return openid
      } else {
        return null
      }
    },
    fetchData() {
      var openid = this.get_openid()
      this.$Apis.user.user_info(openid).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.user.nickname = response.payload.nickname
          this.user.gender = response.payload.gender
          this.user.birthday = response.payload.birthday
          this.user.first_name = response.payload.first_name
          this.user.last_name = response.payload.last_name
          this.user.full_name = response.payload.full_name
          var head_id = response.payload.head_id
          if (head_id) {
            this.$Apis.attachment.download_attachment_by_id(head_id).then(response => {
              if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                this.imageUrl = response.payload.content
              }
            })
          } else {
            this.imageUrl = require('@/assets/images/user_default.png')
          }
        } else {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-info {
  display: flex;
  margin: 80px 0 0 50px;
  .avatar {
    display: flex;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.15);
    img {
      display: block;
      width: 90%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  .userinfo {
    margin-top: 0;
    margin-left: 50px;
    border-left: 1px solid #eee;
    li {
      display: flex;
      padding: 10px 0;
      color: #666;
      label {
        display: block;
        min-width: 100px;
        margin-right: 15px;
        text-align: right;
      }
      span {
        color: #333;
      }
    }
  }
}
</style>

