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

import type { LoadContext } from '~/types';

export async function onRequest(context: EventContext<LoadContext, any, any>): Promise<Response> {
	return createPagesFunctionHandler({
		build: build as unknown as ServerBuild,
		getLoadContext: (context: EventContext<LoadContext, any, any>): LoadContext => {
			return {
				/* eslint-disable @typescript-eslint/naming-convention */
				KV: context.env.KV,
				// @ts-expect-error Replaced by esbuild
				SECRET_POST_API_KEY: (context.env.POST_API_KEY as string) ?? 'abc',
				// @ts-expect-error Replaced by esbuild
				SECRET_WEBHOOK_API_KEY: (context.env.WEBHOOK_API_KEY as string) ?? 'abc',
				/* eslint-enable @typescript-eslint/naming-convention */
			};
		},
	})(context);
}
