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

import type { LoaderFunction } from 'remix';
import { Link, Outlet, useLoaderData, useMatches, json } from 'remix';

import type { Article, DataFunctionArgs } from '~/types';

export const loader: LoaderFunction = async ({
	context: { KV, waitUntil },
	request,
}: DataFunctionArgs) => {
	// @ts-expect-error TypeScript and Cloudflare have an overlapping declaration name.
	const cache = caches.default as Cache;
	let response = await cache.match(request);
	if (response !== undefined) {
		return response;
	}

	const data = await KV.get<Article[]>('articles', 'json');
	if (data === null) {
		return json([]);
	}

	response = json(data);

	const cachedResponse = response.clone();
	cachedResponse.headers.append('Cache-Control', 'public, max-age=300, s-maxage=30');
	waitUntil(cache.put(request, cachedResponse));

	return response;
};

const IS_BLOG_POST_REGEXP = /^\/blog\/.+/i;

function BlogIndex() {
	const articles = useLoaderData<Article[]>();

	return (
		<>
			<div className="text-center">
				<h2 className="text-3xl tracking-tight font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
					From the blog
				</h2>
				<p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500 sm:mt-4">
					Collection of articles I&apos;ve written, primarily about technology and fun but
					pointless experiments.
				</p>
			</div>

			<div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
				{articles.map(article => (
					<div
						key={article.slug}
						className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-transform ease-in-out duration-250 hover:translate-y-[-0.25rem]"
					>
						<div className="flex-shrink-0">
							<img className="h-48 w-full object-cover" src={article.image} alt="" />
						</div>
						<div className="flex-1 bg-white dark:bg-slate-800 p-6 flex flex-col justify-between">
							<div className="flex-1">
								<Link to={article.slug} className="block">
									<p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
										{article.title}
									</p>
									<p className="mt-3 text-base text-slate-500">
										{article.summary}
									</p>
								</Link>
							</div>
							{article.authors[0] === undefined ? null : (
								<div className="mt-6 flex items-center">
									<div className="flex-shrink-0">
										<a
											href={article.authors[0].url}
											rel="nofollow noopener noreferrer"
										>
											<span className="sr-only">
												{article.authors[0].name}
											</span>
											<img
												className="h-10 w-10 rounded-full"
												src={article.authors[0].avatar}
												alt=""
											/>
										</a>
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-slate-900 dark:text-slate-100">
											<a
												href={article.authors[0].url}
												className="hover:underline"
											>
												{article.authors[0].name}
											</a>
										</p>
										<div className="flex space-x-1 text-sm text-slate-500">
											<time
												dateTime={article.publishedAt ?? article.createdAt}
											>
												{new Date(
													article.publishedAt ?? article.createdAt,
												).toLocaleDateString('en-CA')}
											</time>
											{article.readTime === undefined ? null : (
												<>
													<span aria-hidden="true">&middot;</span>
													<span>{article.readTime} read</span>
												</>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default function Blog() {
	const matches = useMatches();
	const { pathname } = matches[matches.length - 1] ?? { pathname: '' };

	const isBlogPost = IS_BLOG_POST_REGEXP.test(pathname);

	return isBlogPost ? <Outlet /> : <BlogIndex />;
}
