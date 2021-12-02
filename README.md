# ng-web3x

> nextjs web3 primitive

## Useful Patterns

[source; https://github.com/ricokahler/next-data-hooks#useful-patterns](https://github.com/ricokahler/next-data-hooks#useful-patterns)

A separate routes directory
Next.js has a very opinionated file-based routing mechanism that doesn't allow you to put a file in the /pages folder without it being considered a page.

Simply put, this doesn't allow for much organization.

With next-data-hooks, you can treat the /pages folder as a folder of entry points and organize files elsewhere.

```
my-project
# think of the pages folder as entry points to your routes
├── pages
│   ├── blog
│   │   ├── [slug].ts
│   │   └── index.ts
│   └── shop
│       ├── category
│       │   └── [slug].ts
│       ├── index.ts
│       └── product
│           └── [slug].ts
|
# think of each route folder as its own app with it's own components and helpers
└── routes
    ├── blog
    │   ├── components
    │   │   ├── blog-index.tsx
    │   │   ├── blog-post-card.tsx
    │   │   └── blog-post.tsx
    │   └── helpers
    │       └── example-blog-helper.ts
    └── shop
        ├── components
        │   ├── category.tsx
        │   ├── product-description.tsx
        │   └── product.tsx
        └── helpers
            └── example-shop-helper.ts
```
