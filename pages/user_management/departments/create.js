import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import CreateDepartmentComponent from "../../../components/admin/UserManagement/department/CreateDepartment";
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";

const CreateDepartment = () => {
  const { data: user } = useGetActiveUser()
  
  return (
    <Layout title={'Departments'} subtitle={'User Management > Departments'}>
      <CreateDepartmentComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(CreateDepartment, ['admin','HR','manager']);
