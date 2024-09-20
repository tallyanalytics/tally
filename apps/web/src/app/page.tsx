import { SessionProvider } from 'next-auth/react';
import Navbar from "../components/navbar";

export default function Page(): JSX.Element {
  return (
    <>
      <div>
        <Navbar />
      </div>
    </>
  );
}
