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
import type { HtmlMetaDescriptor, MetaFunction } from 'remix';

import type { Attributes } from './BlogPost';
import { BlogPost } from './BlogPost';

interface BlogPostComponent {
	default: ComponentType;
	attributes: Attributes;
}

export function generateBlogPost({ default: Component, attributes }: BlogPostComponent) {
	const meta: MetaFunction = () => {
		const base: HtmlMetaDescriptor = {
			title: `${attributes.title} | Matthew Penner`,
			description: attributes.summary,
			'og:site_name': 'Matthew Penner',
			'og:title': attributes.title,
			'og:description': attributes.summary,
			'og:image': attributes.image,
			'og:url': 'https://matthewp.io/blog/' + attributes.slug,
			'og:type': 'article',
			// On the server, publishedAt and updatedAt are dates, not strings.
			'og:article:published_time': (attributes.publishedAt as unknown as Date).toJSON(),
			'og:article:modified_time': (attributes.updatedAt as unknown as Date).toJSON(),
			'og:article:section': 'Technology',
		};

		if (attributes.authors.length > 0 && attributes.authors[0] !== undefined) {
			base['og:article:author:first_name'] = attributes.authors[0].name.split(' ')[0] ?? '';
			base['og:article:author:last_name'] = attributes.authors[0].name.split(' ')[1] ?? '';
		}

		return base;
	};

	return {
		meta,
		default: () => {
			return <BlogPost Component={Component} attributes={attributes} />;
		},
	};
}
