import Layout from '../../../components/layout/layout';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import TeamListComponent from '../../../components/admin/Teams/TeamList';

const TeamList = () => {
    const { data: user } = useGetActiveUser()

    return (
        <Layout title={'Team'} subtitle={'Teams > Overview'}>
            <TeamListComponent role={user.role} isEditUser={true} user={user}/>
        </Layout>
    )
}

export default withAuth(TeamList, ['admin','HR','manager']);
