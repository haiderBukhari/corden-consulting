import Layout from '../../../../components/layout/layout';
import withAuth from "../../../../components/auth/auth";
import useGetActiveUser from '../../../../hooks/query/getUserFromLocalStorage';
import DataLoader from '../../../../components/ui/dataLoader';
import { getManagerEarlySalaryList } from '../../../../hooks/query/finances/salary/getManagerSalaryList';
import SalaryNewRequests from '../../../../components/common/finances/advanceSalary/approvals/AdvanceSalaryApprovalRequest';

function NewAdvanceSalaryRequests() {
  const { data: user, isLoading } = useGetActiveUser();
  const { data:ManagerSalaryList ,isLoading: isLoadingManagerSalaryList } = getManagerEarlySalaryList();
  
  return (
    <>
    {
      isLoading || isLoadingManagerSalaryList ?
        <DataLoader /> :
        <Layout title={'New Requests'} subtitle={'Overview'}>
          <SalaryNewRequests user={user} requests={ManagerSalaryList} />
        </Layout>
    }
  </>
  )
}

export default withAuth(NewAdvanceSalaryRequests, ['manager']);