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

import { Popover, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Fragment } from 'react';
import { NavLink } from 'remix';

import { Logo } from './Logo';

const navigation = [{ name: 'Blog', href: '/blog' }];

export function Navigation() {
	return (
		<Popover>
			<div className="relative max-w-7xl mx-auto">
				<nav
					className="relative flex items-center justify-between sm:h-10 lg:justify-start"
					aria-label="Global"
				>
					<div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
						<div className="flex items-center justify-between w-full md:w-auto">
							<NavLink to="/">
								<span className="sr-only">Matthew Penner</span>
								<Logo className="h-8 sm:h-10" />
							</NavLink>
							<div className="flex items-center -mr-2 md:hidden">
								<Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
									<span className="sr-only">Open main menu</span>
									<MenuIcon className="w-6 h-6" aria-hidden="true" />
								</Popover.Button>
							</div>
						</div>
					</div>
					<div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
						{navigation.map(item => (
							<NavigationLink key={item.name} {...item} />
						))}
					</div>
				</nav>
			</div>

			<Transition
				as={Fragment}
				enter="duration-150 ease-out"
				enterFrom="scale-95 opacity-0"
				enterTo="scale-100 opacity-100"
				leave="duration-100 ease-in"
				leaveFrom="scale-100 opacity-100"
				leaveTo="scale-95 opacity-0"
			>
				<Popover.Panel
					focus
					className="absolute inset-x-0 top-0 z-10 p-2 transition origin-top-right transform md:hidden"
				>
					<div className="overflow-hidden rounded-lg shadow-md bg-white dark:bg-slate-900 ring-1 ring-opacity-5">
						<div className="flex flex-row-reverse items-center justify-between px-5 pt-4">
							<div className="-mr-2">
								<Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
									<span className="sr-only">Close main menu</span>
									<XIcon className="w-6 h-6" aria-hidden="true" />
								</Popover.Button>
							</div>
							<div>
								<Popover.Button
									as={NavLink}
									to="/"
									onClick={() => {
										close();
									}}
								>
									<Logo className="w-auto h-8" />
								</Popover.Button>
							</div>
						</div>
						<div className="px-2 pt-4 pb-3 space-y-1">
							{navigation.map(item => (
								<Popover.Button key={item.name} as={Fragment}>
									<NavLink
										to={item.href}
										className={({ isActive }) =>
											`block px-3 py-2 text-base font-medium rounded-md ${
												isActive
													? 'text-slate-800 bg-slate-200 dark:text-slate-100 dark:bg-slate-800'
													: 'text-slate-600 hover:text-slate-800 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
											}`
										}
									>
										{item.name}
									</NavLink>
								</Popover.Button>
							))}
						</div>
					</div>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
}

interface NavigationLinkProps {
	name: string;
	href: string;
}

export function NavigationLink({ name, href }: NavigationLinkProps) {
	return (
		<NavLink
			to={href}
			className={({ isActive }) =>
				`font-medium ${
					isActive
						? 'text-slate-800 dark:text-slate-200'
						: 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
				}`
			}
		>
			{name}
		</NavLink>
	);
}
