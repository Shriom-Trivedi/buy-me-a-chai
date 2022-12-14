import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DONATION_IN_RUPEES, MAX_DONATION_IN_RUPEES } from '../config';
import { Record } from '../types';

export default function Home({ donations }: { donations: Array<Record> }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const presets = [1, 3, 5];

  const handleCheckout = async () => {
    setError(null);
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        quantity,
        name,
        message,
      }),
    });

    const res = await response.json();

    if (!res.url) {
      setError(res.error);
      return;
    }

    if (res.url) {
      const url = res.url;

      router.push(url);
    }
  };

  return (
    <div className='h-screen'>
      <Head>
        <title>Buy me a chai</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/tea-cup5.svg' />
      </Head>

      <main className='flex md:flex-row flex-col max-w-6xl h-full m-auto'>
        <div className='flex-[3]'>
          <div className='mt-16 m-3 md:m-0 md:mt-12'>
            <h2 className='mb-8 text-2xl font-semibold'>Previous donations</h2>
            {donations.map((donation) => {
              const { amount, name, message } = donation.fields;
              return (
                <div
                  key={donation.id}
                  className='p-4 bg-[#37afff0d] border-[#37a8ff40] border rounded mb-3 md:w-[80%] hover:opacity-80'
                >
                  <span className='font-medium'>{name}</span>
                  <span> donated </span>
                  <span className=' text-green-500'>₹{amount}</span>
                  <div className='mt-4'>
                    <span className='italic font-mono text-gray-500 tracking-tighter'>
                      "{message}"
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className='flex-[2] p-3 md:p-0'>
          <div className='w-full flex items-center mt-[6.9rem]'>
            <div className='w-full border border-[#37a8ff40] rounded-lg px-5 py-7'>
              <h1 className=' text-3xl my-6 font-semibold'>Buy me a chai ☕</h1>
              <div className='flex items-center w-full mb-3 py-5 rounded border border-[#37a8ff40] bg-[#37afff0d]'>
                <span className='mr-2 ml-1'>
                  <Image
                    src='/tea-cup5.svg'
                    width='50'
                    height='100'
                    alt='teacup'
                  />
                </span>
                <span className='mr-4 cursor-pointer text-[#b4b4b4] text-[0.8rem]'>
                  X
                </span>
                {presets.map((preset) => (
                  <button
                    className='bg-blue-400 text-[#f5f5f5] px-4 py-2 rounded mr-2'
                    key={preset}
                    onClick={() => setQuantity(preset)}
                  >
                    {preset}
                  </button>
                ))}
                <input
                  type='number'
                  name='price'
                  id='price'
                  className=' py-2 px-2 w-[4rem] md:w-[8.3rem] bg-[#f5f5f6] rounded border-[1.5px] border-[#e4e3e3] text-[#696e79] focus:bg-[#fdfdfd] focus:border-blue-500 outline-none'
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                />
              </div>

              <div className='mb-4 w-full'>
                <label
                  className='block mb-1 text-[1rem] text-[#333435]'
                  htmlFor='name'
                >
                  Name (Optional)
                </label>
                <input
                  className='py-2 px-2 w-full bg-[#f5f5f6] rounded border-[1.5px] border-[#e4e3e3] text-[#696e79] focus:bg-[#fdfdfd] focus:border-blue-500 outline-none'
                  type='text'
                  name='name'
                  id='name'
                  placeholder='John Wick'
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

              <div className='mb-2 w-full'>
                <label
                  className='block text-[1rem] mb-1 text-[#333435]'
                  htmlFor='message'
                >
                  Message (Optional)
                </label>
                <textarea
                  name='message'
                  id='message'
                  placeholder='Thank you for your amazing content...'
                  className='py-4 px-2 w-full bg-[#f5f5f6] rounded border-[1.5px] border-[#e4e3e3] text-[#696e79] focus:bg-[#fdfdfd] focus:border-blue-500 outline-none'
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </div>

              <button
                onClick={handleCheckout}
                className='w-full mb-6 mt-3 bg-blue-500 text-[#f5f5f5] px-2 py-3 rounded hover:opacity-80'
              >
                Donate ₹ {quantity * (DONATION_IN_RUPEES / 100)}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const response = await fetch(
    `${protocol}://${context.req.headers.host}/api/donations`
  );

  const donations = await response.json();
  return {
    props: {
      donations,
    },
  };
};
