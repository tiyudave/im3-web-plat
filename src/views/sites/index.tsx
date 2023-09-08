import dayjs from 'dayjs'
import { get } from '@/utils/request'
import { message } from '@/utils/message'
import { ElMessageBox } from 'element-plus'
import { type PaginationProps } from '@pureadmin/table'
import { reactive, ref, computed, onMounted } from 'vue'

export function useData() {
  const URL_PREFIX = '/plat/v1/sites'
  const form = reactive({ name: '', code: '', status: '' })
  const dataList = ref([])
  const loading = ref(true)
  const switchLoadMap = ref({})
  const pagination = reactive<PaginationProps>({ total: 0, pageSize: 15, currentPage: 1, background: true })
  const columns: TableColumnList = [
    { type: 'selection', width: 40, align: 'left', hide: ({ checkList }) => !checkList.includes('勾选列') },
    { label: '序号', type: 'index', width: 50, minWidth: 50, hide: ({ checkList }) => !checkList.includes('序号列') },
    { label: '编号', prop: 'id', width: 80, minWidth: 80 },
    { label: '平台编号', prop: 'platform_id', width: 100, minWidth: 100 },
    { label: '平台名称', prop: 'platform_name', width: 80, minWidth: 100 },
    { label: '名称', prop: 'name', minWidth: 110, width: 110 },
    { label: '代码', prop: 'code', minWidth: 140, width: 140 },
    { label: '备注', prop: 'remark' },
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
    { label: '创建时间', minWidth: 135, width: 135, prop: 'created', formatter: ({ created }) => dayjs(created / 1000).format('YYYY-MM-DD HH:mm:ss') },
    { label: '最后修改', minWidth: 135, width: 135, prop: 'updated', formatter: ({ updated }) => dayjs(updated / 1000).format('YYYY-MM-DD HH:mm:ss') },
  ]
  const formDialogVisible = ref(false) // 表単显示或隐藏
  const INITIAL_DATA = { platform_id: '', name: '', status: '1', code: '', remark: '' } // 表单初始值
  const formData = ref({ ...INITIAL_DATA })
  const buttonClass = computed(() => {
    return ['!h-[20px]', 'reset-margin', '!text-gray-500', 'dark:!text-white', 'dark:hover:!text-primary']
  })
  // 状态改变
  function onStatusChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${row.status === 0 ? '停用' : '启用'}</strong>
      <strong style='color:var(--el-color-primary)'>${row.name}</strong> 站点吗?`,
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
  function fetchData() {
    loading.value = true
    get(URL_PREFIX + '/list/' + pagination.currentPage).then((response) => {
      dataList.value = response.data.rows
      pagination.total = response.data.total
      loading.value = false
    })
  }

  // 添加
  function handleCreate() {
    formDialogVisible.value = true
    formData.value = INITIAL_DATA
  }

  // 修改
  function handleUpdate(row) {
    formDialogVisible.value = true
    formData.value = {
      ...row,
      status: row.status.toString(),
    }
  }

  // 删除
  function handleDelete(row) {}

  // 大小
  function handleSizeChange(val: number) {
    fetchData()
  }

  // 当前页
  function handleCurrentChange(val: number) {
    fetchData()
  }

  // 调中
  function handleSelectionChange(val) {
    fetchData()
  }

  // 搜索
  async function onSearch() {
    fetchData()
  }

  // 重置
  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
  }

  // 加载
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
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleCreate,
    formDialogVisible,
    formData,
    handleSelectionChange,
    onMounted,
  }
}
