import Layout from "../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import TeamLeaveReport from "../../../components/common/TeamLeave/TeamLeaveReport";

const TeamReport = () => {
    const router = useRouter();
  
    const { data: user } = useGetActiveUser()

    return (
        <Layout title={'Leave Report'} subtitle={'Workforce > Leave Report'}>
            <TeamLeaveReport role={user.role} />
        </Layout>
    )

}

export default withAuth(TeamReport, ['team_lead', 'manager', 'HR']);