import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import withAuth from "../../components/auth/auth";
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import ConfigurationsComponent from '../../components/admin/ConfigurationsComponent';

const Configurations = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Configurations'} subtitle={'Overview'}>
      <ConfigurationsComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(Configurations, ['admin']);
