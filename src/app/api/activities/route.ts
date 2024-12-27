// src/app/api/activities/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
 try {
   const response = await fetch(
     `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Activities`,
     {
       headers: {
         'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
         'Content-Type': 'application/json',
       },
     }
   );
   const data = await response.json();
   return NextResponse.json(data.records);
 } catch (error) {
   console.error('Error:', error);
   return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
 }
}

export async function POST(request: Request) {
 try {
   const body = await request.json();
   const response = await fetch(
     `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Activities`,
     {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         fields: body
       }),
     }
   );
   const data = await response.json();
   return NextResponse.json(data);
 } catch (error) {
   console.error('Error:', error);
   return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
 }
}