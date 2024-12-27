import { NextResponse } from 'next/server';

const transformRecord = (record: any) => ({
  id: record.id,
  ...record.fields,
});

export async function GET() {
  try {
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Activities`;

    console.log("Fetching data from:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    if (!data.records) {
      throw new Error("No records found in Airtable response");
    }

    const transformedData = data.records.map(transformRecord);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching activities:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
