import dayjs from 'dayjs'
import { type PaginationProps } from '@pureadmin/table'
import { reactive, ref, computed, onMounted } from 'vue'
import { get } from '@/utils/request'

export function useData() {
  const form = reactive({ name: '' })
  const dataList = ref([])
  const loading = ref(true)
  const pagination = reactive<PaginationProps>({ total: 0, pageSize: 10, currentPage: 1, background: true })
  const formDialogVisible = ref(false) // 表単显示或隐藏
  const INITIAL_DATA = { name: '' } // 表单初始值
  const formData = ref({ ...INITIAL_DATA })

  const columns: TableColumnList = [
    { type: 'selection', width: 40, minWidth: 40, align: 'left', hide: ({ checkList }) => !checkList.includes('勾选列') },
    { label: '序号', type: 'index', width: 50, hide: ({ checkList }) => !checkList.includes('序号列') },
    { label: '编号', prop: 'id', minWidth: 80, width: 80 },
    { label: '统计日期', prop: 'day', minWidth: 100, width: 100 },
    { label: '点击/访问数量', prop: 'value', minWidth: 150, width: 350 },
    { label: '名称', prop: 'name', minWidth: 180, width: 180 },
    { label: '备注', prop: 'remark', minWidth: 150 },
    { label: '添加时间', minWidth: 135, width: 135, prop: 'created', formatter: ({ created }) => dayjs(created / 1000).format('YYYY-MM-DD HH:mm:ss') },
    { label: '最后修改', minWidth: 135, width: 135, prop: 'updated', formatter: ({ created }) => dayjs(created / 1000).format('YYYY-MM-DD HH:mm:ss') },
    { label: '操作', fixed: 'right', width: 80, slot: 'operation' },
  ]
  const buttonClass = computed(() => {
    return ['!h-[20px]', 'reset-margin', '!text-gray-500', 'dark:!text-white', 'dark:hover:!text-primary']
  })

  function handleSizeChange(val: number) {
    fetchData()
  }

  function handleCurrentChange(val: number) {
    fetchData()
  }

  function handleSelectionChange(val) {
    console.log('handleSelectionChange', val)
  }

  async function fetchData() {
    let page = pagination.currentPage
    get('/v2/link_counts/' + page).then((response) => {
      dataList.value = response.data.rows
      pagination.total = response.data.total
      loading.value = false
    })
  }

  async function onSearch() {
    loading.value = true
    fetchData()
  }

  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    // onSearch()
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
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    formData,
    formDialogVisible,
  }
}
