import Head from 'next/head';
import Link from 'next/link';

export default function ThankYou() {
  return (
    <div>
      <Head>
        <title>Buy me a chai</title>
        <meta name='description' content='buy me a chai' />
        <link rel='icon' href='/tea-cup5.svg' />
      </Head>

      <main className='max-w-2xl p-4 m-auto flex flex-col'>
        <div className='flex-1 p-4'>
          <h1 className='text-3xl mb-2 font-bold'>Sorry you had to cancel</h1>
          <p>See you next time</p>
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
