import Image from 'next/image'
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import "@biconomy/web3-auth/dist/src/style.css";

export default function Home() {

  const SocialLoginDynamic = dynamic(
    () => import("../components/Auth").then((res) => res.default),
    { 
      ssr : false,
    }
  )
  return (
    <>
    <Suspense fallback={<div>Loading..</div>}>
    <SocialLoginDynamic />
    </Suspense>
    </>
  )
}
