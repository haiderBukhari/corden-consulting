import React from 'react';
import withAuth from '../../../components/auth/auth';
import OnboardingProcess from '../../../components/common/onboarding/hr/OnboardingProcess';
import Layout from '../../../components/layout/layout';
const HRProcessOnboardingPage = () => {
  return (
    <Layout>
      <OnboardingProcess />
    </Layout>
  );
};


export default withAuth(HRProcessOnboardingPage, ['HR','Admin']); 