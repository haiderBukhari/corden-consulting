import Layout from "../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../components/auth/auth";
import PersonalPayrollComponent from "../../../components/common/payroll/PersonalPayrollComponent";
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import DataLoader from "../../../components/ui/dataLoader";

const PayrollOverview = () => {
  const router = useRouter();
  const { data: user, isLoading: isLoadingGetCurrentUser } = useGetActiveUser();

  return (
    <Layout title={'Payroll'} subtitle={'Overview'}>
      {isLoadingGetCurrentUser ? <DataLoader /> :  <PersonalPayrollComponent userId={user.id}/>}
    </Layout>
  )

}
export default withAuth(PayrollOverview, ['team_lead', 'staff', 'manager','HR']);
