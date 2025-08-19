import Layout from "../../../../../components/layout/layout";
import withAuth from "../../../../../components/auth/auth";
import useGetActiveUser from "../../../../../hooks/query/getUserFromLocalStorage";
import LoanDetailPage from "../../../../../components/common/finances/loan/LoanDetailPage";
import { useRouter } from "next/router";
import { getLoanDetails } from "../../../../../hooks/query/finances/loan/getLoanDetails";
import DataLoader from "../../../../../components/ui/dataLoader";
import { UseGetProfile } from "../../../../../hooks/query/getProfile";
import { getLoanConfigrationData } from "../../../../../hooks/query/finances/loan/getLoanConfigrationData";

const LoanDetail = () => {
  const { data: user, isLoading } = useGetActiveUser();
  const { data: userProfile, isLoading: isLoadingUserprofile } = UseGetProfile(user?.id);
  const { data: ConfigurationData, isLoading: isConfigLoading } = getLoanConfigrationData();
  const router = useRouter();
  const { id } = router.query;
  const { data: loanDetails, isLoading: isLoadingLoanDetails } = getLoanDetails(id);

  if (!id || isLoading || isLoadingLoanDetails || isLoadingUserprofile || isConfigLoading) {
    return <DataLoader />;
  }

  return (
    <Layout title={"Loan Details"} subtitle={"Overview"}>
      <LoanDetailPage mode="workforce" role={user?.role} loanDetails={loanDetails} user={userProfile} ConfigurationData={ConfigurationData}/>
    </Layout>
  );
};

export default withAuth(LoanDetail, ['manager']);