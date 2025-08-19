

import Layout from "../../../../../components/layout/layout"
import withAuth from "../../../../../components/auth/auth"
import useGetActiveUser from "../../../../../hooks/query/getUserFromLocalStorage";
import GratuityDetail from "../../../../../components/common/finances/gratuity/GratuityDetail";


const GratuityList = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Gratuity'} subtitle={'WorkForce >Finances > Gratuity > Detail'}>
      <GratuityDetail isUser={'false'} role={user.role} />
    </Layout>
  )
}

export default withAuth(GratuityList, ['manager']);
