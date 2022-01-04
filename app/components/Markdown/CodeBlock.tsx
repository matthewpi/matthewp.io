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

import ArrowsExpandIcon from '@heroicons/react/outline/ArrowsExpandIcon';
import ClipboardCheckIcon from '@heroicons/react/outline/ClipboardCheckIcon';
import ClipboardCopyIcon from '@heroicons/react/outline/ClipboardCopyIcon';
import copyToClipboard from 'copy-to-clipboard';
import { decode } from 'html-entities';
import type { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';

interface CodeBlockProps {
	filename?: string;
	terminal?: boolean;
	lineNumbers?: boolean;
}

export function CodeBlock({
	filename,
	terminal = false,
	lineNumbers = true,
	children,
	...props
}: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement> & CodeBlockProps) {
	const [expanded, setExpanded] = useState(false);
	const [copied, setCopied] = useState(false);

	const child = renderToString(children as ReactElement);
	const code = decode(child.replace(/(<([^>]+)>)/gi, '').trim());
	const label = filename ? filename : terminal ? 'Terminal' : undefined;
	const lines = child.trim().split('\n');
	const lineCount = lines.length;
	const maxDigits = lineCount.toString().length;

	const copyCode = () => {
		copyToClipboard(code);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 3000);
	};

	return (
		<div
			className={`bg-slate-800 rounded-xl dark:ring-1 dark:ring-inset dark:ring-white/10 transition-all motion-reduce:transition-none delay-50 duration-300 ease-in-out -mx-4 ${
				expanded ? 'lg:-mx-24 xl:-mx-52 2xl:-mx-72' : 'md:mx-0'
			}`}
		>
			<div className="text-blue-300 flex items-center border-b border-white/10">
				{label ? (
					<div className="flex items-center px-5 py-3 text-sm border-b border-blue-400 break-all">
						{label}
					</div>
				) : undefined}
				<div className="flex-1" />
				<div
					className="no-js:!hidden hidden py-3 pl-6 pr-4 lg:flex items-center text-slate-200 dark:text-slate-300 hover:text-white cursor-pointer"
					onClick={() => {
						setExpanded(!expanded);
					}}
				>
					<span className="mr-2 text-xs select-none">
						{expanded ? 'Collapse' : 'Expand'}
					</span>
					{expanded ? (
						<ArrowsExpandIcon className="w-5" />
					) : (
						<ArrowsExpandIcon className="w-5" />
					)}
				</div>
				<div
					className={`no-js:hidden py-3 pr-4 flex items-center ${
						copied
							? 'text-green-400'
							: 'text-slate-200 dark:text-slate-300 hover:text-white cursor-pointer'
					}`}
					onClick={copyCode}
				>
					<span className="hidden md:block mr-2 text-xs select-none">
						{copied ? 'Copied' : 'Copy'}
					</span>
					{copied ? (
						<ClipboardCheckIcon className="w-5" />
					) : (
						<ClipboardCopyIcon className="w-5" />
					)}
				</div>
			</div>

			<pre className="overflow-auto bg-transparent p-0 mt-0 rounded-t-none">
				<code
					className={`py-[1rem] px-[1.5rem] ${props.className ?? ''}`.trimEnd()}
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: lines
							.map((line, i) => {
								if (terminal) {
									if (line && !line.startsWith('<span'))
										return `<span class="before:content-['❯_'] before:text-pink-300 dark:before:text-pink-400" />${line}`;

									return `<span class="before:content-['__']" />${line}`;
								}

								if (lineCount > 1 && lineNumbers) {
									return `<span class="md:before:content-[attr(data-line-number)] before:text-slate-600 dark:before:text-slate-700" data-line-number="${(
										i + 1
									)
										.toString()
										.padStart(maxDigits, ' ')}  ">${line}</span>`;
								}

								return line;
							})
							.join('\n'),
					}}
				/>
			</pre>
		</div>
	);
}
