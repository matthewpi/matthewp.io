#!/usr/bin/env node

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

/* eslint-disable no-await-in-loop */

import * as crypto from 'node:crypto';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import * as process from 'node:process';
import fetch from 'node-fetch';
import { bundleMDX } from 'mdx-bundler';
import { getMDXComponent } from 'mdx-bundler/client/index.js';
import * as React from 'react';
import { renderToString } from 'react-dom/server.js';
import rehypeHighlight from 'rehype-highlight';

(async function () {
	const postUrl = process.env.POST_URL ?? 'http://127.0.0.1:8788';
	const postApiKey = process.env.POST_API_KEY;
	const [basePath] = process.argv.slice(2);
	const generatedPath = path.join(basePath, 'scripts', 'generated');
	const mdxPaths = await fsp.readdir(generatedPath);
	const results = {};
	let hasError = false;

	for (let mdxPath of mdxPaths.filter(v => v.endsWith('.mdx'))) {
		mdxPath = path.join(generatedPath, mdxPath);
		const slug = path.basename(mdxPath, '.mdx');
		const mdxSource = await fsp.readFile(mdxPath, 'utf8');

		const { frontmatter, code } = await bundleMDX({
			source: mdxSource,
			xdmOptions(options) {
				options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeHighlight];
				return options;
			},
		});
		const Component = getMDXComponent(code);
		const html = renderToString(React.createElement(Component));

		const hash = crypto
			.createHash('sha256')
			.update(frontmatter + code)
			.digest('hex');

		const response = await fetch(`${postUrl}/api/blog`, {
			method: 'POST',
			body: JSON.stringify({
				code,
				frontmatter,
				hash,
				html,
				slug,
			}),
			headers: {
				Authorization: `Bearer ${postApiKey}`,
				'Content-Type': 'application/json; charset=utf-8',
			},
		});

		if (!response.ok) {
			const body = await response.text();
			results[slug] = {
				status: response.status,
				statusText: response.statusText,
				body,
			};
			hasError = true;
		}

		results[slug] = { status: response.status, statusText: response.statusText };
	}

	if (mdxPaths.includes('articles.json')) {
		const articles = await fsp.readFile(path.join(generatedPath, 'articles.json'), 'utf8');
		const response = await fetch(`${postUrl}/api/blog`, {
			method: 'POST',
			body: articles,
			headers: {
				Authorization: `Bearer ${postApiKey}`,
				'Content-Type': 'application/json; charset=utf-8',
			},
		});

		if (!response.ok) {
			const body = await response.text();
			results['articles.json'] = {
				status: response.status,
				statusText: response.statusText,
				body,
			};
			hasError = true;
		}

		results['articles.json'] = { status: response.status, statusText: response.statusText };
	}

	console.error(results);
	process.exit(hasError ? 1 : 0);
})();

/* eslint-enable no-await-in-loop */
