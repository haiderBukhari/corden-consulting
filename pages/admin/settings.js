import Layout from "../../components/layout/layout";
import withAuth from "../../components/auth/auth"
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import SettingForm from "../../components/admin/UserManagement/locations/SettingForm";

const  Setting= () =>{
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Setting'} subtitle={'Overview'}>
      <SettingForm role={user.role}/>
    </Layout>
  )
}

export default withAuth(Setting, ['admin']);
