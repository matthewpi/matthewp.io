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

import type { ComponentType } from 'react';

import { Markdown, SmartLink } from '~/components/Markdown';
import { Article } from '~/types';

interface BlogPostProps {
	Component: ComponentType;
	attributes: Article;
}

export function BlogPost({ Component, attributes: article }: BlogPostProps) {
	return (
		<div className="relative px-4 sm:px-6 lg:px-8">
			<div className="text-lg max-w-prose mx-auto">
				<h1>
					<span className="block text-3xl text-center leading-8 font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
						{article.title}
					</span>
				</h1>

				<p className="mt-6 text-xl text-slate-500 leading-8">{article.summary}</p>

				<figure className="mt-6">
					<img src={article.image} className="w-full rounded-lg" alt="" />
					{article.imageAttribution === undefined ? null : (
						<figcaption className="text-center mt-2">
							<SmartLink
								href={article.imageAttribution.link}
								className="text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
							>
								{article.imageAttribution.name}
							</SmartLink>
						</figcaption>
					)}
				</figure>

				<div className="flex flex-col sm:flex-row mt-6">
					<p className="whitespace-nowrap text-slate-500 mr-4">
						{new Date(article.publishedAt ?? article.createdAt).toLocaleDateString(
							'en-CA',
							{
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							},
						)}
					</p>

					{article.authors.length > 0 ? (
						<div className="text-slate-600 dark:text-slate-400 mt-2 sm:mt-0 sm:ml-auto">
							{article.authors.map((author, i) => (
								<span key={author.name}>
									<SmartLink href={author.url} rel="author" className="underline">
										{author.name}
									</SmartLink>
									{i < article.authors.length - 1 ? ', ' : ''}
								</span>
							))}
						</div>
					) : null}
				</div>
			</div>

			<article className="mt-4 sm:mt-6 prose prose-lg dark:prose-invert mx-auto">
				<Markdown contents={Component} />
			</article>
		</div>
	);
}
