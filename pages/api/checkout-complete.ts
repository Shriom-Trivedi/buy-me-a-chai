// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Session } from 'inspector';
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import {
  AIRTABLE_APP_ID,
  AIRTABLE_BEARER_TOKEN,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
} from '../../config';

const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: '2022-08-01',
});

const insertToAirTable = async ({
  name,
  message,
  amount,
}: {
  name: string;
  message: string;
  amount: number;
}) => {
  const url = `https://api.airtable.com/v0/${AIRTABLE_APP_ID}/donations`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AIRTABLE_BEARER_TOKEN}`,
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            name,
            message,
            amount,
          },
        },
      ],
    }),
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'] as string;
  if (!signature) {
    return res.status(400).json({ message: 'Missing signature' });
  }

  let event: Stripe.Event;
  const buf = await buffer(req);

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error('Invalid signature ' + e);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(400).json({ message: 'Invalid event type' });
  }

  const metadata = (
    event.data.object as {
      metadata: { name: string; message: string };
    }
  ).metadata;

  const amount =
    (
      event.data.object as {
        amount_total: number;
      }
    ).amount_total / 100;

  console.log({ ...metadata, amount });
  await insertToAirTable({
    ...metadata,
    amount,
  });

  return res.status(200).json({ message: 'Success' });
}
