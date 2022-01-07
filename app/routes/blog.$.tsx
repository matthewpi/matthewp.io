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

import stackOverflowDark from 'highlight.js/styles/stackoverflow-dark.css';
import type { LinksFunction, LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';

import { Markdown, SmartLink } from '~/components/Markdown';
import { getMDXComponent } from '~/utils/mdx.client';
import hack from '~/styles/hack.css';
import type { Article, DataFunctionArgs } from '~/types';

interface BlogContentType {
	frontmatter: Record<string, any>;
	hash?: string;
	html: string;
	code?: string;
}

interface LoaderData {
	code?: string;
	frontmatter: Article;
	html: string;
	slug: string;
}

export const links: LinksFunction = () => {
	return [
		{
			rel: 'preload',
			href: hack,
			as: 'style',
			type: 'text/css',
		},
		{
			rel: 'stylesheet',
			href: hack,
		},
		{
			rel: 'preload',
			href: stackOverflowDark,
			as: 'style',
			type: 'text/css',
		},
		{
			rel: 'stylesheet',
			href: stackOverflowDark,
		},
	];
};

export const loader: LoaderFunction = async ({
	context: { KV, waitUntil },
	params,
	request,
}: DataFunctionArgs) => {
	// @ts-expect-error TypeScript and Cloudflare have an overlapping declaration name.
	const cache = caches.default as Cache;
	let response = await cache.match(request);
	if (response !== undefined) {
		return response;
	}

	const slug = params['*'];
	if (slug === undefined) {
		throw new Response('Not Found', { status: 404 });
	}

	const data = await KV.get<BlogContentType>(`article/${slug}`, 'json');
	if (data === null) {
		throw new Response('Not Found', { status: 404 });
	}

	const { frontmatter, code, hash } = data;

	const etag = request.headers.get('If-None-Match');
	if (etag === hash) {
		throw new Response('Not Modified', { status: 304 });
	}

	const headers = new Headers();
	if (hash) {
		headers.append('ETag', hash);
	}

	response = json(
		{
			code,
			frontmatter,
			slug,
		} as LoaderData,
		{ headers },
	);

	const cachedResponse = response.clone();
	cachedResponse.headers.append('Cache-Control', 'public, max-age=300, s-maxage=30');
	waitUntil(cache.put(request, cachedResponse));

	return response;
};

export default function Post() {
	const { code, frontmatter } = useLoaderData<LoaderData>();

	let Component;
	if (typeof window !== 'undefined' && code !== undefined) {
		Component = getMDXComponent(code);
	}

	return (
		<>
			<Decoration />

			<div className="relative px-4 sm:px-6 lg:px-8">
				<div className="text-lg max-w-prose mx-auto">
					<h1>
						<span className="block text-3xl text-center leading-8 font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
							{frontmatter.title}
						</span>
					</h1>

					<p className="mt-6 text-xl text-slate-500 leading-8">{frontmatter.summary}</p>

					<figure className="mt-6">
						<img src={frontmatter.image} className="w-full rounded-lg" alt="" />
						{frontmatter.imageAttribution === undefined ? null : (
							<figcaption className="text-sm text-center mt-2 text-slate-500 dark:text-slate-600">
								Photo by{' '}
								<SmartLink
									href={frontmatter.imageAttribution.authorUrl}
									className="text-slate-600 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300"
								>
									{frontmatter.imageAttribution.author}
								</SmartLink>{' '}
								on{' '}
								<SmartLink
									href={frontmatter.imageAttribution.platformUrl}
									className="text-slate-600 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300"
								>
									{frontmatter.imageAttribution.platform}
								</SmartLink>
							</figcaption>
						)}
					</figure>

					<div className="flex flex-col sm:flex-row mt-6">
						<p className="whitespace-nowrap text-slate-500 mr-4">
							{new Date(
								frontmatter.publishedAt ?? frontmatter.createdAt,
							).toLocaleDateString('en-CA', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>

						{frontmatter.authors.length > 0 ? (
							<div className="text-slate-600 dark:text-slate-400 mt-2 sm:mt-0 sm:ml-auto">
								{frontmatter.authors.map((author, i) => (
									<span key={author.name}>
										<SmartLink
											href={author.url}
											rel="author"
											className="underline"
										>
											{author.name}
										</SmartLink>
										{i < frontmatter.authors.length - 1 ? ', ' : ''}
									</span>
								))}
							</div>
						) : null}
					</div>
				</div>

				{Component === undefined ? null : (
					<article className="mt-4 sm:mt-6 prose prose-lg dark:prose-invert mx-auto">
						<Markdown contents={Component} />
					</article>
				)}
			</div>
		</>
	);
}

function Decoration() {
	return (
		<div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
			<div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
				<svg
					className="absolute top-12 left-full transform translate-x-32"
					width={404}
					height={384}
					fill="none"
					viewBox="0 0 404 384"
				>
					<defs>
						<pattern
							id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
							x={0}
							y={0}
							width={20}
							height={20}
							patternUnits="userSpaceOnUse"
						>
							<rect
								x={0}
								y={0}
								width={4}
								height={4}
								className="text-slate-200 dark:text-slate-700"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width={404}
						height={384}
						fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
					/>
				</svg>
				<svg
					className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
					width={404}
					height={384}
					fill="none"
					viewBox="0 0 404 384"
				>
					<defs>
						<pattern
							id="f210dbf6-a58d-4871-961e-36d5016a0f49"
							x={0}
							y={0}
							width={20}
							height={20}
							patternUnits="userSpaceOnUse"
						>
							<rect
								x={0}
								y={0}
								width={4}
								height={4}
								className="text-slate-200 dark:text-slate-700"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width={404}
						height={384}
						fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
					/>
				</svg>
				<svg
					className="absolute bottom-12 left-full transform translate-x-32"
					width={404}
					height={384}
					fill="none"
					viewBox="0 0 404 384"
				>
					<defs>
						<pattern
							id="d3eb07ae-5182-43e6-857d-35c643af9034"
							x={0}
							y={0}
							width={20}
							height={20}
							patternUnits="userSpaceOnUse"
						>
							<rect
								x={0}
								y={0}
								width={4}
								height={4}
								className="text-slate-200 dark:text-slate-700"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width={404}
						height={384}
						fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
					/>
				</svg>
			</div>
		</div>
	);
}
