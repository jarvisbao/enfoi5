<template>
  <div style="background: #99a9bf">
    <div :id="carousel_id" class="upload" @click="upload">
      <div class="el-upload">
        <i class="el-icon-plus" />
      </div>
    </div>
    <input ref="uploadFile" :style="{width:0, height: 0}" type="file" name="file" class="upload-input" @change="handleUpload">
    <input ref="uploadInput" :style="{width:0, height: 0}" type="file" name="file" class="el-upload__input upload-input" @change="handleChange">

    <van-swipe
      :autoplay="interval"
      :vertical="direction==='vertical'"
      :style="{'height': height || '240px'}"
      indicator-color="#fff"
      class="van-image-preview__swipe"
    >
      <van-swipe-item v-for="(item, index) in list" :key="index" class="van-image-preview__swipe-item">
        <div class="van-image van-image-preview__image">
          <img :src="item.src" class="van-image__img" style="object-fit: cover;">
        </div>
        <div class="filelist">
          <span @click="update(item)"><i class="el-icon-refresh" /></span>
          <span @click="remove(index)"><i class="el-icon-delete" /></span>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import { convertBase64UrlToBlob } from '@/library/js/image'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    arrow: {
      type: String,
      default: 'hover'
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    list: {
      type: Array,
      default: () => []
    },
    carousel_id: {
      type: String,
      default: ''
    },
    interval: {
      type: String,
      default: '3000'
    }
  },
  data() {
    return {
      fileVal: [],
      updateId: null,
      imgList: [
        {
          name: '001.jpg',
          src: 'https://img.yzcdn.cn/vant/leaf.jpg'
        },
        {
          name: '002.jpg',
          src: 'https://img.yzcdn.cn/vant/tree.jpg'
        }
      ]
    }
  },
  watch: {
    list(val) {
      this.fileVal = []
      val.forEach(item => {
        this.fileVal.push(item.attach_id)
      })
      const value = this.fileVal.join('|')
      this.$emit('input', value)
    }
  },
  created() {
    if (this.value) {
      const val = this.value.split('|')
      val.forEach(item => {
        this.$Apis.attachment.download_attachment_by_id(item).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.list.push({
              name: response.payload.object_name,
              attach_id: item,
              src: response.payload.content
            })
          }
        })
      })
    }
  },
  methods: {
    upload() {
      this.$refs.uploadFile.click()
    },
    handleUpload() {
      const files = this.$refs.uploadFile.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (evt) => {
          this.$Utils.request({
            url: '/rpcgateway/AttachmentService/save_attachment',
            method: 'post',
            data: {
              object_name: file.name,
              content: reader.result
            },
            headers: { signature: true }
          }).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$toast('上传成功')
              this.list.push({
                name: file.name,
                src: reader.result,
                attach_id: response.payload
              })
            } else {
              this.$dialog.alert({
                message: response.message
              })
            }
          })
        }
      }
    },
    download(item) {
      const aLink = document.createElement('a')
      const fileName = item.name
      const blob = convertBase64UrlToBlob(item.src)
      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      aLink.click()
    },
    update(item) {
      this.updateId = item.attach_id
      this.$refs.uploadInput.click()
    },
    remove(index) {
      this.list.splice(index, 1)
    },
    handleChange() {
      const files = this.$refs.uploadInput.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (evt) => {
          this.$Utils.request({
            url: '/rpcgateway/AttachmentService/update_attachment',
            method: 'post',
            data: {
              attach_id: this.updateId,
              object_name: file.name,
              content: reader.result
            },
            headers: { signature: true }
          }).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.$toast('更新成功')
              this.$set(this.list, this.list.findIndex(item => item.attach_id === this.updateId), {
                ...this.list[this.list.findIndex(item => item.attach_id === this.updateId)],
                name: file.name,
                src: reader.result,
                attach_id: this.updateId
              })
            } else {
              this.$dialog.alert({
                message: response.message
              })
            }
          })
        }
      }
    }
  }
}
</script>

