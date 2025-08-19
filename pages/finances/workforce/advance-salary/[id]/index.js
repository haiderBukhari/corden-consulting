import Layout from "../../../../../components/layout/layout"
import DataLoader from "../../../../../components/ui/dataLoader";
import withAuth from "../../../../../components/auth/auth";
import useGetActiveUser from "../../../../../hooks/query/getUserFromLocalStorage";
import { getEarlySalaryDetail } from "../../../../../hooks/query/finances/salary/getEarlySalaryDetail";
import SalaryDetailPage from "../../../../../components/common/finances/advanceSalary/SalaryDetailPage";
import { useRouter } from "next/router";

const WorkforceSalaryDetail  = () => {
  const { data: user } = useGetActiveUser();
  const router = useRouter();
  const { id } = router.query;

  const { data: SalaryDetail, isLoading: isLoadingSalary } = getEarlySalaryDetail(id);

  if (!id || isLoadingSalary) {
    return <DataLoader />;
  }

  return (
    <Layout title={'Salary Details'} subtitle={'Overview'}>
      <SalaryDetailPage role={user?.role} SalaryDetail={SalaryDetail} mode="workforce" />
    </Layout>
  )
}

export default withAuth(WorkforceSalaryDetail , ['manager']);
