export default {
  computed: {
    allBtns() {
      const { items, cellBtn, newSingleMethods, delete_applycondition } = this
      items.forEach(row => {
        this.$set(row, 'buttons', [...cellBtn, ...newSingleMethods])
        row.buttons.forEach((i, index) => {
          if (i.isMtd && eval(i.apply_condition) === false) {
            this.$set(i, 'disabled', true)
          } else {
            this.$set(i, 'disabled', false)
          }
        })
        row.buttons = row.buttons.filter(i => {
          return !i.disabled
        })
        if (delete_applycondition && !eval(delete_applycondition)) {
          row.buttons = row.buttons.filter(i => {
            return i.action !== 'remove'
          })
        }
      })
      return items
    }
  },
  watch: {
    allBtns: {
      handler(val) {}
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, false)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, false)
  },
  methods: {
    resetItems(args) {
      const items = args.row
      const indexes = args.index
      const ids = []
      let primary_key = null
      items.forEach((item, index) => {
        this.headers_all.some(element => {
          element['value'] = item[element['prop']]
          if (element['is_primary']) {
            if (element['value']) {
              if (!primary_key) {
                primary_key = element['prop']
              }
              ids.push(element['value'])
              return true
            }
          }
        })
      })
      const filter = primary_key + '.in_([' + ids.join() + '])'
      if (ids.length > 0 && primary_key) {
        this.$Apis.object.data_list(this.object_id, this.page_id, this.text, this.pagination.page, this.page_size, true, filter, this.convert, this.pntfk, this.pntid, this.pnt_clsname).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            const new_items = response.payload.items
            const new_ids = []
            new_items.forEach(new_item => {
              new_ids.push(new_item[primary_key])
            })
            ids.forEach((id, index) => {
              const new_index = new_ids.indexOf(id)
              if (new_index !== -1) {
                Object.keys(new_items[new_index]).forEach(key => {
                  this.items[indexes[index]][key] = new_items[new_index][key]
                  // items[index][key] = new_items[new_index][key]
                })
              } else {
                this.items.splice(indexes[index], 1)
              }
            })
          }
        })
      }
    },
    handleShowTopBtn() {
      this.showTopBtn = false
    },
    handleScroll() {
      if ((this.can_create && !this.is_view) || this.can_export || this.newOtherMethods.length > 0) {
        const scorllTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (scorllTop > 46) {
          this.showTopBtn = true
        } else {
          this.showTopBtn = false
        }
      }
    },
    get_method() {
      this.$Apis.object.method_list_by_id(this.object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.methodsItems = response.payload.items
          this.get_new_other()
          this.get_new_single()
          if (this.isOuterObj) {
            if (JSON.stringify(this.newOtherMethods) !== '[]') {
              this.mulBtn = true
            } else {
              this.mulBtn = false
            }
          }
        }
      })
    },
    get_new_other() {
      if (this.other_methods !== null) {
        this.other_methods.forEach(element => {
          this.methodsItems.forEach(item => {
            if (element === item.mtd_id) {
              this.newOtherMethods.push(item)
            }
          })
        })
      }
    },
    get_new_single() {
      if (this.single_methods !== null) {
        this.single_methods.forEach(element => {
          this.methodsItems.forEach(item => {
            if (element === item.mtd_id) {
              this.$set(item, 'name', item.operate_name)
              this.$set(item, 'fun', 'clickType' + item.operate_type)
              this.$set(item, 'isMtd', true)
              this.newSingleMethods.push(item)
            }
          })
        })
      }
    },

    overlay(args) {
      this.showOverlay = args.show
      this.loadingText = args.text
    },
    showMtdEdit(args) {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = '批量修改'
      this.mtd_id = args.mtd_id
      this.batchData = args.data
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    openDialog(args) {
      this.dialogMtd = !this.dialogMtd
      this.mtd_get_url = args.url
    },
    add_script(code) {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.text = code
      document.head.appendChild(script)
    },
    checkDate(args) {
      this.selectionData = args.selectionData
      this.ids = args.ids
      this.isAll = args.isAll
    }
  }
}
