import Layout from "../../../../components/layout/layout"
import withAuth from "../../../../components/auth/auth"
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import LoanHistory from "../../../../components/common/finances/loan/LoanHistory";

const WorkforceLoanHistory = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Loans'} subtitle={'History'}>
      <LoanHistory user={user} mode="workforce" />
    </Layout>
  )
}
export default withAuth(WorkforceLoanHistory, ['manager']);
