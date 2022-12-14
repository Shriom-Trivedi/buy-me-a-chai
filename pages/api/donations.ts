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
import { AirtableRecord } from '../../types';

const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: '2022-08-01',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_APP_ID}/donations?maxRecords=100&view=Grid%20view`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AIRTABLE_BEARER_TOKEN}`,
    },
  });

  const data = (await response.json()) as AirtableRecord;

  return res.status(200).json(data.records);
}
