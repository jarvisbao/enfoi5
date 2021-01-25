export default {
  data() {
    return {
      params: {},
      fileAction: null
    }
  },
  methods: {
    // 批量处理
    clickType1(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }

      const classColumn = {}
      let ids = null
      this.headers_all.forEach(element => {
        if (item.edit_prop.includes(element.prop)) {
          classColumn[element['prop']] = item.editval
        }
      })
      if (this.isAll) {
        ids = {}
      } else {
        ids = this.ids.join(',')
      }
      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          // 修改批量设置的值
          this.$Apis.object.data_update(this.object_id, ids, classColumn, item.operate_code, this.page_id)
          this.$emit('refresh')
        }).catch(() => {})
      } else {
        this.$Apis.object.data_update(this.object_id, ids, classColumn, item.operate_code, this.page_id)
        this.$emit('refresh')
      }
    },
    // 批量修改
    clickType2(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }
      // this.mtd_id = item.mtd_id
      const batchData = JSON.parse(JSON.stringify(this.headers_all))
      batchData.forEach(element => {
        if (item.view_prop.includes(element.prop)) {
          element['isview'] = true
        }
        if (item.edit_prop.includes(element.prop)) {
          element['isedit'] = true
        }
      })
      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.$emit('showMtdEdit', { mtd_id: item.mtd_id, data: batchData })
        }).catch(() => {})
      } else {
        // this.dialogVisible = !this.dialogVisible
        // this.batchVisible = true
        // this.dialogTitle = '批量修改'
        this.$emit('showMtdEdit', { mtd_id: item.mtd_id, data: batchData, dialogTitle: '批量修改' })
      }
    },
    // 定制批量操作POST
    clickType6(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }

      let ids = []
      this.selectionData.forEach((item, index) => {
        this.headers_all.some(element => {
          element['value'] = item[element['prop']]
          if (element['is_primary']) {
            if (element['value']) {
              ids.push(element['value'])
              return true
            }
          }
        })
      })
      ids = ids.join(',')
      this.params = { object_id: this.object_id, page_id: this.page_id, ids: ids, mtd_id: item.mtd_id }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.set_session()
          this.$Utils.request({
            url: url,
            method: 'post',
            data: {
              param: Base64.encode(JSON.stringify(this.params))
            }
          }).then((response) => {
            this.$alert(response.payload, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$emit('refresh')
              }
            })
          })
        }).catch(() => {})
      } else {
        this.set_session()
        this.$Utils.request({
          url: url,
          method: 'post',
          data: {
            param: Base64.encode(JSON.stringify(this.params))
          }
        }).then((response) => {
          this.$alert(response.payload, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$emit('refresh')
            }
          })
        })
      }
    },
    // 定制批量操作GET
    clickType7(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (JSON.stringify(this.selectionData) === '[]') {
        this.$alert('请选择要操作的条目！', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      // 满足适用条件时执行
      if (item.apply_condition) {
        const arr = this.selectionData.filter(row => {
          return eval(item.apply_condition)
        })
        if (arr.length !== this.selectionData.length) {
          this.$alert('选择的条目中有不能执行的，请去掉再操作！', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
      }
      let newUrl = null
      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        const ids = []
        this.selectionData.forEach((item, index) => {
          this.headers_all.some(element => {
            element['value'] = item[element['prop']]
            if (element['is_primary']) {
              if (element['value']) {
                ids.push(element['value'])
                return true
              }
            }
          })
        })
        this.params = { object_id: this.object_id, page_id: this.page_id, ids: ids, mtd_id: item.mtd_id }
        // var _result = []
        // for (var key in this.params) {
        //   var value = this.params[key]
        //   if (Array.isArray(value)) {
        //     value.forEach(function(_value) {
        //       _result.push(key + '=' + _value)
        //     })
        //   } else if (value === null) {
        //     _result.push(key + '=')
        //   } else {
        //     _result.push(key + '=' + value)
        //   }
        // }

        const params = url.split('?')[1] || ''
        if (params) {
          newUrl = url + '&param=' + Base64.encode(JSON.stringify(this.params))
        } else {
          newUrl = url + '?param=' + Base64.encode(JSON.stringify(this.params))
        }
      }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
          this.set_session()
          if (item.uriopentype === '0') {
            window.open(newUrl, '_blank')
          } else if (item.uriopentype === '1') {
            this.$Utils.util.routerGo(newUrl)
          } else {
            this.$emit('openDialog', { title: item.operate_name, url: newUrl})
          }
        }).catch(() => {})
      } else {
        this.set_session()
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '1') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          this.$emit('openDialog', { title: item.operate_name, url: newUrl})
          // this.dialogMtd = !this.dialogMtd
          // this.mtdTitle = item.operate_name
          // this.mtd_get_url = newUrl
        }
      }
    },
    // 类“新建”操作
    clickType8(item, isOuterObj) {
      /**
       * 若url有值，则以url为主，按原有逻辑跳转, 如果是外置子对象则以新窗口的方式打开
       * 若url没有值，表单有值，则以表单值为主
       * 或url,表单都有值，以URL为主
      */
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri

      if (url) {
        let newUrl = null
        this.params = { r_objectid: this.object_id, r_pntfk: this.pntfk, r_pntid: this.pntid, r_pnt_clsname: this.pnt_clsname }
        if (this.$Utils.validate.isExternal(url)) {
          newUrl = url
        } else {
          var _result = []
          for (var key in this.params) {
            var value = this.params[key]
            if (Array.isArray(value)) {
              value.forEach(function(_value) {
                _result.push(key + '=' + _value)
              })
            } else if (value === null || value === undefined) {
              _result.push(key + '=')
            } else {
              _result.push(key + '=' + value)
            }
          }

          const params = url.split('?')[1] || ''
          if (params) {
            newUrl = url + '&' + _result.join('&')
          } else {
            newUrl = url + '?' + _result.join('&')
          }
        }

        if (item.confirm_msg) {
          this.$confirm(item.confirm_msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirm-button',
            cancelButtonClass: 'cancel-button'
          }).then(() => {
            this.isUrlTodo(item, url, newUrl, isOuterObj)
          }).catch(() => {})
        } else {
          this.isUrlTodo(item, url, newUrl, isOuterObj)
        }
      } else {
        this.$Apis.object.method_info(item.mtd_id).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            const data = response.payload
            if (!data.design_form && !url) {
              this.$alert('请设置表单或填写URL地址', '提示', {
                confirmButtonText: '确定'
              })
              return false
            }
            if (item.confirm_msg) {
              this.$confirm(item.confirm_msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                confirmButtonClass: 'confirm-button',
                cancelButtonClass: 'cancel-button'
              }).then(() => {
                this.isFormTodo(item, isOuterObj)
              }).catch(() => {})
            } else {
              this.isFormTodo(item, isOuterObj)
            }
          }
        })
      }
    },
    // 文件导入操作
    clickType9(item) {
      this.fileAction = item
      this.$refs.fileUpload.$children[0].$refs.input.click()
    },
    changeUpload(file, fileList) {
      const isXls = file.raw.type === 'application/vnd.ms-excel'
      const isXlsx = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const uri = this.fileAction.uri || '/rpcgateway/LegoObjectService/import_excel'

      if (!isXls && !isXlsx) {
        this.$alert('请上传.xls 或 .xlsx 或 .csv格式的文件', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            return false
          }
        })
      } else {
        const form = new FormData()
        form.append('content', file.raw)
        form.append('object_id', this.fileAction.object_id)
        form.append('mtd_id', this.fileAction.mtd_id)
        form.append('filename', file.name)
        form.append('start_rows_input', this.fileAction.start_rows_input || 1)
        form.append('cols_name_input', this.fileAction.cols_name_input || '')
        this.$Utils.request({
          url: uri,
          method: 'post',
          data: form
        }).then((response) => {
          this.$alert(response.payload, '提示', {
            confirmButtonText: '确定'
          })
          this.$emit('refresh')
        })
      }
      fileList = []
    },
    isUrlTodo(item, url, newUrl, isOuterObj) {
      if (isOuterObj) {
        if (item.uriopentype === '3') {
          this.$emit('openDialog', { title: item.operate_name, url: newUrl})
        } else {
          window.open(newUrl, '_blank')
        }
      } else {
        if (item.uriopentype === '0' && !this.$Utils.validate.isExternal(url)) {
          this.$Utils.request({
            url: url,
            method: 'post',
            data: this.params
          }).then((response) => {
            this.$alert(response.payload, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$emit('refresh')
              }
            })
          })
        } else if (item.uriopentype === '1') {
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '2') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          this.$emit('openDialog', { title: item.operate_name, url: newUrl})
        }
      }
    },
    isFormTodo(item, isOuterObj) {
      if (isOuterObj) {
        if (item.uriopentype === '3') {
          this.$emit('mtdCreate', {object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, mtd_code: item.mtd_code})
        } else {
          const route = this.$router.resolve({
            name: 'data_mtd_create',
            query: { object_id: this.object_id, pntfk: this.pntfk, pntid: this.pntid, page_id: this.page_id, mtd_id: item.mtd_id, mtd_code: item.mtd_code }
          })
          window.open(route.href, '_blank')
        }
      } else {
        if (item.uriopentype === '0' || item.uriopentype === '2') {
          this.$router.push({
            name: 'data_mtd_create',
            query: { object_id: this.object_id, pntfk: this.pntfk, pntid: this.pntid, page_id: this.page_id, mtd_id: item.mtd_id, mtd_code: item.mtd_code }
          })
        } else if (item.uriopentype === '1') {
          const route = this.$router.resolve({
            name: 'data_mtd_create',
            query: { object_id: this.object_id, pntfk: this.pntfk, pntid: this.pntid, page_id: this.page_id, mtd_id: item.mtd_id, mtd_code: item.mtd_code }
          })
          window.open(route.href, '_blank')
        } else {
          this.$emit('mtdCreate', {object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, mtd_code: item.mtd_code})
        }
      }
    }
  }
}