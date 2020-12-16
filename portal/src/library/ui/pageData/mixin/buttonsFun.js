export default {
  methods: {
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    update(row, isOuterObj) {
      let ids = []
      this.update_headers = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      if (isOuterObj) {
        this.objid = ids
        this.dialogCreate = !this.dialogCreate
        this.isCreate = false
        this.objTitle = '更新'
        this.isEdit = true
      } else {
        this.set_session()
        this.$router.push({ name: 'data_update', query: { object_id: this.object_id, objid: ids, record: this.enable_record, page_id: this.page_id }})
      }
    },
    info(row, isOuterObj) {
      this.update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      if (isOuterObj) {
        this.objid = ids
        this.dialogCreate = !this.dialogCreate
        this.isCreate = false
        this.objTitle = '查看'
        this.isEdit = false
      } else {
                this.set_session()
        this.$router.push({ name: 'data_info', query: { object_id: this.object_id, page_id: this.page_id, objid: ids, record: this.enable_record }})
      }
    },
    remove(row) {
      let ids = []
      this.headers_all.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      this.$confirm('是否删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-button',
        cancelButtonClass: 'cancel-button'
      }).then(() => {
        if (!ids) {
          this.$alert('该业务类下字段没有设置主键，不允许删除', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        this.$Apis.object.data_delete(this.object_id, ids, this.page_id).then(response => {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.refresh([])
            }
          })
        })
      }).catch(() => {
      })
    },
    add_script(code) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.text = code
      document.head.appendChild(script)
    },
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
          this.refresh()
        }).catch(() => {})
      } else {
        this.$Apis.object.data_update(this.object_id, ids, classColumn, item.operate_code, this.page_id)
        this.refresh()
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
      this.mtd_id = item.mtd_id
      this.batchData = JSON.parse(JSON.stringify(this.headers_all))
      this.batchData.forEach(element => {
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
          this.dialogVisible = !this.dialogVisible
          this.batchVisible = true
          this.dialogTitle = '批量修改'
        }).catch(() => {})
      } else {
        this.dialogVisible = !this.dialogVisible
        this.batchVisible = true
        this.dialogTitle = '批量修改'
      }
    },
    // 个性修改
    clickType3(item, row, isOuterObj) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      this.update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          this.update_headers.push(element)
        }
      })
      this.update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      if (isOuterObj) {
        this.objid = ids
        this.mtd_id = item.mtd_id
        if (item.confirm_msg) {
          this.$confirm(item.confirm_msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirm-button',
            cancelButtonClass: 'cancel-button'
          }).then(() => {
            this.dialogCreate = !this.dialogCreate
            this.isCreate = false
            this.objTitle = '更新'
            this.isEdit = true
          }).catch(() => {})
        } else {
          this.dialogCreate = !this.dialogCreate
          this.isCreate = false
          this.objTitle = '更新'
          this.isEdit = true
        }
      } else {
        this.set_session()
        if (item.confirm_msg) {
          this.$confirm(item.confirm_msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirm-button',
            cancelButtonClass: 'cancel-button'
          }).then(() => {
            this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record, page_id: this.page_id }})
          }).catch(() => {})
        } else {
          this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record, page_id: this.page_id }})
        }
      }

    },
    // 定制操作POST
    clickType4(item, row, isOuterObj) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      const update_headers = []
      let ids = []
      this.headers_all.forEach(element => {
        if (!element['is_property'] && !element['is_object']) {
          update_headers.push(element)
        }
      })
      update_headers.some(element => {
        element['value'] = row[element['prop']]
        if (element['is_primary']) {
          if (element['value']) {
            ids.push(element['value'])
            return true
          }
        }
      })
      ids = ids.join(',')
      if (!isOuterObj) {
        this.set_session()
      }
      this.params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }

      if (item.confirm_msg) {
        this.$confirm(item.confirm_msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'confirm-button',
          cancelButtonClass: 'cancel-button'
        }).then(() => {
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
                this.refresh()
              }
            })
          })
        }).catch(() => {})
      } else {
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
              this.refresh()
            }
          })
        })
      }
    },
    // 定制操作GET
    clickType5(item, row) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
      let newUrl = null
      if (this.$Utils.validate.isExternal(url)) {
        newUrl = url
      } else {
        const update_headers = []
        let ids = []
        this.headers_all.forEach(element => {
          if (!element['is_property'] && !element['is_object']) {
            update_headers.push(element)
          }
        })
        update_headers.some(element => {
          element['value'] = row[element['prop']]
          if (element['is_primary']) {
            if (element['value']) {
              ids.push(element['value'])
              return true
            }
          }
        })
        ids = ids.join(',')
        this.params = { object_id: this.object_id, page_id: this.page_id, mtd_id: item.mtd_id, id: ids }
        var _result = []
        for (var key in this.params) {
          var value = this.params[key]
          if (Array.isArray(value)) {
            value.forEach(function(_value) {
              _result.push(key + '=' + _value)
            })
          } else if (value === null) {
            _result.push(key + '=')
          } else {
            _result.push(key + '=' + value)
          }
        }

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
            this.dialogMtd = !this.dialogMtd
            this.mtdTitle = item.operate_name
            this.mtd_get_url = newUrl
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '1') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          this.dialogMtd = !this.dialogMtd
          this.mtdTitle = item.operate_name
          this.mtd_get_url = newUrl
        }
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
                this.refresh()
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
              this.refresh()
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
        var _result = []
        for (var key in this.params) {
          var value = this.params[key]
          if (Array.isArray(value)) {
            value.forEach(function(_value) {
              _result.push(key + '=' + _value)
            })
          } else if (value === null) {
            _result.push(key + '=')
          } else {
            _result.push(key + '=' + value)
          }
        }

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
            this.dialogMtd = !this.dialogMtd
            this.mtdTitle = item.operate_name
            this.mtd_get_url = newUrl
          }
        }).catch(() => {})
      } else {
        this.set_session()
        if (item.uriopentype === '0') {
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '1') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          this.dialogMtd = !this.dialogMtd
          this.mtdTitle = item.operate_name
          this.mtd_get_url = newUrl
        }
      }
    },
    // 类“新建”操作
    clickType8(item) {
      // 如果有注入JavaScript代码，先注入JS代码
      if (item.append_script) {
        this.add_script(item.append_script)
      }
      const url = item.uri
      if (!url) {
        this.$alert('没有URL地址', '提示', {
          confirmButtonText: '确定'
        })
        return false
      }
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
          } else if (value === null) {
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
          if (item.uriopentype === '0' && !this.$Utils.validate.isExternal(url)) {
            this.$Utils.request({
              url: url,
              method: 'post',
              data: this.params
            }).then((response) => {
              this.$alert(response.payload, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.refresh()
                }
              })
            })
          } else if(item.uriopentype === '1') {
            window.open(newUrl, '_blank')
          } else if (item.uriopentype === '2') {
            this.$Utils.util.routerGo(newUrl)
          } else {
            this.dialogMtd = !this.dialogMtd
            this.mtdTitle = item.operate_name
            this.mtd_get_url = newUrl
          }
        }).catch(() => {})
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
                this.refresh()
              }
            })
          })
        } else if(item.uriopentype === '1') {
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '2') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          this.dialogMtd = !this.dialogMtd
          this.mtdTitle = item.operate_name
          this.mtd_get_url = newUrl
        }
      }
    },
    // 文件导入操作
    changeUpload(file, fileList) {
      const isXls = file.raw.type === 'application/vnd.ms-excel'
      const isXlsx = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const action = this.newOtherMethods.find(item => {
        return item.operate_type === 9
      })
      const uri = action.uri || '/rpcgateway/LegoObjectService/import_excel'

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
        form.append('object_id', action.object_id)
        form.append('mtd_id', action.mtd_id)
        form.append('filename', file.name)
        form.append('start_rows_input', action.start_rows_input || 1)
        form.append('cols_name_input', action.cols_name_input || '')
        this.$Utils.request({
          url: uri,
          method: 'post',
          data: form
        }).then((response) => {
          this.$alert(response.payload, '提示', {
            confirmButtonText: '确定'
          })
          this.refresh()
        })
      }
      fileList = []
    }
  }
}
