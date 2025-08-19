import Layout from "../../components/layout/layout";
import withAuth from "../../components/auth/auth"
import AdminDashboardComponent from "../../components/admin/AdminDashboard";
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";

const  AdminDashboard= () =>{
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Dashboard'} subtitle={'Overview'}>
      <AdminDashboardComponent role={user.role}/>
    </Layout>
  )
}

export default withAuth(AdminDashboard, ['admin']);
