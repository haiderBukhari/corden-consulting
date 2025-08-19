import Layout from "../../../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../../../components/auth/auth";
import MemberDetailsPayroll from "../../../../../components/common/payroll/MemberDetailsPayroll";
import { UseGetAdminPayrollConfigration } from "../../../../../hooks/query/admin/getAdminPayroll";
import useGetActiveUser from "../../../../../hooks/query/getUserFromLocalStorage";
import DataLoader from "../../../../../components/ui/dataLoader";

const MemberPayroll = () => {
  const { data: managerData, isLoading: isLoadingGetAdmins } = UseGetAdminPayrollConfigration();
  const { data: user, isLoading: isLoadingGetCurrentUser } = useGetActiveUser();

  const router = useRouter();
  const { id } = router.query;

  const currentManager = managerData?.find(manager => manager.id === user.id);

  return (
    <Layout title={'Payroll'} subtitle={`Payroll > Member Payroll > ${id}`}>
      {
        isLoadingGetAdmins || isLoadingGetCurrentUser ? <DataLoader /> : <MemberDetailsPayroll userId={id} currentManager={currentManager} />
      }
    </Layout>
  )

}
export default withAuth(MemberPayroll, ['manager']);
