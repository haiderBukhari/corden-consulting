import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import CreateEditUserComponent from "../../../components/admin/UserManagement/create_user/CreateEditUserComponent";
import useDemoUser from "../../../hooks/useDemoUser";

const CreateUser = () => {
    const { data: user } = useDemoUser();

    return (
        <Layout title={'Create User'} subtitle={'User Management > Create User'}>
            <CreateEditUserComponent role={user?.role} />
        </Layout>
    )
}

export default withAuth(CreateUser, ['admin','HR','manager']);
