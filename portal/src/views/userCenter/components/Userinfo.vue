<template>
  <div class="master-userinfo">
    <el-upload
      :action="action"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="changeUpload"
      class="avatar-uploader"
    >
      <div class="user-avatar">
        <img :src="avatar">
      </div>
      <div class="user-code">
        {{ userinfo.full_name }} <span>{{ userinfo.nickname }}</span>
      </div>
      <div class="avatar-uploader-icon avatar-upload">
        <i class="el-icon-upload2" />上传头像
      </div>
    </el-upload>
    <div class="userinfo-box">
      <div v-if="roles.length" class="user-role">
        <label>角色</label>
        <div class="role-item">
          <div v-for="item in roles" :key="item.role_id">
            {{ item.role_name }}
          </div>
        </div>
      </div>
      <el-form ref="userinfo" :model="userinfo" :rules="rules" label-width="130px">
        <el-form-item label="姓名">
          <el-input v-model="userinfo.full_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userinfo.nickname" :disabled="true" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="userinfo.gender" :disabled="true" />
        </el-form-item>
        <el-form-item label="名">
          <el-input v-model="userinfo.first_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓">
          <el-input v-model="userinfo.last_name" :disabled="true" />
        </el-form-item>
        <el-form-item label="当前所属组织机构">
          <el-select v-model="active_org_id" placeholder="请选择" clearable @change="change">
            <el-option
              v-for="item in orgs"
              :key="item.org_id"
              :label="item.name"
              :value="item.org_id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.namespace }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" class="email-form-item">
          <el-input v-if="mobile ? true : false" id="mobile" v-model="mobile" :disabled="mobile ? true: false" />
          <!-- <el-button v-if="email" type="primary" round @click="update_email">更改邮箱</el-button> -->
          <span v-else class="action-email" @click="bindMobile"><i class="el-icon-edit" />绑定手机号</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" class="email-form-item">
          <el-input v-if="email ? true : false" id="email" v-model="email" :disabled="email ? true: false" />
          <!-- <el-button v-if="email" type="primary" round @click="update_email">更改邮箱</el-button> -->
          <span v-else class="action-email" @click="bind_email"><i class="el-icon-edit" />绑定邮箱</span>
        </el-form-item>
        <el-form-item label="飞书" prop="email" class="email-form-item">
          <el-input v-if="Lark ? true : false" id="Lark" v-model="Lark" :disabled="Lark ? true: false" />
          <span v-else class="action-email" @click="bindLark">
            <i class="el-icon-edit" />绑定飞书
            <lark ref="lark" @setLark="setLark" />
          </span>
          <!-- <bind-lark v-else @setLark="setLark"></bind-lark> -->
        </el-form-item>
        <el-form-item label="钉钉" prop="email" class="email-form-item">
          <el-input v-if="DingTalk ? true : false" id="DingTalk" v-model="DingTalk" :disabled="DingTalk ? true: false" />
          <span v-else class="action-email" @click="bindDingTalk">
            <i class="el-icon-edit" />绑定钉钉
            <ding-talk ref="dingtalk" @setDingTalk="setDingTalk" />
          </span>
        </el-form-item>
        <el-form-item label="企业微信" prop="email" class="email-form-item">
          <el-input v-if="WeChat ? true : false" id="WeChat" v-model="WeChat" :disabled="WeChat ? true: false" />
          <span v-else class="action-email" @click="bindWeChat">
            <i class="el-icon-edit" />绑定企业微信
            <we-chat ref="wechat" @setWeChat="setWeChat" />
          </span>
        </el-form-item>
        <el-form-item label="I3" prop="email" class="email-form-item">
          <el-input v-if="I3 ? true : false" id="I3" v-model="I3" :disabled="I3 ? true: false" />
          <span v-else class="action-email" @click="bindI3">
            <i class="el-icon-edit" />绑定I3
            <i3 ref="i3" @setI3="setI3" />
          </span>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="danger" @click="submitForm('userinfo')">保存修改</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisibleEmail"
      width="30%"
    >
      <bind-email v-if="dialogBind" :send-code="sendCode" @timeDown="timeDown" @show="isShowEmail" @setEmail="setEmail" />
      <update-email v-else :send-code="sendCode" @timeDown="timeDown" @show="isShowEmail" @setEmail="setEmail" />
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisibleMobile"
      width="30%"
    >
      <bind-mobile :send-code="sendCode" @timeDown="timeDown" @show="isShowMobile" @setMobile="setMobile" />
