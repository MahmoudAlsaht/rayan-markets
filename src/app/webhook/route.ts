import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
const { WHATSAPP_ACCESS_TOKEN, SECRET_2 } = process.env;

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const mode = searchParams.get('hub.mode');
	const challenge = searchParams.get('hub.challenge');
	const token = searchParams.get('hub.verify_token');

	if (mode && token) {
		if (mode === 'subscribe' && token === SECRET_2) {
			return new NextResponse(challenge, { status: 200 });
		} else {
			return new NextResponse('', { status: 403 });
		}
	}
}

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (body.object) {
		if (
			body.entry &&
			body.entry[0].changes &&
			body.entry[0].changes[0].value.messages &&
			body.entry[0].changes[0].value.messages[0]
		) {
			const phoneNumberId =
				body.entry[0].changes[0].value.metadata
					.phone_number_id;
			const from =
				body.entry[0].changes[0].value.messages[0].from;
			const msg_body =
				body.entry[0].changes[0].value.messages[0].text
					.body;
			axios({
				method: 'POST',
				url: `https://graph.facebook.com/v13.0/${phoneNumberId}/messages?access_token=${WHATSAPP_ACCESS_TOKEN}`,
				data: {
					messaging_product: 'whatsapp',
					to: from,
					text: {
						body: `Hi.. msg_body`,
					},
				},
				headers: {
					'Content-Type': 'application/json',
				},
			});

			return new NextResponse('', { status: 200 });
		} else {
			return new NextResponse('', { status: 404 });
		}
	}
}
