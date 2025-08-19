import Layout from "../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../components/auth/auth"
import TeamLeaveCalendar from "../../../components/common/TeamLeave/TeamLeaveCalendar";

const Dashboard = () => {
    const router = useRouter();
    const { role } = router.query;

    return (
        <Layout title={'Team'} subtitle={'Team > Leave Calendar'}>
            <TeamLeaveCalendar role={role} />
        </Layout>
    )

}

export default withAuth(Dashboard, ['team_lead', 'manager']);