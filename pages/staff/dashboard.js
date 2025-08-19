import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout"
import StaffDashboard from "../../components/StaffDashboard/dashboard";
import withAuth from "../../components/auth/auth"
import useDemoUser from "../../hooks/useDemoUser";

const Home = () => {
  const { data: user } = useDemoUser();
  
    return (
      <Layout title={'Dashboard'} subtitle={'Overview'}>
      <StaffDashboard role={user?.role} id={user?.id}/>
      </Layout>
    );
  }



export default withAuth(Home, ['staff', 'manager', 'team_lead']);