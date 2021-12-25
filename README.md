# matthewp.io

This repository holds the code to my personal site <https://matthewp.io>.

Everything in this repository (unless otherwise stated) is available under the [MIT License](LICENSE).
This does not cover anything within the `public` directory which may include images or assets not
owned by me. My logos are not licensed and should not be used without my written permission.

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
it will most likely not work with any other platform unless modifications are made.

Whenever changes are made to the `master` branch, the site will automatically be built and
deployed by Cloudflare Pages. If a PR is created on the `master` branch, the site will be
deployed as a preview on a separate domain.

### Adding a Blog Post

The way blog posts are added to the site is done through a CMS and a code generation script.
More information and documentation on this will be added later.

The code generation script is written with generics, `go1.18beta1` or above is required to build it.

## Tech Stack

This site was built using the following libraries and tools, in no particular order:

- [Cloudflare Pages](https://pages.cloudflare.com)
- [HeadlessUI](https://headlessui.dev)
- [Heroicons](https://heroicons.com)
- [Remix](https://remix.run)
- [TailwindCSS](https://tailwindcss.com)
- [TailwindUI](https://tailwindui.com)
- [Yarn](https://yarnpkg.com)
