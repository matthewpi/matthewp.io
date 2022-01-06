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

import type { DataFunctionArgs as RemixDataFunctionArgs } from '@remix-run/server-runtime';
import type { Except } from 'type-fest';

export interface Article {
	slug: string;
	title: string;
	summary: string;
	image: string;
	imageAttribution?: Attribution;
	createdAt: string;
	updatedAt: string;
	publishedAt?: string;
	readTime?: string;
	authors: Author[];
}

export interface Attribution {
	platform: string;
	platformUrl: string;
	author: string;
	authorUrl: string;
}

export interface Author {
	avatar: string;
	name: string;
	url: string;
}

export interface LoadContext {
	KV: KVNamespace;

	SECRET_POST_API_KEY: string;
	SECRET_WEBHOOK_API_KEY: string;
}

export type DataFunctionArgs = Except<RemixDataFunctionArgs, 'context'> & { context: LoadContext };
