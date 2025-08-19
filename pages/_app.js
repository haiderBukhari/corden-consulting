import '../public/styles/globals.css'
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import Head from 'next/head';
import "react-toastify/dist/ReactToastify.css";
import { ClockProvider } from '../components/StaffDashboard/dashboard/clockProvider';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Syncopate&display=swap" rel="stylesheet" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ToastContainer limit={1} />
        <ClockProvider>
          <Component {...pageProps} />
        </ClockProvider>
      </QueryClientProvider>
    </div>
  )
}

export default MyApp