import Layout from '../../../../components/layout/layout';
import withAuth from '../../../../components/auth/auth';
import useGetActiveUser from '../../../../hooks/query/getUserFromLocalStorage';
import CreateAdvanceSalary from '../../../../components/common/finances/advanceSalary/CreateAdvanceSalary';
import DataLoader from '../../../../components/ui/dataLoader';

function CreateWorkforceAdvanceSalaryRequest () {
  const { data: user, isLoading } = useGetActiveUser();

  return (
    <>
      <Layout title={'Create New Advance Salary Request'} subtitle={'Overview'}>
        {
          isLoading ?
            <DataLoader /> :
            <CreateAdvanceSalary user={user} mode="workforce" />
        }
      </Layout>
    </>
  )
}

export default withAuth(CreateWorkforceAdvanceSalaryRequest , ['manager']);