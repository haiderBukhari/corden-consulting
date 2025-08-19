import Layout from '../../../components/layout/layout';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import CreateEditUserComponent from "../../../components/admin/UserManagement/create_user/CreateEditUserComponent";
import DeactiveUserListComponent from '../../../components/admin/StaffDirectory/DeactiveUserListComponent';

const DeactiveUser = () => {
    const { data: user } = useGetActiveUser()

    return (
        <Layout title={'Deactive User List'} subtitle={'Staff Directory > Deactivate User List'}>
            <DeactiveUserListComponent role={user.role}  user={user}/>
        </Layout>
    )
}

export default withAuth(DeactiveUser, ['admin','HR']);
