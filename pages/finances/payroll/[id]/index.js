

import Layout from "../../../../components/layout/layout"
import withAuth from "../../../../components/auth/auth"
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import GratuityDetail from "../../../../components/common/finances/gratuity/GratuityDetail";


const GratuityList = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Gratuity'} subtitle={'Finances > Gratuity > Detail'}>
      <GratuityDetail isUser={'true'} role={user.role} />
    </Layout>
  )
}

export default withAuth(GratuityList, ['staff','team_lead','admin','HR','manager']);
