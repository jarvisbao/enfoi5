<template>
  <div
    :id="uploadId"
    class="fm-uplaod-container"
  >
    <div
      v-show="fileList.length < 1 || limit"
      :class="{'is-disabled': disabled}"
      class="van-uploader__upload"
      @click="handleAdd"
    >
      <van-icon name="photograph" size="24px" color="#dcdee0" />
      <input ref="uploadInput" v-if="multiple" :style="{width: 0, height: 0}" accept="image/*" multiple type="file" name="file" class="upload-input" @change="handleChange">
      <input ref="uploadInput" v-else :style="{width:0, height: 0}" accept="image/*" type="file" name="file" class="upload-input" @change="handleChange">
    </div>

    <div
      v-for="(item, index) in fileList"
      :id="item.key"
      :key="item.key"
      :style="{width: width+'px', height: height+'px'}"
      class="upload-file"
    >
      <img :src="item.url" @click="handlePreviewFile(index)">

      <div v-if="item.status=='uploading'" class="van-uploader__mask">
        <van-loading size="24px" vertical color="#fff" />
        <div class="van-uploader__mask-message">
          上传中...
        </div>
      </div>

      <template v-if="item.status=='success'">
        <div class="van-uploader__preview-delete" @click="handleRemove(index)">
          <van-icon name="cross" class="van-uploader__preview-delete-icon" />
        </div>

        <div :style="{height: miniWidth / 4 + 'px'}" class="uplaod-action">
          <span v-if="isedit && !disabled" @click="handleEdit(item.key, item.object_name, item.attach_id)">更新</span>
        </div>
      </template>
    </div>
    <!-- 图片预览 -->
    <van-overlay :show="showOverlay" @click="showOverlay = false" />
    <div v-if="showOverlay" class="van-image-preview" style="z-index: 2010;" @click="showOverlay = false">
      <van-swipe :initial-swipe="initialSwipe" class="van-image-preview__swipe" @change="onChange">
        <van-swipe-item v-for="(item, index) in fileList" :key="index" class="van-image-preview__swipe-item">
          <div class="van-image van-image-preview__image">
            <img :src="item.url" class="van-image__img" style="object-fit: cover;">
          </div>
        </van-swipe-item>
        <template #indicator>
          <div class="van-image-preview__index">
            {{ current + 1 }}/{{ fileList.length }}
          </div>
        </template>
      </van-swipe>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 80
    },
    height: {
      type: Number,
      default: 80
    },
    token: {
      type: String,
      default: ''
    },
    domain: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 9
    },
    isQiniu: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    meitu: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      viewer: null,
      uploadId: 'upload_' + new Date().getTime(),
      editIndex: -1,
      meituIndex: -1,
      imgVals: [],
      isdelete: this.isDelete,
      isedit: this.isEdit,
      isUpdate: false,
      updateId: '',
      updateObjName: '',
      showOverlay: false,
      current: 0,
      initialSwipe: 0
    }
  },
  computed: {
    miniWidth() {
      if (this.width > this.height) {
        return this.height
      } else {
        return this.width
      }
    }
  },
  watch: {
    'fileList': {
      // deep: true,
      handler(val) {
        if (val.length > 0) {
          this.imgVals = []
          val.forEach(item => {
            if (this.limit) {
              this.imgVals.push(item.attach_id)
              const value = this.imgVals.join('|')
              this.$emit('input', value)
            }
          })
        } else {
          this.$emit('input', '')
        }
      }
    }
  },
  created() {
    if (this.value) {
      if (this.limit) {
        const val = this.value.split('|')
        val.forEach(item => {
          this.$Apis.attachment.download_attachment_by_id(item).then(response => {
            if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
              this.fileList.push({
                key: item,
                url: response.payload.content,
                percent: 100,
                status: 'success',
                attach_id: item,
                object_name: response.payload.object_name
              })
              this.isdelete = true
              this.isedit = true
            }
          })
        })
      } else {
        this.$Apis.attachment.download_attachment_by_id(this.value).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.fileList = [
              {
                key: this.value,
                url: response.payload.content,
                percent: 100,
                status: 'success',
                attach_id: this.value,
                object_name: response.payload.object_name
              }
            ]
            this.isdelete = true
            this.isedit = true
          }
        })
      }
    }
  },
  mounted() {
    // this.$emit('input', this.fileList)
  },
  methods: {
    handleChange() {
      const files = this.$refs.uploadInput.files

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        const key = (new Date().getTime()) + '_' + Math.ceil(Math.random() * 99999)
        reader.readAsDataURL(file)
        reader.onload = () => {
          if (this.editIndex >= 0) {
            if (this.isUpdate) {
              this.$set(this.fileList, this.editIndex, {
                key: this.updateId,
                url: reader.result,
                percent: 0,
                status: 'uploading'
              })
            } else {
              this.$set(this.fileList, this.editIndex, {
                key,
                url: reader.result,
                percent: 0,
                status: 'uploading'
              })
            }

            this.editIndex = -1
          } else {
            this.fileList.push({
              key,
              url: reader.result,
              percent: 0,
              status: 'uploading'
            })
          }

          this.$nextTick(() => {
            if (this.isUpdate) {
              this.handleUpdate(reader.result, file, this.updateId)
              this.isUpdate = false
            } else {
              this.uplaodAction(reader.result, file, key)
            }
          })
        }
      }
    },
    uplaodAction(res, file, key) {
      const url = this.action

      this.$Utils.request({
        url: url,
        method: 'post',
        data: {
          object_name: file.name,
          content: res
        },
        headers: { signature: true }
      }).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
            ...this.fileList[this.fileList.findIndex(item => item.key === key)],
            url: res,
            percent: 100,
            attach_id: response.payload,
            object_name: file.name
          })
          setTimeout(() => {
            this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
              ...this.fileList[this.fileList.findIndex(item => item.key === key)],
              status: 'success'
            })
            this.isdelete = true
            this.isedit = true
            this.imgVals.push(response.payload)
            const value = this.imgVals.join('|')
            this.$emit('input', value)
          }, 200)
        } else {
          this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
            ...this.fileList[this.fileList.findIndex(item => item.key === key)],
            status: 'error'
          })
          this.fileList.splice(this.fileList.findIndex(item => item.key === key), 1)
        }
      })
    },
    handleUpdate(res, file, key) {
      let object_name = ''
      if (file.name) {
        object_name = file.name
      } else {
        object_name = this.updateObjName
      }
      this.$Apis.attachment.update_attachment(key, res, object_name).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
            ...this.fileList[this.fileList.findIndex(item => item.key === key)],
            url: res,
            percent: 100,
            attach_id: key,
            object_name: file.name
          })
          setTimeout(() => {
            this.$set(this.fileList, this.fileList.findIndex(item => item.key === key), {
              ...this.fileList[this.fileList.findIndex(item => item.key === key)],
              status: 'success'
            })
          }, 200)
        }
      })
    },

    handleRemove(index) {
      this.fileList.splice(index, 1)
    },
    handleEdit(key, object_name, attach_id) {
      this.isUpdate = true
      if (key === attach_id) {
        this.updateId = key
      } else {
        this.updateId = attach_id
      }
      this.updateObjName = object_name
      this.editIndex = this.fileList.findIndex(item => item.key === key)
      this.$refs.uploadInput.click()
    },

    handleAdd() {
      if (!this.disabled) {
        this.editIndex = -1
        this.$refs.uploadInput.click()
      }
    },
    handlePreviewFile(index) {
      this.initialSwipe = index
      this.current = index
      this.showOverlay = true
    },
    onChange(index) {
      this.current = index
    }
  }
}
</script>

<style lang="scss">
.fm-uplaod-container {
  .is-disabled {
    position: relative;

    &::after {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      // background: rgba(0,0,0,.1);
      content: '';
      display: block;
      cursor: not-allowed;
    }
  }

  .upload-file {
    margin: 0 10px 10px 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    // background: #fff;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    position: relative;
    vertical-align: top;
    .uplaod-action {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      justify-content: center;
      align-items: center;
      color: #fff;
      text-align: center;
      font-size: 13px;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }
  .el-upload--picture-card {
    position: relative;
    overflow: hidden;
    .el-icon-plus {
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }
  .upload-input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    opacity: 0;
    cursor: pointer;
  }
}

.viewer-container {
  z-index: 9999 !important;
}
</style>
