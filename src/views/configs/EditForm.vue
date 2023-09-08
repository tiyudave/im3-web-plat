<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from '@/utils/message'
import { FormInstance } from 'element-plus'
import { post } from '@/utils/request'

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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (!valid) {
      message('提交数据格式有误', { type: 'error' })
      return false
    }
    let data: { name: string; value: string; value_default: string; remark: string } = {
      name: formData.value.name,
      value: formData.value.value,
      value_default: formData.value.value_default,
      remark: formData.value.remark,
    }
    if (!formData.value.id || formData.value.id == 0) {
      post('/v2/configs/create', data).then(function (result) {
        message('提交添加成功', { type: 'success' })
        formVisible.value = false
        resetForm(formEl)
        console.log(result)
      })
    } else if (formData.value.id && formData.value.id > 0) {
      let realData = { id: formData.value.id, ...data }
      post('/v2/configs/update', realData).then(function (result) {
        message('提交修改成功', { type: 'success' })
        formVisible.value = false
        resetForm(formEl)
        console.log(result)
      })
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const closeDialog = () => {
  formVisible.value = false
  resetForm(ruleFormRef.value)
}

const emit = defineEmits(['update:visible'])
watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val)
  }
)
watch(
  () => props.visible,
  (val) => {
    formVisible.value = val
  }
)
watch(
  () => props.data,
  (val) => {
    formData.value = val
  }
)

const rules = {
  name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  value: [{ required: true, message: '请输入配置内容', trigger: 'blur' }],
  value_default: [{ required: true, message: '请输入默认配置内容', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}
</script>

<template>
  <el-dialog v-model="formVisible" title="增加配置" :width="680" draggable :before-close="closeDialog">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="formData.name" :style="{ width: '480px' }" placeholder="请输入配置名称" />
      </el-form-item>
      <el-form-item label="配置内容" prop="value">
        <el-input v-model="formData.value" :style="{ width: '480px' }" placeholder="请输入配置内容" />
      </el-form-item>
      <el-form-item label="默认内容" prop="value_default">
        <el-input v-model="formData.value_default" :style="{ width: '480px' }" placeholder="请输入默认配置内容" />
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