<!--      <update-email v-else :send-code="sendCode" @timeDown="timeDown" @show="isShowMobile" />-->
    </el-dialog>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog :visible.sync="dialogCropperVisible" title="图片剪裁" append-to-body>
      <div class="cropper-content">
        <div class="tips">
          提示：图片尺寸不要小于145*145
        </div>
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :fixed="option.fixed"
            :center-box="option.centerBox"
            :info-true="option.infoTrue"
            :fixed-box="option.fixedBox"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="danger" @click="finish">
          确认
        </el-button>
        <el-button plain @click="dialogCropperVisible = false">
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { user_loginid_list, user_update } from '@/library/api/user'
import updateEmail from './updateEmail'
import bindEmail from './bindEmail'
import lark from '@/views/login/Lark'
import DingTalk from '@/views/login/DingTalk'
import { save_attachment, update_attachment } from '@/library/api/attachment'
import bindMobile from './bindMobile'
import { mapGetters, mapActions } from 'vuex'
import WeChat from '@/views/login/WeChat'
import I3 from '@/views/login/I3'

export default {
  components: {
    DingTalk,
    updateEmail,
    bindEmail,
    lark,
    bindMobile,
    WeChat,
    I3
  },
  data() {
    return {
      action: 'string',
      // userinfo: {
      //   full_name: '',
      //   nickname: '',
      //   gender: '',
      //   first_name: '',
      //   last_name: ''
      // },
      roles: [],
      mobile: '',
      email: '',
      rules: {
        mobile: [
          // { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
        ]
      },
      dialogTitle: '',
      dialogVisibleEmail: false,
      dialogVisibleMobile: false,
      dialogBind: false,
      sendCode: {
        disabled: false,
        sending: true,
        second: 60
      },
      dialogCropperVisible: false,
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.5, // 裁剪生成图片的质量
        outputType: 'jpg', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 160, // 默认生成截图框宽度
        autoCropHeight: 160, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        // fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      uploadFile: {},
      // 防止重复提交
      loading: false,
      head_id: null,
      active_org_id: null,
      Lark: null,
      DingTalk: null,
      WeChat: null,
      I3: null
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'userinfo',
      'myroles',
      'orgs'
    ])
  },
  created() {
    this.head_id = this.userinfo.head_id
    user_loginid_list().then(response => {
      if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
        response.payload.forEach((value, key) => {
          if (value.login_type === 'email') {
            this.email = value.login_id
          } else if (value.login_type === 'lark') {
            this.Lark = value.login_id
          } else if (value.login_type === 'dingtalk') {
            this.DingTalk = value.login_id
          } else if (value.login_type === 'mobile') {
            this.mobile = value.login_id
          } else if (value.login_type === 'wechat') {
            this.WeChat = value.login_id
          } else if (value.login_type === 'i3') {
            this.I3 = value.login_id
          }
        })
      }
    })
    this.active_org_id = this.$store.getters.active_org_id
    this.roles = this.unique(this.myroles)
  },
  methods: {
    ...mapActions([
      'SetUserActiveOrg'
    ]),
    change(val) {
      this.SetUserActiveOrg(val)
    },
    changeUpload(file) {
      this.uploadFile = file.raw
      this.$nextTick(() => {
        const isJPG = file.raw.type === 'image/jpg'
        const isJPEG = file.raw.type === 'image/jpeg'
        const isPNG = file.raw.type === 'image/png'
        const isLt2M = file.raw.size / 1024 / 1024 < 1
        if (!isJPG && !isJPEG && !isPNG) {
          this.$message.error('上传头像图片必须是 JPG/JPEG/PNG 格式!')
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 1MB!')
          }
          return (isJPG || isJPEG || isPNG) && isLt2M
        } else {
          this.option.img = URL.createObjectURL(file.raw)
          this.dialogCropperVisible = true
          this.loading = false
        }
      })
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropData((data) => {
        this.loading = true
        var file_name = this.uploadFile.uid + '.jpg'
        // 判断 head_id 是否存在
        if (this.head_id) {
          update_attachment(this.head_id, data).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$store.commit('SET_AVATAR', data)
              this.dialogCropperVisible = false
            } else {
              this.$alert(response.message, '标题名称', {
                confirmButtonText: '确定',
                callback: action => {
                  this.loading = false
                }
              })
            }
          })
        } else {
          save_attachment(file_name, data).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              var openid = null
              var first_name = this.userinfo.first_name
              var last_name = this.userinfo.last_name
              var gender = this.userinfo.gender
              var props = this.userinfo.props
              var birthday = this.userinfo.birthday
              var head_id = response.payload
              this.head_id = head_id
              user_update(openid, gender, birthday, last_name, first_name, props, head_id)
              this.$store.commit('SET_AVATAR', data)
              this.dialogCropperVisible = false
            } else {
              this.$alert(response.message, '标题名称', {
                confirmButtonText: '确定',
                callback: action => {
                  this.loading = false
                }
              })
            }
          })
        }
      })
    },
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.$alert('submit!', '标题名称', {
    //         confirmButtonText: '确定'
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
    bind_email() {
      this.dialogVisibleEmail = !this.dialogVisibleEmail
      this.dialogVisibleMobile = false
      this.dialogTitle = '绑定邮箱'
      this.dialogBind = true
    },
    update_email() {
      this.dialogVisibleEmail = !this.dialogVisibleEmail
      this.dialogVisibleMobile = false
      this.dialogTitle = '更改邮箱'
      this.dialogBind = false
    },
    isShowEmail() {
      this.dialogVisibleEmail = !this.dialogVisibleEmail
      this.dialogVisibleMobile = false
    },
    timeDown() {
      const timer = setInterval(() => {
        this.sendCode.second--
        if (this.sendCode.second === 0) {
          clearInterval(timer)
          this.sendCode.second = 60
          this.sendCode.sending = true
          this.sendCode.disabled = false
        }
      }, 1000)
    },
    unique(arr) {
      const res = new Map()
      // 返回arr数组过滤后的结果，结果为一个数组  过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter((arr) => !res.has(arr.role_name) && res.set(arr.role_name, 1))
    },
    bindLark() {
      this.$refs.lark.bind()
    },
    bindDingTalk() {
      this.$refs.dingtalk.bind()
    },
    bindWeChat() {
      this.$refs.wechat.bind()
    },
    bindI3() {
      this.$refs.i3.bind()
    },
    setLark(val) {
      this.Lark = val
    },
    setDingTalk(val) {
      this.DingTalk = val
    },
    setWeChat(val) {
      this.WeChat = val
    },
    setEmail(val) {
      this.email = val
    },
    setMobile(val) {
      this.mobile = val
    },
    setI3(val) {
      this.I3 = val
    },
    bindMobile() {
      this.dialogVisibleEmail = false
      this.dialogVisibleMobile = !this.dialogVisibleEmail
      this.dialogTitle = '绑定手机号'
      this.dialogBind = true
    },
    isShowMobile() {
      this.dialogVisibleEmail = false
      this.dialogVisibleMobile = !this.dialogVisibleMobile
    },
  }
}
</script>
