
import DepartmentListComponent from "../../../components/admin/UserManagement/department/DepartmentList";

import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";


const DepartmentList = () => {
  const { data: user } = useGetActiveUser()
  return (
    <Layout title={'Departments'} subtitle={'User Management > Departments'}>
      <DepartmentListComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(DepartmentList, ['admin','HR','manager']);
