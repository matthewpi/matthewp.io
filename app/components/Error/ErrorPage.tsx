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

import { Link } from 'remix';

import { Logo } from '~/components/Navigation';

interface ErrorPageProps {
	code: string;
	heading: string;
	description: string;

	link?: {
		text: string;
		to: string;
	};
}

export function ErrorPage({ code, heading, description, link }: ErrorPageProps) {
	return (
		<div className="relative overflow-x-hidden">
			<div className="w-screen h-screen">
				<div className="flex flex-col min-h-full pt-16 pb-12">
					<main className="flex flex-col justify-center flex-grow w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
						<div className="flex justify-center flex-shrink-0">
							<a href="/" className="inline-flex">
								<span className="sr-only">Matthew Penner</span>
								<Logo className="w-auto h-12" />
							</a>
						</div>

						<div className="py-16">
							<div className="text-center">
								<p className="text-sm font-semibold tracking-wide text-blue-500 dark:text-blue-400 uppercase">
									{code} Error
								</p>
								<h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
									{heading}
								</h1>
								<p className="mt-2 text-base text-slate-500">{description}</p>
								{link && (
									<div className="mt-6">
										<Link
											to={link.to}
											className="text-base font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600"
										>
											{link.text}
											<span aria-hidden="true"> &rarr;</span>
										</Link>
									</div>
								)}
							</div>
						</div>
					</main>

					<footer className="flex-shrink-0 w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
						<nav className="flex justify-center space-x-4">
							<a
								href="https://status.matthewp.io"
								className="text-sm font-medium text-slate-500 hover:text-slate-600"
							>
								System Status
							</a>
						</nav>
					</footer>
				</div>
			</div>
		</div>
	);
}
