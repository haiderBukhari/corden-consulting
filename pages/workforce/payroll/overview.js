import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import Payroll from "../../../components/common/WorkForce/payroll/Payroll";

const PayrollOverview = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Payroll'} subtitle={'Workforce > Payroll'}>
      <Payroll currentUser={user} />
    </Layout>
  )
}

export default withAuth(PayrollOverview, ['manager']);
