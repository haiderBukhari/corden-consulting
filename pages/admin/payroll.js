import Layout from "../../components/layout/layout";
import withAuth from "../../components/auth/auth"
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import AdminPayrollComponent from "../../components/admin/AdminPayroll";

const  AdminPayroll= () =>{
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Payroll'} subtitle={'Overview'}>
      <AdminPayrollComponent role={user.role}/>
    </Layout>
  )
}

export default withAuth(AdminPayroll, ['admin']);
