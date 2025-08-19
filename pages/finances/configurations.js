import Layout from "../../components/layout/layout"
import withAuth from "../../components/auth/auth"
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import DefaultConfigurations from "../../components/common/finances/configrations/DefaultConfigrations";

const Configrations = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Default Configurations'} subtitle={'Overview'}>
      <DefaultConfigurations role={user.role}  />
    </Layout>
  )
}
export default withAuth(Configrations, [ 'manager']);
