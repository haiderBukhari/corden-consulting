
import Layout from "../components/layout/layout"
import withAuth from "../components/auth/auth"
import PerformanceComponent from "../components/common/peformance/PerformanceComponent";
import useGetActiveUser from "hooks/query/getUserFromLocalStorage";

const  MemberPerformance= () =>{

  const {data:user}=useGetActiveUser()
  return (
    <Layout title={'Performance Management'} subtitle={'Overview'}>
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
     Coming soon...
     </div>
      {/* <PerformanceComponent role={user.role}/> */}
    </Layout>
  )

}
export default withAuth(MemberPerformance, ['staff', 'team_lead', 'manager','HR']);
