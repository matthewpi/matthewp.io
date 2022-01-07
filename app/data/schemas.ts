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

import type {
	Blog,
	Brand,
	City,
	Country,
	EducationalOccupationalCredential,
	EducationalOrganization,
	Language,
	Organization,
	Person,
} from 'schema-dts';

/* eslint-disable @typescript-eslint/naming-convention */
const BownessHighSchool: EducationalOrganization = {
	'@type': 'EducationalOrganization',
	'@id': 'https://matthewp.io/#BownessHighSchool',
	name: 'Bowness High School',
	sameAs: [
		'https://en.wikipedia.org/wiki/Bowness_High_School',
		'https://www.wikidata.org/wiki/Q4951371',
		'https://school.cbe.ab.ca/school/bowness',
	],
	url: 'https://school.cbe.ab.ca/school/bowness',
};

const Calgary: City = {
	'@type': 'City',
	'@id': 'https://matthewp.io/#Calgary',
	name: 'Calgary',
	sameAs: [
		'https://en.wikipedia.org/wiki/Calgary',
		'https://www.wikidata.org/wiki/Q36312',
		'https://wikitravel.org/en/Calgary',
	],
	url: 'https://wikitravel.org/en/Calgary',
};

const Canada: Country = {
	'@type': 'Country',
	'@id': 'https://matthewp.io/#Canada',
	name: 'Canada',
	sameAs: [
		'https://en.wikipedia.org/wiki/Canada',
		'https://www.wikidata.org/wiki/Q16',
		'https://wikitravel.org/en/Canada',
	],
	url: 'https://wikitravel.org/en/Canada',
};

const English: Language = {
	'@type': 'Language',
	alternateName: 'en',
	name: 'English',
};

const HighSchoolDiploma: EducationalOccupationalCredential = {
	'@type': 'EducationalOccupationalCredential',
	award: 'High School Diploma',
	credentialCategory: 'diploma',
	educationalLevel: '',
	name: 'High School Diploma',
	recognizedBy: {
		'@type': 'GovernmentOrganization',
		'@id': 'https://matthewp.io/#AlbertaGovernment',
		name: 'Alberta Government',
		sameAs: [
			'https://en.wikipedia.org/wiki/Alberta',
			'https://www.wikidata.org/wiki/Q1951',
			'https://www.alberta.ca',
		],
		url: 'https://www.alberta.ca',
	},
};

const Pterodactyl: Organization = {
	'@type': 'Organization',
	'@id': 'https://matthewp.io/#Pterodactyl',
	name: 'Pterodactyl',
	sameAs: ['https://github.com/pterodactyl', 'https://pterodactyl.io'],
	url: 'https://pterodactyl.io',
};

const MatthewPennerBrand: Brand = {
	'@type': 'Brand',
	'@id': 'https://matthewp.io/#Brand',
	description: 'matthewp.io',
	image: 'https://matthewp.io/icon.svg',
	logo: 'https://matthewp.io/icon.svg',
	name: 'Matthew Penner',
	url: 'https://matthewp.io',
};

const MatthewPenner: Person = {
	'@type': 'Person',
	'@id': 'https://matthewp.io/#MatthewPenner',
	affiliation: Pterodactyl,
	alumniOf: [BownessHighSchool],
	award: [],
	brand: MatthewPennerBrand,
	description: 'Nerd',
	email: 'hello@matthewp.io',
	familyName: 'Penner',
	gender: 'https://schema.org/Male',
	givenName: 'Matthew',
	hasCredential: HighSchoolDiploma,
	hasOccupation: {
		'@type': 'Occupation',
		name: 'Software Engineer',
	},
	homeLocation: Calgary,
	honorificPrefix: 'Mr.',
	image: 'https://matthewp.io/avatar.png',
	jobTitle: 'Software Engineer',
	knowsLanguage: English,
	mainEntityOfPage: 'https://matthewp.io',
	name: 'Matthew Penner',
	nationality: Canada,
	sameAs: ['https://github.com/matthewpi'],
	url: 'https://matthewp.io',
	workLocation: {
		'@type': 'Place',
		'@id': 'https://matthewp.io/#Calgary',
	},
};

const MatthewPennerBlog: Blog = {
	'@type': 'Blog',
	'@id': 'https://matthewp.io/#MatthewPennerBlog',
	abstract:
		"Collection of articles I've written, primarily about technology and fun but pointless experiments.",
	accountablePerson: {
		'@type': 'Person',
		'@id': MatthewPenner['@id'],
	},
	author: {
		'@type': 'Person',
		'@id': MatthewPenner['@id'],
	},
	copyrightHolder: {
		'@type': 'Person',
		'@id': MatthewPenner['@id'],
	},
	copyrightNotice: 'Copyright © 2022 Matthew Penner.  All rights reserved.',
	copyrightYear: 2022,
	creditText: 'Copyright © 2022 Matthew Penner.  All rights reserved.',
	editor: {
		'@type': 'Person',
		'@id': MatthewPenner['@id'],
	},
	headline: 'From the blog',
	inLanguage: 'en',
	isAccessibleForFree: 'https://schema.org/True',
	publisher: {
		'@type': 'Person',
		'@id': MatthewPenner['@id'],
	},
	description:
		"Collection of articles I've written, primarily about technology and fun but pointless experiments.",
	mainEntityOfPage: 'https://matthewp.io/blog',
	name: 'Blog',
	url: 'https://matthewp.io/blog',
};
/* eslint-enable @typescript-eslint/naming-convention */

export { MatthewPenner, MatthewPennerBlog, MatthewPennerBrand };
