## Install dependencies

```sh
yarn install
```

## Development mode

```sh
yarn dev
```

## Run tests

```sh
yarn test
```

## Generate DB types

Replace `abcd12345` with project ID.

```sh
yarn supabase gen types typescript --project-id abcd12345 > database.types.ts
```

## Environment variables

```sh
SESSION_SECRET=(example: any random string for cookie session)

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_IMAGES_PATH=

STRIPE_SECRET_KEY=
STRIPE_RETURN_URL=(example: http://localhost:3000/pay/success)

PROMO_DOUBLE_TAGS_JSON=(example: white_16&c_21)
PROMO_BRAND=(example: yellow)
```

## Deployment

```sh
yarn build
yarn start
```

Outputs:

-   `build/`
-   `public/build/`

## Others

[Tailwind VSCode extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
