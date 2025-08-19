import Layout from "../../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../../components/auth/auth"
import { useGetMemberDetail } from "../../../../hooks/query/team_lead/team/getMemberDetail";
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import TrainingDevelopmentDetailComponent from "../../../../components/common/training_development/TrainingDevelopmentComponent";

const MemberTrainingDevelopment = () => {
  const router = useRouter();
  const { data: user } = useGetActiveUser();
  const { id } = router.query;
  const { data: member } = useGetMemberDetail(id);

  return (
    <Layout title={'Team'} subtitle={`Member List > ${member?.name} > Training & Development`}>
      <TrainingDevelopmentDetailComponent role={user.role} id={id} />
    </Layout>
  )
}

export default withAuth(MemberTrainingDevelopment, ['team_lead', 'manager','HR']);