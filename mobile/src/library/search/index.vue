<template>
  <div class="search">
    <van-sticky>
      <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft">
        <template #title>
          <van-search v-model="text" shape="round" @search="schfilter" />
        </template>
        <template #right>
          <span @click="schfilter">搜索</span>
        </template>
      </van-nav-bar>
    </van-sticky>
    <section v-if="isLoad">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <template v-if="api_name=='ticket_backlog'">
          <van-swipe-cell v-for="(item, index) in items" :key="index">
            <van-cell class="title-elli" :to="{name: 'ticket-deal', query: { ticket_id: item.ticket_id, task_id: item.task_id }}">
              <template #title>
                <div class="title">
                  {{ item.title }}
                </div>
              </template>
              <template #label>
                <div class="tips">
                  <van-tag type="warning">
                    {{ item.node_name }}
                  </van-tag>
                  <span>{{ item.last_name }}</span><span class="border-left">{{ item.last_time | formatData }}</span>
                </div>
              </template>
            </van-cell>
            <template #right>
              <van-button square type="info" text="查看" @click="taskView(item)" />
            </template>
          </van-swipe-cell>
        </template>
        <template v-else>
          <van-cell v-for="(item, index) in items" :key="index" class="title-elli" :to="{ name: 'ticket-view', query: { ticket_id: item.ticket_id } }">
            <template #title>
              <div class="title">
                {{ item.title }}
              </div>
            </template>
            <template #label>
              <div class="tips">
                <span>{{ item.last_name }}</span><span class="border-left">{{ item.last_time | formatData }}</span>
              </div>
            </template>
          </van-cell>
        </template>
      </van-list>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: null,
      items: [],
      pagination: {
        total: 10,
        page: 1
      },
      page_size: 10,
      api_name: null,
      loading: false,
      finished: false,
      isLoad: false
    }
  },
  created() {
    this.api_name = this.$route.params.api ? this.$route.params.api : 'initiated_ticket'
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    schfilter() {
      this.isLoad = true
    },
    onLoad() {
      setTimeout(() => {
        this.$Apis.ticket[this.api_name](this.text, this.pagination.page, this.page_size).then(response => {
          if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
            this.items = response.payload.items
            this.pagination = response.payload.pagination
            this.pages = this.pagination.pages
            for (let i = 1; i < this.pages; i++) {
              this.pagination.page++
              this.$Apis.ticket[this.api_name](this.text, this.pagination.page, this.page_size).then(response => {
                if (response.code === this.$Utils.Constlib.ERROR_CODE_OK) {
                  this.items = [...this.items, ...response.payload.items]
                }
              })
            }
            this.loading = false

            if (this.pagination.page === this.pages) {
              this.finished = true
            }
          } else {
            this.$dialog.alert({
              message: response.message
            })
          }
        })
      }, 1000)
    }
  }
}
</script>
