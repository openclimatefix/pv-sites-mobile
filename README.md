# pv-sites-mobile

<img width="600" alt="image" src="https://github.com/openclimatefix/pv-sites-mobile/assets/23221268/f2d56861-c906-4670-9e10-d380ad56eaeb">

## About

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-9-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[Solar electricity nowcasting](https://github.com/openclimatefix/nowcasting), a project by [Open Climate Fix (OCF)](https://openclimatefix.org/) to build the world's best near-term forecasting system for solar electricity generation, is already making a marketed impact on the UK National Grid.

With site-level forecasts—nowcasting for individual solar locations—OCF is in the process of bringing the nowcasting experience to the broader public, giving people more power over their own solar setup. Individual home owners, solar PV asset operators, offtakers, and smart home operators can all make use of better forecasting. In turn, OCF's impact reaches more people and helps further optimize the contribution of solar power to the electricity grid.

To allow easy, intuitive access to site-level predictions, [Hack4Impact](https://uiuc.hack4impact.org/) has been working to build out a mobile-first web application where users can view nowcasting forecasts for solar energy production on their solar panel arrays.

### Learn more

See the [nowcasting "meta-repository"](https://github.com/openclimatefix/nowcasting) for more information about OCF's mission and goals for this project.

### Usage

Contact [Open Climate Fix](mailto:info@openclimatefix.org) to request an account with production access to the pv-sites-mobile web application.

## Development

### Setup

This project is a Next.js 13 application built using the `pages` directory.

Install dependencies with yarn:

    yarn

Create a copy of `.env.local.example` with the name `.env.local` and fill in environment variables:

    cp .env.local.example .env.local

### Usage

Run the development server:

    yarn dev

## Deployment

This application is meant to be deployed to [Vercel](https://vercel.com/) and should have all environment variables not described as optional in `.env.local.example` supplied. This includes environment variables in `.env.production`, which are a generic baseline that won't function with most production deployments.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/braddf"><img src="https://avatars.githubusercontent.com/u/41056982?v=4?s=100" width="100px;" alt="braddf"/><br /><sub><b>braddf</b></sub></a><br /><a href="#projectManagement-braddf" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://andrewlester.net"><img src="https://avatars.githubusercontent.com/u/23221268?v=4?s=100" width="100px;" alt="Andrew Lester"/><br /><sub><b>Andrew Lester</b></sub></a><br /><a href="https://github.com/openclimatefix/pv-sites-mobile/commits?author=AndrewLester" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ericcccsliu"><img src="https://avatars.githubusercontent.com/u/62641231?v=4?s=100" width="100px;" alt="Eric Liu"/><br /><sub><b>Eric Liu</b></sub></a><br /><a href="https://github.com/openclimatefix/pv-sites-mobile/commits?author=ericcccsliu" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/neha-vard"><img src="https://avatars.githubusercontent.com/u/80798381?v=4?s=100" width="100px;" alt="neha-vard"/><br /><sub><b>neha-vard</b></sub></a><br /><a href="https://github.com/openclimatefix/pv-sites-mobile/commits?author=neha-vard" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/anyaparekh"><img src="https://avatars.githubusercontent.com/u/49364484?v=4?s=100" width="100px;" alt="Anya Parekh"/><br /><sub><b>Anya Parekh</b></sub></a><br /><a href="https://github.com/openclimatefix/pv-sites-mobile/commits?author=anyaparekh" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rohanvan123"><img src="https://avatars.githubusercontent.com/u/67704979?v=4?s=100" width="100px;" alt="Rohan Vanjani"/><br /><sub><b>Rohan Vanjani</b></sub></a><br /><a href="https://github.com/openclimatefix/pv-sites-mobile/commits?author=rohanvan123" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jackypark9852"><img src="https://avatars.githubusercontent.com/u/81858354?v=4?s=100" width="100px;" alt="Jacky Park"/><br /><sub><b>Jacky Park</b></sub></a><br /><a href="https://github.com/openclimatefix/pv-sites-mobile/commits?author=jackypark9852" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://ashayp.com"><img src="https://avatars.githubusercontent.com/u/21179174?v=4?s=100" width="100px;" alt="Ashay Parikh"/><br /><sub><b>Ashay Parikh</b></sub></a><br /><a href="https://github.com/openclimatefix/pv-sites-mobile/commits?author=ashayp22" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.kalynwatt.com/"><img src="https://images.squarespace-cdn.com/content/v1/6330cf626aba27472c9abe80/12e48df1-eb9e-4710-93fb-62811d3cbb9d/tempImagedpidYQ.jpg?format=500w" width="100px;" style="aspect-ratio: 1; object-fit: cover;" alt="Kalyn Watt"/><br /><sub><b>Kalyn Watt</b></sub></a><br /><a href="#design-kalynwatt" title="Design">🎨</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
