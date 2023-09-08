import dayjs from 'dayjs'
import { message } from '@/utils/message'
import { ElMessageBox } from 'element-plus'
import { type PaginationProps } from '@pureadmin/table'
import { reactive, ref, computed, onMounted } from 'vue'
import { get } from '@/utils/request'

export function useData() {
  const URL_PREFIX = '/plat/v1/configs'
  const form = reactive({ name: '', code: '', status: '' })
  const dataList = ref([])
  const loading = ref(true)
  const switchLoadMap = ref({})
  const pagination = reactive<PaginationProps>({ total: 0, pageSize: 10, currentPage: 1, background: true })
  const formDialogVisible = ref(false) // 表単显示或隐藏
  const INITIAL_DATA = { name: '', value: '', value_default: '', remark: '请输入备注' } // 表单初始值
  const formData = ref({ ...INITIAL_DATA })
  const columns: TableColumnList = [
    { type: 'selection', width: 40, minWidth: 40, align: 'left', hide: ({ checkList }) => !checkList.includes('勾选列') },
    { label: '序号', type: 'index', width: 50, hide: ({ checkList }) => !checkList.includes('序号列') },
    { label: '编号', prop: 'id', minWidth: 80, width: 80 },
    { label: '平台编号', prop: 'platform_id', minWidth: 80, width: 80 },
    { label: '平台名称', prop: 'platform_name', minWidth: 100, width: 120 },
    { label: '站点编号', prop: 'site_id', minWidth: 80, width: 80 },
    { label: '站点名称', prop: 'site_name', minWidth: 100, width: 120 },
    { label: '配置名称', prop: 'name', minWidth: 120, width: 120 },
    { label: '配置内容', prop: 'value', minWidth: 150 },
    { label: '默认内容', prop: 'value_default', minWidth: 150 },
    { label: '备注', prop: 'remark', minWidth: 150 },
    {
      label: '状态',
      minWidth: 80,
      width: 80,
      prop: 'status',
      cellRenderer: (scope) => (
        <el-switch
          size={scope.props.size === 'small' ? 'small' : 'default'}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已开启"
          inactive-text="已关闭"
          inline-prompt
          onChange={() => onStatusChange(scope as any)}
        />
      ),
    },
    { label: '添加时间', minWidth: 135, width: 135, prop: 'created', formatter: ({ created }) => dayjs(created / 1000).format('YYYY-MM-DD HH:mm:ss') },
    { label: '最后修改', minWidth: 135, width: 135, prop: 'updated', formatter: ({ created }) => dayjs(created / 1000).format('YYYY-MM-DD HH:mm:ss') },
    { label: '操作', fixed: 'right', width: 80, slot: 'operation' },
  ]
  const buttonClass = computed(() => {
    return ['!h-[20px]', 'reset-margin', '!text-gray-500', 'dark:!text-white', 'dark:hover:!text-primary']
  })
  // 切换状态
  function onStatusChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要 <strong>${row.status === 0 ? '停用' : '启用'}</strong>
      <strong style='color:var(--el-color-primary)'>${row.name}</strong> 状态么?`,
      '系统提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', dangerouslyUseHTMLString: true, draggable: true }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], { loading: true })
        switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], { loading: false })
        message('状态修改成功', { type: 'success' })
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0)
      })
  }
  // 获取数据
  async function fetchData() {
    loading.value = true
    get(URL_PREFIX + '/list/' + pagination.currentPage).then((response) => {
      dataList.value = response.data.rows
      pagination.total = response.data.total
      loading.value = false
    })
  }

  // 创建
  function handleCreate() {
    formDialogVisible.value = true
    formData.value = INITIAL_DATA
  }

  // 修改
  function handleUpdate(row) {
    formDialogVisible.value = true
    formData.value = { ...row }
  }

  // 大小改变
  function handleSizeChange(val: number) {
    fetchData()
  }

  // 页码改变
  function handleCurrentChange(val: number) {
    fetchData()
  }

  // 选择改变
  function handleSelectionChange(val) {
    fetchData()
  }

  // 搜索
  async function onSearch() {
    fetchData()
  }

  // 重置表单
  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
  }

  onMounted(() => {
    onSearch()
  })

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    handleUpdate,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    formData,
    formDialogVisible,
    handleCreate,
  }
}
