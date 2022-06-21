![](./src/img/Screenshot%202022-06-20%20at%2009.58.34.png)

<!-- # MicrobioMe File Viewer Desktop -->

A desktop GUI that can analyze and produce data visualization for multiple files containing DNA records.

Accepts .csv, .tsv and .blast files containing dna data output by [BLAST](https://blast.ncbi.nlm.nih.gov/Blast.cgi)

# Features

- Upload multiple csv, tsv or blast files.
- Define spike data for all files.
- Display heatmap showing cell counts of identified species.
- Filter options for displaying results
  - Spikes on/off
  - Top hits per file (10, 20, 50, All)
- Color picker for results display

## Commands

#### `npm install --legacy-peer-deps`

Installs all dependencies and specific versions of peer dependencies.

#### `npm start`

Starts the app in a locaal development environment.

#### `npm run test`

Runs all test suites using [Jest](https://jestjs.io/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Requirements

Linux/Unbuntu os

## Dependencies

- [Electron-react-boilerplate](https://electron-react-boilerplate.js.org/docs/installation)
- [Redux toolkit](https://redux-toolkit.js.org/)
- [React bootstrap](https://react-bootstrap.github.io/)
- [Nivo heatmap canvas](https://nivo.rocks/heatmap/canvas/)
- [csv-parser](https://github.com/mafintosh/csv-parser)
- [Typescript](https://www.typescriptlang.org/docs/handbook/react.html)

## Maintainers

[Sean West](https://github.com/sean-sbl-uk)

## License

MIT
