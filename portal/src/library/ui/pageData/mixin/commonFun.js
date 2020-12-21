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
    'pagination.total': function(val) {
      if (this.pagination.total === (this.pagination.page - 1) * this.page_size && this.pagination.total !== 0) {
        this.pagination.page -= 1
        this.fetchData()
      }
    },
    allBtns: {
      handler(val) {}
    },
    filters: {
      handler(val) {
        this.pageFilters = val
      }
    }
  },
  methods: {
    get_page_params() {
      if (sessionStorage.getItem(this.$route.name)) {
        const pageParams = JSON.parse(sessionStorage.getItem(this.$route.name))
        if (this.$route.path === pageParams.path) {
          this.text = pageParams.text
          this.pagination.page = pageParams.page_index
          this.page_size = pageParams.page_size
        }
      }
    },
    get_method() {
      this.$Apis.object.method_list_by_id(this.object_id).then(response => {
        if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
          this.loading = false
          this.methodsItems = response.payload.items
          this.get_new_other()
          this.get_new_single()
          if (JSON.stringify(this.newOtherMethods) !== '[]') {
            this.isMultiple = true
          } else {
            this.isMultiple = false
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
    schfilter() {
      this.pagination.page = 1
      this.operateData()
    },
    handleSizeChange(val) {
      this.page_size = val
      this.operateData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.operateData()
    },
    set_session() {
      sessionStorage.setItem(this.$route.name, JSON.stringify({ 'path': this.$route.path, 'text': this.text, 'page_index': this.pagination.page, 'page_size': this.page_size }))
    },
    showMtdEdit(args) {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = args.dialogTitle
      this.mtd_id = args.mtd_id
      this.batchData = args.data
      this.reloadUri = args.uri ? args.uri : ''
      this.ids = args.ids ? args.ids.split(',') : []
    },
    isShow() {
      this.dialogVisible = !this.dialogVisible
    },
    openDialog(args) {
      this.dialogMtd = !this.dialogMtd
      this.mtdTitle = args.title
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