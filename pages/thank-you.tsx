import Head from 'next/head';
import Link from 'next/link';

export default function ThankYou() {
  return (
    <div>
      <Head>
        <title>Thank You</title>
        <meta name='description' content='Buy me a chai' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='max-w-2xl p-4 m-auto flex flex-col'>
        <div className='flex-1 p-4'>
          <h1 className='text-3xl mb-2 font-bold'>Thank you!</h1>
          <p>Your donation has been received.</p>
        </div>
        <Link href='/'>
          <div className='py-4 ml-4 mt-6 flex rounded justify-center w-[15%] cursor-pointer bg-[#4598b4] text-white hover:opacity-80'>
            Home
          </div>
        </Link>
      </main>
    </div>
  );
}
