

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
npx supabase gen types typescript --project-id abcd12345 > database.types.ts
```

## Deployment

```sh
yarn build
yarn start
```
Outputs:
- `build/`
- `public/build/`


## Others

[Tailwind VSCode extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)