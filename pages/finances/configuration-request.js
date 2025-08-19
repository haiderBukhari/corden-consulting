import Layout from "../../components/layout/layout"
import withAuth from "../../components/auth/auth"
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import DefaultConfigrationRequest from "../../components/common/finances/configrations/approval/DefaultConfigrationRequest";

const Configrations = () => {
  const { data: user } = useGetActiveUser();
 
  return (
    <Layout title={'Default Configrations Request'} subtitle={'Overview'}>
      <DefaultConfigrationRequest role={user.role}  />
    </Layout>
  )
}
export default withAuth(Configrations, [ 'manager']);
