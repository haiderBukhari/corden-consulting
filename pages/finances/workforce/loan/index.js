import Layout from "../../../../components/layout/layout"
import withAuth from "../../../../components/auth/auth"
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import LoanDashboard from "../../../../components/common/finances/loan/LoanDashboard";
import { UseGetProfile } from "../../../../hooks/query/getProfile";
import { getLoanConfigrationData } from "../../../../hooks/query/finances/loan/getLoanConfigrationData";
import DataLoader from "../../../../components/ui/dataLoader";

const WorkforceLoanDashboard = () => {
  const { data: user, isLoading } = useGetActiveUser();
  const { data: userProfile, isLoading: isLoadingUserprofile } = UseGetProfile(user?.id);
  const { data: ConfigurationData, isLoading: isConfigLoading } = getLoanConfigrationData();

  const isApproverOne = ConfigurationData?.approvers?.some(
    (approver) => approver.id === user?.id && approver.approval_order === 1
  );

  return (
    <>
      <Layout title={'Workforce Loan Dashboard'} subtitle={'Overview'}>
        {isLoading || isLoadingUserprofile || isConfigLoading ? (
          <DataLoader />
        ) : (
          <LoanDashboard mode="workforce" role={user.role} userId={user?.id} user={userProfile} isApproverOne={isApproverOne} />
        )}
      </Layout>

    </>
  )
}
export default withAuth(WorkforceLoanDashboard, ['manager']);