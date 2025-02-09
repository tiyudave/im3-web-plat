<script setup lang="ts">
import dayjs from 'dayjs'
import axios from 'axios'
import MdEditor from 'md-editor-v3'
import Bar from './components/Bar.vue'
import Pie from './components/Pie.vue'
import Line from './components/Line.vue'
import TypeIt from '@/components/ReTypeit'
import { ref, computed, markRaw } from 'vue'
import Github from './components/Github.vue'
import { randomColor } from '@pureadmin/utils'
import { useRenderFlicker } from '@/components/ReFlicker'

defineOptions({
  name: 'Welcome',
})

const list = ref()
const loading = ref<boolean>(true)
const titleClass = computed(() => {
  return ['text-base', 'font-medium']
})

setTimeout(() => {
  loading.value = !loading.value
}, 800)

axios.get('https://api.github.com/repos/pure-admin/vue-pure-admin/releases').then((res) => {
  list.value = res.data.map((v) => {
    return {
      content: v.body,
      timestamp: dayjs(v.published_at).format('YYYY/MM/DD hh:mm:ss A'),
      icon: markRaw(
        useRenderFlicker({
          background: randomColor({ type: 'hex' }) as string,
        })
      ),
    }
  })
})
</script>

<template>
  <div>
    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="mb-[18px]"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200,
          },
        }"
      >
        <el-card shadow="never" style="height: 347px">
          <template #header>
            <a :class="titleClass" href="https://github.com/pure-admin/vue-pure-admin/releases" target="_black">
              <TypeIt :className="'type-it2'" :values="['版本日志']" :cursor="false" :speed="80" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <el-scrollbar height="324px">
                <el-timeline v-show="list?.length > 0">
                  <el-timeline-item v-for="(item, index) in list" :key="index" :icon="item.icon" :timestamp="item.timestamp">
                    <md-editor v-model="item.content" preview-only />
                  </el-timeline-item>
                </el-timeline>
                <el-empty v-show="list?.length === 0" />
              </el-scrollbar>
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 200,
          },
        }"
      >
        <el-card shadow="never" style="height: 347px">
          <template #header>
            <a :class="titleClass" href="https://github.com/xiaoxian521" target="_black">
              <TypeIt :className="'type-it1'" :values="['登录信息']" :cursor="false" :speed="120" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Github />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400,
          },
        }"
      >
        <el-card shadow="never">
          <template #header>
            <a :class="titleClass" href="https://github.com/pure-admin/vue-pure-admin" target="_black">
              <TypeIt :className="'type-it4'" :values="['访问统计']" :cursor="false" :speed="120" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Line />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400,
          },
        }"
      >
        <el-card shadow="never">
          <template #header>
            <a :class="titleClass" href="https://github.com/pure-admin/vue-pure-admin" target="_black">
              <TypeIt :className="'type-it3'" :values="['平台统计']" :cursor="false" :speed="120" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Pie />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>

      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="8"
        :xl="8"
        class="mb-[18px]"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 400,
          },
        }"
      >
        <el-card shadow="never">
          <template #header>
            <a :class="titleClass" href="https://github.com/pure-admin/vue-pure-admin" target="_black">
              <TypeIt :className="'type-it5'" :values="['财务统计']" :cursor="false" :speed="120" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Bar />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 20px 20px 0 20px !important;
}
</style>
