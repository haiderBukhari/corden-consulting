import Layout from "../../../../components/layout/layout";
import withAuth from "../../../../components/auth/auth";
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import CreateLoan from "../../../../components/common/finances/loan/CreateLoan";
import DataLoader from "../../../../components/ui/dataLoader";
import { UseGetProfile } from "../../../../hooks/query/getProfile";
import { useRouter } from "next/router";

function CreateLoanRequest() {
  const router = useRouter();
  const { data: user, isLoading } = useGetActiveUser();
  const { data: userProfile, isLoading: isLoadingUserprofile } = UseGetProfile(user?.id);

  return (
    <>
      <Layout title={"Create New Loan Request"} subtitle={"Overview"}>
        {isLoading || isLoadingUserprofile ? (
          <DataLoader />
        ) : (
          <CreateLoan user={userProfile} mode="workforce" />
        )}
      </Layout>
    </>
  );
}

export default withAuth(CreateLoanRequest, ['manager']);