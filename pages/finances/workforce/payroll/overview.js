import Layout from "../../../../components/layout/layout";
import withAuth from "../../../../components/auth/auth";
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import Payroll from "../../../../components/common/WorkForce/payroll/Payroll";
import { UseGetPayrollConfigurationData } from "../../../../hooks/query/finances/payroll/getPayrollConfigration";
import DataLoader from "../../../../components/ui/dataLoader";

const PayrollOverview = () => {
  const { data: user } = useGetActiveUser();
  const { data: ConfigurationData, isLoading: isConfigLoading } = UseGetPayrollConfigurationData();

  if (isConfigLoading) {
    return <DataLoader />;
  }

  return (
    <Layout title={'Payroll'} subtitle={'Workforce > Payroll'}>
      <Payroll currentUser={user} ConfigurationData={ConfigurationData} />
    </Layout>
  )
}

export default withAuth(PayrollOverview, ['manager']);
