

import Layout from "../../../../components/layout/layout"
import withAuth from "../../../../components/auth/auth"
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import GratuityListComponent from "../../../../components/common/finances/gratuity/GratuityList";


const GratuityList = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Gratuity'} subtitle={'Finances > Gratuity'}>
      <GratuityListComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(GratuityList, ['admin','HR','manager']);
