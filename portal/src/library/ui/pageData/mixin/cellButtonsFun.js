export default {
  methods: {
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
        this.$emit('update', { objid: ids, objTitle: '更新', isEdit: true })
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
        this.$emit('update', { objid: ids, objTitle: '查看', isEdit: false })
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
              // this.refresh([])
              this.$emit('refresh', [])
            }
          })
        })
      }).catch(() => {
      })
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
        // this.mtd_id = item.mtd_id
        if (item.confirm_msg) {
          this.$confirm(item.confirm_msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirm-button',
            cancelButtonClass: 'cancel-button'
          }).then(() => {
            this.$emit('update', { objid: ids, mtd_id: item.mtd_id, objTitle: '更新', isEdit: true, uri: item.uri })
          }).catch(() => {})
        } else {
          this.$emit('update', { objid: ids, mtd_id: item.mtd_id, objTitle: '更新', isEdit: true, uri: item.uri })
        }
      } else {
        this.set_session()
        const route = this.$router.resolve({
          name: 'data_update',
          query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record, page_id: this.page_id }
        })
        if (item.confirm_msg) {
          this.$confirm(item.confirm_msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: 'confirm-button',
            cancelButtonClass: 'cancel-button'
          }).then(() => {
            if (item.uriopentype === '0') {
              window.open(route.href, '_blank')
            } else if (item.uriopentype === '1') {
              this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record, page_id: this.page_id }})
            } else {
              this.$emit('showMtdEdit', { mtd_id: item.mtd_id, data: [], dialogTitle: item.name, ids: ids, uri: item.uri })
            }
          }).catch(() => {})
        } else {
          if (item.uriopentype === '0') {
            window.open(route.href, '_blank')
          } else if (item.uriopentype === '1') {
            this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record, page_id: this.page_id }})
          } else {
            this.$emit('showMtdEdit', { mtd_id: item.mtd_id, data: [], dialogTitle: item.name, ids: ids, uri: item.uri })
          }
          // this.$router.push({ name: 'data_update', query: { object_id: this.object_id, mtd_id: item.mtd_id, objid: ids, record: this.enable_record, page_id: this.page_id }})
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
                this.$emit('refresh')
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
              this.$emit('refresh')
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
            this.$emit('openDialog', { title: item.operate_name, url: newUrl})
          }
        }).catch(() => {})
      } else {
        if (item.uriopentype === '0') {
          console.log('11', newUrl)
          window.open(newUrl, '_blank')
        } else if (item.uriopentype === '1') {
          this.$Utils.util.routerGo(newUrl)
        } else {
          // this.dialogMtd = !this.dialogMtd
          // this.mtdTitle = item.operate_name
          // this.mtd_get_url = newUrl
          this.$emit('openDialog', { title: item.operate_name, url: newUrl})
        }
      }
    }
  }
}
