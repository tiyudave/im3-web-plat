<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from '@/utils/message'
import { FormInstance } from 'element-plus'

// 定义组件的props属性
const props = defineProps({
  visible: { type: Boolean, default: false },
  data: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

const ruleFormRef = ref<FormInstance>()
const formVisible = ref(false)
const formData = ref(props.data)
const emit = defineEmits(['update:visible', 'update:submit'])

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (!valid) {
      message('提交数据格式有误', { type: 'error' })
      return false
    }
    // let data: { name: string; status: number; remark: string } = {
    //   name: formData.value.name,
    //   status: parseInt(formData.value.status),
    //   remark: formData.value.remark,
    // }
    // if (!formData.value.id || formData.value.id == 0) {
    //   WsModule.Ws.send('/platforms/create', data, function (result: ResponseResult) {
    //     console.log(result)
    //   })
    // } else if (formData.value.id && formData.value.id > 0) {
    //   let realData = { id: formData.value.id, ...data }
    //   console.log(realData)
    //   WsModule.Ws.send('/platforms/update', realData, function (result: ResponseResult) {
    //     console.log(result)
    //   })
    // }
    emit('update:submit')
    message('提交成功', { type: 'success' })
    formVisible.value = false
    resetForm(formEl)
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 关闭弹窗
const closeDialog = () => {
  formVisible.value = false
  resetForm(ruleFormRef.value)
}

// 定义组件的emit事件
// 用于监管本组件的formVisible属性变化
watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val)
  }
)

// 用于监管父组件的visible属性变化
watch(
  () => props.visible,
  (val) => {
    formVisible.value = val
  }
)

// 用于监管父组件的data属性变化
watch(
  () => props.data,
  (val) => {
    formData.value = val
  }
)

// 规则
const rules = {
  name: [{ required: true, message: '请输入彩种名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}
</script>

<template>
  <el-dialog v-model="formVisible" title="新增彩种" :width="680" draggable :before-close="closeDialog">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="彩种名称" prop="name">
        <el-input v-model="formData.name" :style="{ width: '480px' }" placeholder="请输入彩种名称" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="0">已停用</el-radio>
          <el-radio label="1">已启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" :style="{ width: '480px' }" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
    </template>
  </el-dialog>
</template>
