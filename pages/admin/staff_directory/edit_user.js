import Layout from '../../../components/layout/layout';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import CreateEditUserComponent from "../../../components/admin/UserManagement/create_user/CreateEditUserComponent";

const EditStaffUser = () => {
    const { data: user } = useGetActiveUser()

    return (
        <Layout title={'Edit User'} subtitle={'Staff Directory > Edit User'}>
            <CreateEditUserComponent role={user.role} isEditUser={true} user={user}/>
        </Layout>
    )
}

export default withAuth(EditStaffUser, ['admin']);
