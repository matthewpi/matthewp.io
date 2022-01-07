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

import type { AnchorHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { LinkProps } from 'remix';
import { Link } from 'remix';

import { ExternalLink } from './ExternalLink';

function getURL(url: string, base?: string): URL | undefined {
	try {
		return new URL(url, base);
	} catch {
		return undefined;
	}
}

/* eslint-disable react/prop-types */
export const SmartLink = forwardRef<
	HTMLAnchorElement,
	AnchorHTMLAttributes<HTMLAnchorElement> | LinkProps
>((props, forwardedRef) => {
	if ('to' in props && props.to) {
		return <Link ref={forwardedRef} {...props} />;
	}

	if ('href' in props && props.href) {
		const url = getURL(props.href, 'relative://');
		if (url === undefined) {
			return <Link ref={forwardedRef} to={props.href} {...props} />;
		}

		if (url.protocol === 'relative:' && url.hostname === '') {
			return <Link ref={forwardedRef} to={url.pathname} {...props} />;
		}
	}

	return <ExternalLink ref={forwardedRef} {...props} />;
});
/* eslint-enable react/prop-types */
