import Layout from '../../../../components/layout/layout';
import withAuth from '../../../../components/auth/auth';
import useGetActiveUser from '../../../../hooks/query/getUserFromLocalStorage';
import NewRequests from '../../../../components/common/finances/loan/NewRequests';
import DataLoader from '../../../../components/ui/dataLoader';
import { getAllManagerLoansList } from '../../../../hooks/query/finances/loan/getManagerLoanList';

function NewLoanRequests() {
  const { data: user, isLoading } = useGetActiveUser();
  const { data: managerLoanList, isLoading: isLoadingManagerLoanList } = getAllManagerLoansList();
  
  return (
    <>
      {
        isLoading || isLoadingManagerLoanList ?
          <DataLoader /> :
          <Layout title={'New Requests'} subtitle={'Overview'}>
            <NewRequests user={user} requests={managerLoanList} />
          </Layout>
      }
    </>
  )
}

export default withAuth(NewLoanRequests, ['manager']);