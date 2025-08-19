import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import TeamDashboard from "../../../components/Team/dashboard";
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
const Dashboard = () => {
    const { data: user } = useGetActiveUser()
  
    return (
        <Layout title={'Dashboard'} subtitle={'Team > Dashboard'}>
            <TeamDashboard role={user.role}/>
        </Layout>
    )
  
}

export default withAuth(Dashboard, ['team_lead', 'manager']);