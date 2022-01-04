//
// Copyright (c) 2021 Matthew Penner
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

import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import type { ServerBuild } from '@remix-run/server-runtime';

// @ts-expect-error Remix
import * as build from '../build';

export interface Env {
	KV: KVNamespace;
}

const handleRequest = createPagesFunctionHandler({
	build: build as unknown as ServerBuild,
});

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
	const ifNoneMatch = context.request.headers.get('if-none-match');

	return handleRequest({
		...context,
		env: {
			...context.env,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			ASSETS: {
				...context.env.ASSETS,
				fetch:
					// @ts-expect-error NODE_ENV gets replaced, it shouldn't be accessed by an index signature.
					// eslint-disable-next-line node/prefer-global/process
					process.env.NODE_ENV === 'production'
						? async (
								request: Request | string,
								requestInitr?: RequestInit | Request,
						  ) => {
								if (
									typeof request !== 'string' &&
									ifNoneMatch !== null &&
									!request.headers.has('if-none-match')
								) {
									request.headers.set('if-none-match', ifNoneMatch);
								}

								let response = await context.env.ASSETS.fetch(
									request,
									requestInitr,
								);
								if (response.ok) {
									response = new Response(
										[101, 204, 205, 304].includes(response.status)
											? null
											: response.body,
										response,
									);
									response.headers.set(
										'cache-control',
										'public, max-age=31536000, immutable',
									);
								}

								return response;
						  }
						: context.env.ASSETS.fetch,
			},
		},
	});
}
