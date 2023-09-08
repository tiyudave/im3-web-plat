<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from '@/utils/message'
import { FormInstance } from 'element-plus'

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
const platforms = ref([])
const emit = defineEmits(['update:visible', 'update:submit'])

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (!valid) {
      message('提交数据格式有误', { type: 'error' })
      return false
    }
    let data: { name: string; status: number; remark: string; platform_id: number; code: string } = {
      platform_id: parseInt(formData.value.platform_id),
      name: formData.value.name,
      code: formData.value.code,
      status: parseInt(formData.value.status),
      remark: formData.value.remark,
    }
    console.log(data)
    // if (!formData.value.id || formData.value.id == 0) {
    //   WsModule.Ws.send('/sites/create', data, function (result: ResponseResult) {
    //     console.log(result)
    //   })
    // } else if (formData.value.id && formData.value.id > 0) {
    //   let realData = { id: formData.value.id, ...data }
    //   console.log(realData)
    //   WsModule.Ws.send('/sites/update', realData, function (result: ResponseResult) {
    //     console.log(result)
    //   })
    // }
    emit('update:submit', true)
    message('提交成功', { type: 'success' })
    formVisible.value = false
    resetForm(formEl)
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

watch(
  () => formVisible.value,
  (val) => {
    emit('update:visible', val)
  }
)

watch(
  () => props.visible,
  (val) => {
    if (val && platforms.value.length == 0) {
      // WsModule.Ws.send('/platforms/all', {}, (result) => {
      //   console.log([platforms.value, result.rows])
      //   for (let i = 0; i < result.rows.length; i++) {
      //     let current = result.rows[i]
      //     platforms.value.push({ id: current.id, name: current.name })
      //   }
      // })
    }
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
  name: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入站点代码', trigger: 'blur' }],
  platform_id: [{ required: true, message: '请选择平台', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}
</script>

<template>
  <el-dialog v-model="formVisible" title="新建站点" :width="680" draggable :before-close="closeDialog">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="站点名称" prop="name">
        <el-select v-model="formData.platform_id" placeholder="请选择平台">
          <el-option v-for="item in platforms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="站点名称" prop="name">
        <el-input v-model="formData.name" :style="{ width: '480px' }" placeholder="请输站点名称" />
      </el-form-item>
      <el-form-item label="站点编码" prop="code">
        <el-input v-model="formData.code" :style="{ width: '480px' }" placeholder="请输站点名称" />
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
