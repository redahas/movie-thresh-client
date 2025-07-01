import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.{ts,tsx}', 'src/graphql/**/*.ts'],
  generates: {
    './src/schema/__generated__/types.generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query'
      ],
      config: {
        fetcher: 'graphql-request',
        exposeQueryKeys: true,
        exposeFetcher: true,
        addInfiniteQueryParam: true,
        requestHeadersType: 'RequestInit["headers"]',
        skipTypename: false,
        defaultBaseType: 'Record<string, unknown>',
        scalars: {
          ID: 'string',
          String: 'string',
          Boolean: 'boolean',
          Int: 'number',
          Float: 'number',
        },
        reactQueryVersion: 5,
        legacyMode: false,
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
