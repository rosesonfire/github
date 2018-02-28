## Pre-requisites
- Requires redis

## Build and run the scrapper
`npm run build && node dist/scrapper/main/index.js`
## Build and run the analyzer
`npm run build && node dist/analyzer/main/index.js`

## Configrations
- Setup the port and hostname of redis in `main/lib.js` files

## TODO / Possible improvements
- Write unit tests
- Write more analyses
- Persist analysis result
- Use separate redis instances for scrapping and analysis (or optionally use separate keyspaces)
- Bootstrap for UI
- Dockerize
