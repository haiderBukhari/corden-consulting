import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth";
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import AdvanceSalaryDashboard from "../../../components/common/finances/advanceSalary/SalaryDashboard";
import { UseGetProfile } from "../../../hooks/query/getProfile";
import { getLoanConfigrationData } from "../../../hooks/query/finances/loan/getLoanConfigrationData";
import DataLoader from "../../../components/ui/dataLoader";

const PersonalAdvanceSalaryDashboard = () => {
  const { data: user, isLoading } = useGetActiveUser();
  const { data: userProfile, isLoading: isLoadingUserprofile } = UseGetProfile(user?.id);
  const { data: ConfigurationData, isLoading: isConfigLoading } = getLoanConfigrationData();

  const isApproverOne = ConfigurationData?.approvers?.some(
    (approver) => approver.id === user?.id && approver.approval_order === 1
  );

  return (
    <>
      <Layout title={"Advance Salary"} subtitle={"Overview"}>
        {isLoading || isLoadingUserprofile || isConfigLoading ? (
          <DataLoader />
        ) : (
          <AdvanceSalaryDashboard mode="personal" role={user.role} user={userProfile} isApproverOne={isApproverOne} />
        )}
      </Layout>

    </>
  );
};

export default withAuth(PersonalAdvanceSalaryDashboard, ["team_lead", "staff", "manager", "HR", "admin"]);
