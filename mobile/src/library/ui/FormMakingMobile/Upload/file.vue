<template>
  <div>
    <van-uploader ref="fileUpload" v-model="list" :after-read="afterRead" accept="*">
      <van-button icon="plus" type="primary" size="small">
        上传文件
      </van-button>
    </van-uploader>
    <div class="filelist">
      <ul>
        <li v-if="isShow" v-for="(item, index) in list" :key="index">
          <div class="item">
            <i class="el-icon-document" />{{ item.file.name }}
          </div>
          <template>
            <span @click="update(item)"><i class="el-icon-refresh" /></span>
            <span @click="remove(index)"><i class="el-icon-delete" /></span>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
export default {
  props: {
    action: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 9999
    },
    tip: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    file_id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // list: this.value
      list: [],
      fileVal: [],
      fileLimit: this.limit,
      fileListVal: [],
      updateId: '',
      isShow: false,
      file_content: '',
      dwList: [],
      isUpdate: false
    }
  },
  watch: {
    list(val) {
      // console.log('&&&&', val)
      this.fileVal = []
      val.forEach(item => {
        this.fileVal.push(item.attach_id)
      })
      const value = this.fileVal.join('|')
      this.$emit('input', value)
    }
  },
  created() {
    if (this.multiple) {
      this.fileLimit = this.limit
    } else {
      this.fileLimit = 1
    }
    if (this.value) {
      if (this.multiple) {
        const val = this.value.split('|')
        val.forEach(item => {
          this.$Apis.attachment.download_attachment_by_id(item).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.list.push({
                name: response.payload.object_name,
                attach_id: item
              })
              this.isShow = true

              this.$Utils.request({
                url: '/rpcgateway/AttachmentService/file_content?attach_id=' + item,
                responseType: 'arraybuffer'
              }).then(res => {
                this.dwList.push({
                  name: response.payload.object_name,
                  content: res
                })
              })
            }
          })
        })
      } else {
        this.$Apis.attachment.download_attachment_by_id(this.value).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.list.push({
              name: response.payload.object_name,
              attach_id: this.value
            })
            this.isShow = true
          }
        })
      }
    }
    this.fileListVal = this.list
  },
  methods: {
    afterRead(file) {
      if (this.isUpdate) {
        this.handleChange(file)
        this.isUpdate = false
      } else {
        this.handleUpload(file)
      }
    },
    handleUpload(file) {
      const total = file.file.size
      // const startTime = new Date()
      const step = 1024 * 1024 * 3 // 每次读取文件大小
      let cuLoaded = 0 // 当前已经读取总数

      const that = this
      const reader = new FileReader()
      reader.readAsArrayBuffer(file.file.slice(0, 0 + step))
      reader.onload = function(evt) {
        // const blob = new Blob([evt.target.result])
        const loaded = evt.loaded
        var formData = new FormData()
        formData.append('object_name', file.file.name)
        // formData.append('content', blob, file.file.name)
        formData.append('content', file.file)

        that.isShow = false
        that.$Utils.request({
          url: that.action,
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          if (response.code === that.$Utils.Constlib.ERROR_CODE_OK) {
            that.$toast('上传成功')
            cuLoaded += loaded
            if (cuLoaded < total) {
              reader.readAsArrayBuffer(file.file.slice(cuLoaded, cuLoaded + step))
            } else {
              // console.log('总共用时：' + (new Date().getTime() - startTime.getTime()) / 1000)
              cuLoaded = total

              that.$set(file, 'attach_id', response.payload)
              setTimeout(() => {
                that.isShow = true
              }, 500)
            }
          } else {
            that.$dialog.alert({
              message: response.message
            })
          }
        })
      }
    },

    downloadAll() {
      var JSZip = require('jszip')
      var zip = JSZip()
      var fileDownload = require('js-file-download')
      try {
        var isFileSaverSupported = !!new Blob()
      } catch (e) {}
      this.dwList.forEach(item => {
        zip.file(item.name, item.content)
      })

      zip.generateAsync({ type: 'blob' }).then(function(content) {
        if (isFileSaverSupported) {
          saveAs(content, '附件.zip')
        } else {
          fileDownload(content, '附件.zip')
        }
      })
    },
    download(item) {
      const aLink = document.createElement('a')
      const fileName = item.name
      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = '/rpcgateway/AttachmentService/download_by_id?attach_id=' + item.attach_id
      aLink.click()
    },
    remove(index) {
      this.list.splice(index, 1)
    },
    update(item) {
      this.updateId = item.attach_id
      this.isUpdate = true
      this.$refs.fileUpload.chooseFile()
    },
    handleChange(file) {
      const total = file.file.size
      // const startTime = new Date()
      const step = 1024 * 1024 * 3 // 每次读取文件大小
      let cuLoaded = 0 // 当前已经读取总数

      const that = this
      const reader = new FileReader()
      reader.readAsArrayBuffer(file.file.slice(0, 0 + step))
      reader.onload = function(evt) {
      // const blob = new Blob([evt.target.result])
        const loaded = evt.loaded
        var formData = new FormData()
        formData.append('attach_id', that.updateId)
        formData.append('object_name', file.name)
        formData.append('content', file.file)

        that.$Utils.request({
          url: '/rpcgateway/AttachmentService/update_attachment',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          if (response.code === that.$Utils.Constlib.ERROR_CODE_OK) {
            that.$toast('上传成功')
            cuLoaded += loaded
            if (cuLoaded < total) {
              reader.readAsArrayBuffer(file.file.slice(cuLoaded, cuLoaded + step))
            } else {
              cuLoaded = total

              that.$set(that.list, that.list.findIndex(item => item.attach_id === that.updateId), {
                ...that.list[that.list.findIndex(item => item.attach_id === that.updateId)],
                name: file.name,
                attach_id: that.updateId
              })
              setTimeout(() => {
                that.isShow = true
              }, 500)
            }
          } else {
            that.$dialog.alert({
              message: response.message
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.download {
  display: inline-block;
  margin-left: 10px;
  padding: 9px 15px;
  background: #67c23a;
  border: 1px solid #67c23a;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  line-height: 1;
  &:hover {
    opacity: 0.8;
  }
}
.filelist {
  margin-top: 8px;
  ul li {
    display: flex;
    padding: 0 10px;
    align-items: center;
    cursor: pointer;
    color: #606266;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    position: relative;
    .item {
      flex: 1;
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
    span {
      margin: 0 4px;
      font-size: 15px;
    }
    &:hover {
      background: #ededed;
      color: #409eff;
    }
  }
}

/deep/ .van-uploader__preview {
  display: none;
}
</style>
