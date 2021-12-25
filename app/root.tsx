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

import { ReactNode } from 'react';
import type { LinksFunction, MetaFunction } from 'remix';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from 'remix';

import tailwind from '~/tailwind.css';
import { ErrorPage } from '~/components/Error';
import { Navigation } from '~/components/Navigation';
import inter from '~/styles/inter.css';

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
		<html lang="en">
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
				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	);
}

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
	return (
		<Document>
			<div className="relative overflow-x-hidden">
				<div className="h-full min-h-screen">
					<div className="py-6 px-6 lg:px-8">
						<Navigation />
					</div>

					<div className="pt-2 sm:pt-6 md:pt-8 lg:pt-10 pb-12 px-4 sm:px-6 lg:px-8">
						<div className="relative max-w-7xl mx-auto">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</Document>
	);
}
