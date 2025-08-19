import Layout from "../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import TeamLeaveCalendar from "../../../components/common/TeamLeave/TeamLeaveCalendar";

const Dashboard = () => {
    const router = useRouter();
    const { role } = router.query;

    const { data: user } = useGetActiveUser()

    return (
        <Layout title={'Leave Calendar'} subtitle={'Workforce > Leave Calendar'}>
            <TeamLeaveCalendar role={user.role} />
        </Layout>
    )

}

export default withAuth(Dashboard, ['team_lead', 'manager', 'HR']);