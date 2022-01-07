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

import { MailIcon } from '@heroicons/react/outline';
import type { FC, ReactNode, SVGProps } from 'react';
import type { LinksFunction, MetaFunction } from 'remix';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from 'remix';
import type { Blog, Brand, Person, WithContext } from 'schema-dts';

import { ErrorPage } from '~/components/Error';
import { SmartLink } from '~/components/Markdown';
import { Navigation } from '~/components/Navigation';
import { ProgressBar } from '~/components/ProgressBar';
import { MatthewPenner, MatthewPennerBlog, MatthewPennerBrand } from '~/data/schemas';
import inter from '~/styles/inter.css';
import tailwind from '~/tailwind.css';

// https://remix.run/api/app#links
export const links: LinksFunction = () => {
	return [
		{
			rel: 'preload',
			href: inter,
			as: 'style',
			type: 'text/css',
		},
		{
			rel: 'stylesheet',
			href: inter,
		},
		{
			rel: 'preload',
			href: tailwind,
			as: 'style',
			type: 'text/css',
		},
		{
			rel: 'stylesheet',
			href: tailwind,
		},
	];
};

export const meta: MetaFunction = () => {
	return {
		title: 'Matthew Penner',
		description: 'Nerd',
		'og:site_name': 'Matthew Penner',
		'og:description': 'Nerd',
		'og:image': 'https://matthewp.io/icon.svg',
		'og:url': 'https://matthewp.io',
		'og:type': 'website',
	};
};

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
	console.error(error);

	return (
		<Document title="418 I'm a Teapot">
			<ErrorPage
				code="500"
				heading="Welp, something went wrong."
				description="An unrecoverable error has occurred."
				link={{ text: "Let's give it another shot", to: '/' }}
			/>
		</Document>
	);
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
	const caught = useCatch();

	let component;
	switch (caught.status) {
		case 404:
			component = (
				<ErrorPage
					code="404"
					heading="Page not found."
					description="Sorry, we couldn’t find the page you’re looking for."
					link={{ text: 'Go back home', to: '/' }}
				/>
			);
			break;
		default:
			throw new Error(caught.data ?? caught.statusText);
	}

	return <Document title={`${caught.status} ${caught.statusText}`}>{component}</Document>;
}

function Document({ children, title }: { children: ReactNode; title?: string }) {
	return (
		<html suppressHydrationWarning lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				{title ? <title>{title}</title> : null}
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
				{/* eslint-disable-next-line node/prefer-global/process */}
				{process.env.NODE_ENV === 'development' && <LiveReload />}
				<script
					type="application/ld+json"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							...MatthewPennerBrand,
						} as WithContext<Brand>),
					}}
				/>
				<script
					type="application/ld+json"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							// @ts-expect-error idk anymore
							...MatthewPenner,
						} as WithContext<Person>),
					}}
				/>
				<script
					type="application/ld+json"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							...MatthewPennerBlog,
						} as WithContext<Blog>),
					}}
				/>
			</body>
		</html>
	);
}

interface FooterLink {
	name: string;
	href: string;
	Icon: FC<SVGProps<SVGSVGElement>>;
}

const footerLinks: FooterLink[] = [
	{
		name: 'GitHub',
		href: 'https://github.com/matthewpi',
		Icon: (props: SVGProps<SVGSVGElement>) => (
			<svg fill="currentColor" viewBox="0 0 24 24" {...props}>
				<path
					fillRule="evenodd"
					d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: 'Mail',
		href: 'mailto:hello@matthewp.io',
		Icon: (props: SVGProps<SVGSVGElement>) => <MailIcon {...props} />,
	},
];

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
	return (
		<Document>
			<ProgressBar />

			<div className="relative overflow-x-hidden">
				<div className="h-full min-h-screen">
					<header className="py-6 px-6 lg:px-8">
						<Navigation />
					</header>

					<div className="pt-2 sm:pt-6 md:pt-8 lg:pt-10 px-4 sm:px-6 lg:px-8">
						<main className="relative max-w-7xl mx-auto pb-4 sm:pb-6 lg:pb-8">
							<Outlet />
						</main>

						<footer>
							<div className="max-w-7xl mx-auto py-10 lg:py-12 md:flex md:items-center md:justify-between">
								<div className="flex justify-center space-x-6 md:order-2">
									{footerLinks.map(({ name, href, Icon }) => (
										<SmartLink
											key={name}
											href={href}
											className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
										>
											<span className="sr-only">{name}</span>
											<Icon className="h-6 w-6" aria-hidden="true" />
										</SmartLink>
									))}
								</div>

								<div className="mt-8 md:mt-0 md:order-1">
									<p className="text-center text-base text-slate-400 dark:text-slate-500">
										&copy; {new Date().getFullYear()} Matthew Penner. All rights
										reserved.
									</p>
								</div>
							</div>
						</footer>
					</div>
				</div>
			</div>
		</Document>
	);
}
