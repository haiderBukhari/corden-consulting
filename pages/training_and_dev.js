import Layout from "../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../components/auth/auth"
import { useGetMemberDetail } from "../hooks/query/team_lead/team/getMemberDetail";
import useGetActiveUser from "../hooks/query/getUserFromLocalStorage";

const TrainingDevelopment = () => {
  const router = useRouter();
  const { data: user } = useGetActiveUser();


  return (
    <Layout title={'Team'} subtitle={` Training & Development`}>
     <div className="min-h-screen flex justify-center items-center bg-gray-100">
     Coming soon...
     </div>
    </Layout>
  )
}

export default withAuth(TrainingDevelopment, ['team_lead', 'manager','staff','HR']);