<script setup lang="ts">
import { ref } from 'vue'
import { useData } from './index'
import { PureTableBar } from '@/components/RePureTableBar'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import Search from '@iconify-icons/ep/search'
import Refresh from '@iconify-icons/ep/refresh'
import editForm from './EditForm.vue' // 编辑

defineOptions({ name: 'Data' })
const formRef = ref()
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleUpdate,
  formDialogVisible,
  formData,
  onMounted,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
} = useData()
</script>

<template>
  <div class="main">
    <el-form ref="formRef" :inline="true" :model="form" class="bg-bg_color w-[99/100] pl-8 pt-4">
      <el-form-item label="站点名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入站点名称" clearable class="!w-[200px]" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="useRenderIcon(Search)" :loading="loading" @click="onSearch"> 搜索 </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar title="站点列表" @refresh="onSearch">
      <!--<template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="formDialogVisible = true"> 新增奖期 </el-button>
      </template>-->
      <template v-slot="{ size, checkList }">
        <pure-table
          border
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="'small'"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="true"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)',
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
        </pure-table>
      </template>
    </PureTableBar>
    <editForm v-model:visible="formDialogVisible" :data="formData" @update:submit="onSearch" />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
