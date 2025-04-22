// app/api/proxy-query/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const { prompt } = await request.json();

	try {
		const response = await fetch(
			'https://interview-with-ai-api.onrender.com/api/queries',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ prompt }),
			},
		);

		const data = await response.json();

		return NextResponse.json(data, {
			status: response.status,
		});
	} catch (error) {
		return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
	}
}
