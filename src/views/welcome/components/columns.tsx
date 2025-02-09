import TypeIt from '@/components/ReTypeit'
import OfficeBuilding from '@iconify-icons/ep/office-building'
import Tickets from '@iconify-icons/ep/tickets'
import Location from '@iconify-icons/ep/location'
import Iphone from '@iconify-icons/ep/iphone'
import Notebook from '@iconify-icons/ep/notebook'
import User from '@iconify-icons/ri/user-3-fill'

export function useColumns() {
  const lists = [
    { type: '', label: '善良' },
    { type: 'success', label: '好学' },
    { type: 'info', label: '幽默' },
    { type: 'danger', label: '旅游' },
    { type: 'warning', label: '追剧' },
  ]

  const columnsA = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={User} />
          </el-icon>
          用户名称
        </div>
      ),
      value: 'administrator',
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Iphone} />
          </el-icon>
          手机号码
        </div>
      ),
      value: '123456789',
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Location} />
          </el-icon>
          电子邮箱
        </div>
      ),
      value: 'abcdefg@gmail.com',
    },
  ]

  const columnsB = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Tickets} />
          </el-icon>
          标签
        </div>
      ),
      cellRenderer: () => {
        return lists.map((v) => {
          return (
            <el-tag class="mr-[10px]" type={v.type} size="small" effect="dark">
              {v.label}
            </el-tag>
          )
        })
      },
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={OfficeBuilding} />
          </el-icon>
          最后登录
        </div>
      ),
      value: '121.34.67.142 中国 连云港',
    },
  ]

  const columnsC = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Notebook} />
          </el-icon>
          备注
        </div>
      ),
      cellRenderer: () => <TypeIt className={'github'} values={['办法总比困难多']} cursor={false} speed={100} />,
    },
  ]

  return {
    columnsA,
    columnsB,
    columnsC,
  }
}
