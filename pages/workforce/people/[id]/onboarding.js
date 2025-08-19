import Layout from "../../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../../components/auth/auth"
import { useGetMemberDetail } from "../../../../hooks/query/team_lead/team/getMemberDetail";
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import OnboardingComponent from "../../../../components/common/profile/OnboardingComponent";
const Onboarding = () => {
  const router = useRouter();
  const { data: user } = useGetActiveUser();
  const {  id } = router.query;
  const { data: member } = useGetMemberDetail(id)
  return (
    <Layout title={'Team'} subtitle={`Member List > ${member?.name} > Onboarding`}>
      <OnboardingComponent role={user.role} id={id} />
    </Layout>
  )

}
export default withAuth(Onboarding, ['team_lead', 'manager','HR']);
