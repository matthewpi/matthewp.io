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

declare module 'process' {
	global {
		const process: NodeJS.Process;

		namespace NodeJS {
			interface ProcessEnv {
				NODE_ENV: 'development' | 'production';
			}

			interface Process extends EventEmitter {
				env: ProcessEnv;
			}
		}
	}
}

declare module '*.css' {
	const asset: string;
	export default asset;
}

declare module '*.json' {
	const asset: any;
	export default asset;
}

declare module '*.mdx' {
	import type { ComponentType as MdxComponentType } from 'react';

	export const attributes: any;
	export const filename: string;
	const component: MdxComponentType;
	export default component;
}

/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare-pages/globals" />
/// <reference types="@cloudflare/workers-types" />
