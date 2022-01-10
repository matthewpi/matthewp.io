# matthewp.io

This repository holds the code to my personal site <https://matthewp.io>.

## Tech Stack

This site was built using the following libraries and tools, in no particular
order:

- [Cloudflare Pages](https://pages.cloudflare.com)
- [HeadlessUI](https://headlessui.dev)
- [Heroicons](https://heroicons.com)
- [Remix](https://remix.run)
- [TailwindCSS](https://tailwindcss.com)
- [TailwindUI](https://tailwindui.com)
- [Yarn](https://yarnpkg.com)

## How the Blog works

Like most things I build, this site is completely over-engineered. Articles are
retrieved from Strapi (CMS) as markdown and are written to `.mdx` files by the
[generation script](scripts/generate.go). Once the MDX is generated, the
[compile MDX](scripts/compile-mdx.mjs) script is ran which compiles the MDX into
usable React components and hits the `/api/blog` endpoint which stores the data
in [Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv).

When an article is created, updated, or published, a separate Cloudflare Worker
is called to trigger the [`compile-mdx` GitHub Workflow](.github/workflows/compile-mdx.yaml)
on this repository which will run the steps listed above to update the content
of the production deployment.

There is a `/api/blog/webhook` endpoint which Strapi hits when an article
is unpublished or deleted.

_NOTE: The code generation script is written with generics, `go1.18beta1` or
higher is required to build it._

## Usage

### Development

Install dependencies:

```shell
yarn install --immutable
```

Watch all individual components and start the Cloudflare Pages server:

```shell
yarn run dev
```

Update blog content and index for the dev server:

```shell
yarn run generate && POST_URL="http://127.0.0.1:8788" POST_API_KEY="abc" node scripts/compile-mdx.mjs .
```

### Production

Install dependencies:

```shell
yarn install --immutable
```

Generate blog posts:

```shell
yarn run generate
```

Build the application for production:

```shell
yarn run build
```

Start the Cloudflare Pages server:

```shell
yarn run serve:production
```

### Deploying

This repository is designed to be deployed to [Cloudflare Pages](https://pages.cloudflare.com),
and will not work with any other platform.

Whenever changes are made to the `master` branch, the site is deployed to
<https://preview.matthewp.io>, while changes to the `production` branch deploy
to <https://matthewp.io>.
