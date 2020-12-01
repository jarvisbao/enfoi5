<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <ul class="icon-list">
        <li v-for="(icon, index) in icons" :key="index" :class="{on: current === icon}" @click="get_class(icon)">
          <i :class="icon" class="iconfont" /><span>{{ icon }}</span>
        </li>
      </ul>
    </el-scrollbar>
    <div style="margin: 10px 0 0 0;text-align: right;">
      <el-button type="danger" @click="submitForm()">
        确定
      </el-button>
      <el-button plain @click="resetForm">
        取消
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AlifontIcon',
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      icons: [
        'icon-jiaose', 'icon-gerenxuanzhong', 'icon-caidan1', 'icon-kucunguanli', 'icon-geren_fill', 'icon-geren_default',
        'icon-qunzu', 'icon-zuzhi', 'icon-caidan', 'icon-cangku', 'icon-legao', 'icon-guanli', 'icon-jigou', 'icon-shezhi1', 'icon-gongwenbao', 'icon-bumen', 'icon-lingdang',
        'icon-dongtai', 'icon-liucheng', 'icon-shujuyuan', 'icon-shezhi', 'icon-richangbangong', 'icon-xiangmu', 'icon-yonghu', 'icon-weibiaoti9',
        'icon-yuangong', 'icon-personal', 'icon-vehicles', 'icon-zuoduiqi', 'icon-youduiqi', 'icon-shenjing', 'icon-chucun', 'icon-shujuwajue', 'icon-liujisuan',
        'icon-jinggai', 'icon-guizeyinqing', 'icon-gaojing', 'icon-shebeizhuangtai', 'icon-add-account', 'icon-fuwudiqiu', 'icon--lumingpai', 'icon-huixingzhen', 'icon-zuzhixiaxia',
        'icon-yunyingguanli', 'icon-yunyingzhongxin', 'icon-guize', 'icon-icon_fabu', 'icon-jizhanguanli', 'icon-yuanquyunwei', 'icon-yibiaopan', 'icon-yingyongguanli',
        'icon-shujukanban', 'icon-tianshenpi', 'icon-yishouquan', 'icon-renjijiaohu', 'icon-jiedianguanli', 'icon-jishufuwu', 'icon-jichuguanli', 'icon-gongnengdingyi',
        'icon-guanlianshebei', 'icon-changjingguanli', 'icon-tiaoshi', 'icon-logistic', 'icon-color', 'icon-time', 'icon-newshot', 'icon-iconfontriyongbaihuo', 'icon-wxbgongju',
        'icon-wxbbaobiao', 'icon-leimu', 'icon-sousuoleimu', 'icon-sousuoleimufill', 'icon-shenfen', 'icon-shanchu', 'icon-pengyou', 'icon-pengyoufill', 'icon-liuyan',
        'icon-liebiaoxingshi', 'icon-qiapianxingshi', 'icon-gouwuche', 'icon-gouwuchefill', 'icon-gonglve', 'icon-gengduo', 'icon-fenxiang1', 'icon-wenhao', 'icon-wenhaofill',
        'icon-creditlevel', 'icon-jifen', 'icon-office', 'icon-similarproduct', 'icon-focus', 'icon-friendfavor', 'icon-ziyouanpai', 'icon-dixiaofei', 'icon-dangdi', 'icon-dangdifill',
        'icon-tixing', 'icon-shouye', 'icon-xingcheng2', 'icon-pinglun', 'icon-fenxiang', 'icon-zonghe', 'icon-zhongzhuan', 'icon-zhinengyouhua', 'icon-yule', 'icon-xitongcaidan',
        'icon-tupian', 'icon-listview', 'icon-youji', 'icon-xingcheng', 'icon-xiangji', 'icon-wuxianwangluo', 'icon-jiesuo', 'icon-shoucang', 'icon-shijian', 'icon-quguo',
        'icon-qian', 'icon-mudedi', 'icon-kanguo', 'icon-huobiduihuan', 'icon-geren', 'icon-fuzhi', 'icon-feiji', 'icon-duoyuyan', 'icon-dizhi', 'icon-daohang', 'icon-xinxi', 'icon-duanxin'
      ],
      current: this.icon
    }
  },
  methods: {
    get_class(icon) {
      this.current = icon
    },
    submitForm() {
      this.$emit('icon', this.current)
      this.resetForm()
    },
    resetForm() {
      this.$emit('show', false)
    }
  }
}
</script>
