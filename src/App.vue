<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'

export default defineComponent({
  name: 'app',
  data() {
    return {}
  },
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === 'zh' ? zhCn : en
    },
  },
})
</script>

<style>
/* .el-table--enable-row-transition .el-table__body td.el-table__cell {
  padding: 0px;
}
.el-table--default .cell {
  padding: 0px;
}
.el-table .cell.el-tooltip {
  padding: 0px;
} */
</style>
