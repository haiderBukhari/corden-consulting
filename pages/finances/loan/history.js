import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import LoanHistory from "../../../components/common/finances/loan/LoanHistory";

const PersonalLoanHistory = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Loans'} subtitle={'History'}>
      <LoanHistory user={user} mode="personal" />
    </Layout>
  )
}
export default withAuth(PersonalLoanHistory, ['team_lead', 'staff', 'manager', 'HR', 'admin']);
