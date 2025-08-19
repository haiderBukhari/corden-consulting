import Layout from '../../../components/layout/layout';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import CreateAdvanceSalary from '../../../components/common/finances/advanceSalary/CreateAdvanceSalary';
import DataLoader from '../../../components/ui/dataLoader';

function CreatePersonalAdvanceSalaryRequest() {
  const { data: user, isLoading } = useGetActiveUser();

  return (
    <>
      <Layout title={'Create New Advance Salary Request'} subtitle={'Overview'}>
        {
          isLoading ?
            <DataLoader /> :
            <CreateAdvanceSalary user={user} mode="personal" />
        }
      </Layout>
    </>
  )
}

export default withAuth(CreatePersonalAdvanceSalaryRequest, ['team_lead', 'staff', 'manager', 'HR', 'admin']);