<script setup lang="ts">
import { ref } from 'vue'
import { useData } from './index'
import { PureTableBar } from '@/components/RePureTableBar'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import EditPen from '@iconify-icons/ep/edit-pen'
import AddFill from '@iconify-icons/ri/add-circle-line'
import editForm from './EditForm.vue'
import Search from '@iconify-icons/ep/search'
import Refresh from '@iconify-icons/ep/refresh'

defineOptions({ name: 'Data' })

const formRef = ref()
const {
  form,
  columns,
  loading,
  dataList,
  pagination,
  onSearch,
  formData,
  formDialogVisible,
  resetForm,
  handleUpdate,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
} = useData()
</script>

<template>
  <div class="main">
    <el-form ref="formRef" :inline="true" :model="form" class="bg-bg_color w-[99/100] pl-8 pt-4">
      <el-form-item label="平台名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入平台名称" clearable class="!w-[200px]" />
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select v-model="form.status" placeholder="请平台状态" clearable class="!w-[180px]">
          <el-option label="已开启" value="1" />
          <el-option label="已关闭" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="useRenderIcon(Search)" :loading="loading" @click="onSearch"> 搜索 </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <PureTableBar title="平台列表" @refresh="onSearch">
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="formDialogVisible = true"> 新增平台 </el-button>
      </template>
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
          <template #operation="{ row }">
            <el-button class="reset-margin" link type="primary" :size="'small'" :icon="useRenderIcon(EditPen)" @click="handleUpdate(row)"> 修改 </el-button>
          </template>
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
