import Layout from '../../../components/layout/layout';
import { useRouter } from 'next/router';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import StaffListComponent from "../../../components/admin/StaffDirectory/StaffListComponent";

const StaffList = () => {
    const { data: user } = useGetActiveUser()

    return (
        <Layout title={'Staff Directory'} subtitle={'Overview'}>
            <StaffListComponent role={user.role} />
        </Layout>
    )
}

export default withAuth(StaffList, ['admin','HR']);
