import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import SalaryHistory from "../../../components/common/finances/advanceSalary/HistorySalaryTable";

const PersonalAdvanceSalaryHistory = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Advance Salary'} subtitle={'History'}>
      <SalaryHistory user={user} mode="personal" />
    </Layout>
  )
}

export default withAuth(PersonalAdvanceSalaryHistory, ['team_lead', 'staff', 'manager', 'HR', 'admin']);