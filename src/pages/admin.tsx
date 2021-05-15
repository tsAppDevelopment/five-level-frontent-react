//import {AdminAddNew} from '../components/admin_add_new'
import {v4} from 'uuid'
import {AdminModal} from '../components/admin_modal'
import {JsonTable} from '../components/json_table'
import {useAdminAir} from '../hooks/admin_store'
import {AdminNav} from '../nav/admin_nav'

export const Admin = () => {
  // if selected air is changed, re render all
  useAdminAir()

  return (
    <>
      <AdminNav key={v4()} />
      <JsonTable key={v4()} />
      <AdminModal key={v4()} />
    </>
  )
}
