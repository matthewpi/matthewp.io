//
// Copyright (c) 2022 Matthew Penner
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

import type { ActionFunction } from 'remix';
import { json } from 'remix';

import type { Article, DataFunctionArgs } from '~/types';

type WebhookEvent =
	| 'entry.create'
	| 'entry.update'
	| 'entry.delete'
	| 'entry.publish'
	| 'entry.unpublish'
	| 'media.create'
	| 'media.update'
	| 'media.delete';

interface Webhook {
	event: WebhookEvent;
	model: string;
	entry: Record<string, unknown>;
}

export const action: ActionFunction = async ({ context, request }: DataFunctionArgs) => {
	try {
		if (
			typeof context.SECRET_WEBHOOK_API_KEY !== 'string' ||
			context.SECRET_WEBHOOK_API_KEY === ''
		) {
			return new Response("Welp, you ain't doing that anytime soon.", { status: 401 });
		}

		const key = request.headers.get('Authorization');
		if (key !== `Bearer ${context.SECRET_WEBHOOK_API_KEY}`) {
			return new Response('Unauthorized', { status: 401 });
		}

		const data = await request.json<Webhook>();
		if (data.model !== 'article') {
			return new Response(null, { status: 204 });
		}

		switch (data.event) {
			case 'entry.delete':
			case 'entry.unpublish': {
				const slug = data.entry['slug'] as string;
				await context.KV.delete(`article/${slug}`);

				const articles = await context.KV.get<Article[]>('articles', 'json');
				if (articles === null) {
					break;
				}

				await context.KV.put(
					'articles',
					JSON.stringify(articles.filter(a => a.slug !== slug)),
				);
				break;
			}

			default:
			// Do nothing
		}

		return new Response(null, { status: 204 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return json({ message: error.message, stack: error.stack }, { status: 500 });
		}

		return new Response('Internal Error', { status: 500 });
	}
};
