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

import type { Article, Author, DataFunctionArgs } from '~/types';

export const action: ActionFunction = async ({ context, request }: DataFunctionArgs) => {
	try {
		if (typeof context.SECRET_POST_API_KEY !== 'string' || context.SECRET_POST_API_KEY === '') {
			return new Response("Welp, you ain't doing that anytime soon.", { status: 401 });
		}

		const key = request.headers.get('Authorization');
		if (key !== `Bearer ${context.SECRET_POST_API_KEY}`) {
			return new Response('Unauthorized', { status: 401 });
		}

		const data = await request.json<{ data: any[] } | { slug: string }>();

		let kvKey;
		let kvData;
		if ('data' in data) {
			const articles: Article[] = [];
			for (const { attributes: article } of data.data) {
				const authors: Author[] = [];

				/* eslint-disable @typescript-eslint/no-unsafe-assignment */
				for (const { attributes: author } of article.authors.data) {
					authors.push({
						avatar: author.avatar,
						name: author.name,
						url: author.url,
					});
				}

				articles.push({
					slug: article.slug,
					title: article.title,
					summary: article.summary,
					image: article.image,
					createdAt: article.createdAt,
					updatedAt: article.updatedAt,
					publishedAt: article.publishedAt ?? undefined,
					readTime: article.readTime,
					authors,
				});
				/* eslint-enable @typescript-eslint/no-unsafe-assignment */
			}

			kvKey = 'articles';
			kvData = articles;
		} else if ('slug' in data) {
			kvKey = `article/${data.slug}`;
			kvData = data;
		} else {
			return new Response('Bad Request', { status: 400 });
		}

		await context.KV.put(kvKey, JSON.stringify(kvData));

		return new Response(null, { status: 204 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return json({ message: error.message, stack: error.stack }, { status: 500 });
		}

		return new Response('Internal Error', { status: 500 });
	}
};
