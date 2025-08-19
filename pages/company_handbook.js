import useGetActiveUser from '../hooks/query/getUserFromLocalStorage';
import withAuth from '../components/auth/auth';
import Layout from '../components/layout/layout';
import CompanyHandbookComponent from '../components/common/CompanyHandbookComponent';

const CompanyHandbook = () => {
    const { data: user } = useGetActiveUser()

    return (
        <Layout title={'Company Policy'} subtitle={'Overview'}>
            <CompanyHandbookComponent role={user.role} />
        </Layout>
    )
}

export default withAuth(CompanyHandbook, ['admin','HR','staff','team_lead','manager']);
