import Layout from '../../../components/layout/layout';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import CreateTeamComponent from '../../../components/admin/Teams/CreateTeam';

const CreateTeam = () => {
    const { data: user } = useGetActiveUser()

    return (
        <Layout title={'Create Team'} subtitle={'Teams > Create Team'}>
            <CreateTeamComponent role={user.role} isEditUser={true} user={user}/>
        </Layout>
    )
}

export default withAuth(CreateTeam, ['admin','HR','manager']);
