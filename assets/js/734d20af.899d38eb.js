"use strict";(self.webpackChunk_lodestar_docs=self.webpackChunk_lodestar_docs||[]).push([[3674],{4614:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>a});var i=n(4848),t=n(8453);const r={},o="Contribution Guidelines",l={id:"contribution/getting-started",title:"Contribution Guidelines",description:"Thanks for your interest in contributing to Lodestar. It's people like you that push the Ethereum ecosystem forward.",source:"@site/pages/contribution/getting-started.md",sourceDirName:"contribution",slug:"/contribution/getting-started",permalink:"/lodestar/contribution/getting-started",draft:!1,unlisted:!1,editUrl:"https://github.com/ChainSafe/lodestar/tree/unstable/docs/pages/contribution/getting-started.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Supporting Libraries",permalink:"/lodestar/supporting-libraries/"},next:{title:"Setting Up a Testnet",permalink:"/lodestar/contribution/advanced-topics/setting-up-a-testnet"}},d={},a=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"MacOS Specifics",id:"macos-specifics",level:3},{value:"Getting Started",id:"getting-started",level:2},{value:"Tests",id:"tests",level:2},{value:"Devcontainer",id:"devcontainer",level:2},{value:"Common Issues",id:"common-issues",level:3},{value:"Debugging Spec Tests",id:"debugging-spec-tests",level:3},{value:"Docker",id:"docker",level:2},{value:"Beacon node only",id:"beacon-node-only",level:6},{value:"Beacon node and validator",id:"beacon-node-and-validator",level:6},{value:"Dockerized metrics + local beacon node",id:"dockerized-metrics--local-beacon-node",level:6},{value:"First Time Contributor?",id:"first-time-contributor",level:2},{value:"Reporting A Bug?",id:"reporting-a-bug",level:2},{value:"Contribution Process",id:"contribution-process",level:2},{value:"Github Style Guide",id:"github-style-guide",level:2},{value:"Lodestar Monorepo",id:"lodestar-monorepo",level:2},{value:"Style Guide",id:"style-guide",level:2},{value:"Tests style guide",id:"tests-style-guide",level:2},{value:"Logging policy",id:"logging-policy",level:2},{value:"Logging Levels",id:"logging-levels",level:3},{value:"Logging guidelines",id:"logging-guidelines",level:3},{value:"Contributing to Grafana dashboards",id:"contributing-to-grafana-dashboards",level:2},{value:"Using Download Script",id:"using-download-script",level:3},{value:"Contributing to Documentation",id:"contributing-to-documentation",level:2},{value:"Label Guide",id:"label-guide",level:2},{value:"<code>status.*</code> Issues and Pull Request Status",id:"status-issues-and-pull-request-status",level:6},{value:"<code>scope.*</code> Scope Indicator",id:"scope-scope-indicator",level:6},{value:"<code>prio.*</code> Prioritization Indicator",id:"prio-prioritization-indicator",level:6},{value:"<code>spec.*</code> Ethereum Consensus Spec Version Target",id:"spec-ethereum-consensus-spec-version-target",level:6},{value:"Community",id:"community",level:2}];function c(e){const s={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h6:"h6",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.h1,{id:"contribution-guidelines",children:"Contribution Guidelines"}),"\n",(0,i.jsx)(s.p,{children:"Thanks for your interest in contributing to Lodestar. It's people like you that push the Ethereum ecosystem forward."}),"\n",(0,i.jsx)(s.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\u2699"," ",(0,i.jsx)(s.a,{href:"https://nodejs.org/",children:"NodeJS"})," (LTS)"]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83e\uddf0"," ",(0,i.jsx)(s.a,{href:"https://classic.yarnpkg.com/lang/en/",children:"Yarn"})]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"macos-specifics",children:"MacOS Specifics"}),"\n",(0,i.jsx)(s.p,{children:"When using MacOS, there are a couple of extra prerequisites that are required."}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"python"}),"\n",(0,i.jsxs)(s.li,{children:["coreutils (e.g. via ",(0,i.jsx)(s.code,{children:"brew install coreutils"}),")"]}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"getting-started",children:"Getting Started"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\u2699"," Run ",(0,i.jsx)(s.code,{children:"corepack enable"})," to enable ",(0,i.jsx)(s.a,{href:"https://nodejs.org/api/corepack.html",children:"Corepack"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["\u2699"," Run ",(0,i.jsx)(s.code,{children:"yarn"})," to install dependencies."]}),"\n",(0,i.jsxs)(s.li,{children:["\u2699"," Run ",(0,i.jsx)(s.code,{children:"yarn build"})," to build lib from source."]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83d\udce6"," A ",(0,i.jsx)(s.code,{children:"lodestar"})," binary will be bundled in ",(0,i.jsx)(s.code,{children:"./packages/cli/bin"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83d\udcbb"," Run ",(0,i.jsx)(s.code,{children:"./lodestar --help"})," to get a list of available commands and arguments."]}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"tests",children:"Tests"}),"\n",(0,i.jsx)(s.p,{children:"To run tests:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\ud83e\uddea"," Run ",(0,i.jsx)(s.code,{children:"yarn test:unit"})," for unit tests."]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83e\uddea"," Run ",(0,i.jsx)(s.code,{children:"yarn test:e2e"})," for end-to-end tests."]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83e\uddea"," Run ",(0,i.jsx)(s.code,{children:"yarn test:spec"})," for spec tests."]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83e\uddea"," Run ",(0,i.jsx)(s.code,{children:"yarn test"})," to run all tests."]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83e\uddea"," Run ",(0,i.jsx)(s.code,{children:"yarn check-types"})," to check TypeScript types."]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83e\uddea"," Run ",(0,i.jsx)(s.code,{children:"yarn lint"})," to run the linter (ESLint)."]}),"\n"]}),"\n",(0,i.jsxs)(s.p,{children:["Note that to run ",(0,i.jsx)(s.code,{children:"test:e2e"}),", first ensure that the environment is correctly setup by running the ",(0,i.jsx)(s.code,{children:"run_e2e_env.sh"})," script. This script requires a running docker engine."]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"./scripts/run_e2e_env.sh start\n"})}),"\n",(0,i.jsxs)(s.p,{children:["Similarly, run ",(0,i.jsx)(s.code,{children:"yarn download-spec-tests"})," before running ",(0,i.jsx)(s.code,{children:"yarn test:spec"}),"."]}),"\n",(0,i.jsx)(s.p,{children:"Contributing to tests:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["Test must not depend on external live resources, such that running tests for a commit must be deterministic:","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"Do not pull data from external APIs like execution JSON RPC (instead run a local node)."}),"\n",(0,i.jsx)(s.li,{children:"Do not pull unpinned versions from DockerHub (use deterministic tag) or Github (checkout commit not branch)."}),"\n",(0,i.jsx)(s.li,{children:"Carefully design tests that depend on timing sensitive events like p2p network e2e tests. Consider that Github runners are significantly less powerful than your development environment."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"devcontainer",children:"Devcontainer"}),"\n",(0,i.jsxs)(s.p,{children:["A ",(0,i.jsx)(s.a,{href:"https://containers.dev/",children:"devcontainer"})," ",(0,i.jsx)(s.a,{href:"https://github.com/ChainSafe/lodestar/blob/unstable/.devcontainer/devcontainer.json",children:"configuration"})," is provided to help speed up linux based development environment setup. It will be used by ",(0,i.jsx)(s.a,{href:"https://github.com/features/codespaces",children:"GitHub Codespaces"})," or directly inside VS Code via your local through this ",(0,i.jsx)(s.a,{href:"https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers",children:"extension"}),"."]}),"\n",(0,i.jsx)(s.h3,{id:"common-issues",children:"Common Issues"}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:'Error: [vitest] Cannot mock "../../src/db/repositories/index.js" because it is already loaded by "src/db/beacon.ts"'})}),"\n",(0,i.jsx)(s.p,{children:"If you observe any error in tests with matching to above error message, that implies you are loading the mocks in the wrong order. The correct order is to import the mocks first and then the actual module. We suggest to import the mocks on very top before any local modules."}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:"\u2716 Error: Cannot find package 'async_hooks' imported from"})}),"\n",(0,i.jsxs)(s.p,{children:["If you observe following error running any of the test files that means you are running a file which itself or any dependency of that file imports ",(0,i.jsx)(s.code,{children:"vitest"}),", but you are not running that file with ",(0,i.jsx)(s.code,{children:"vitest"})," runner. Try running it with ",(0,i.jsx)(s.code,{children:"yarn vitest"})," command, not with ",(0,i.jsx)(s.code,{children:"node"})," command."]}),"\n",(0,i.jsx)(s.h3,{id:"debugging-spec-tests",children:"Debugging Spec Tests"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"To fix errors always focus on passing all minimal tests first without running mainnet tests."}),"\n",(0,i.jsx)(s.li,{children:"Spec tests often compare full expected vs actual states in JSON format."}),"\n",(0,i.jsxs)(s.li,{children:["A single logical error can cause many spec tests to fail. To focus on a single test at a time you can use vitest's option ",(0,i.jsx)(s.code,{children:"--bail 1"})," to stop at the first failed test"]}),"\n",(0,i.jsxs)(s.li,{children:["To then run only that failed test you can run against a specific file as use vitest's filters option ",(0,i.jsx)(s.code,{children:"-t <pattern>"})," to run only one case"]}),"\n",(0,i.jsxs)(s.li,{children:["Before running the tests, make sure to switch to the package directory (e.g. ",(0,i.jsx)(s.code,{children:"packages/beacon-node"}),") to speed up test execution"]}),"\n"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"LODESTAR_PRESET=minimal yarn vitest --run --bail 1 --config vitest.spec.config.ts test/spec/presets/sanity.test.ts -t attester_slashing\n"})}),"\n",(0,i.jsx)(s.h2,{id:"docker",children:"Docker"}),"\n",(0,i.jsxs)(s.p,{children:["The docker-compose file requires that a ",(0,i.jsx)(s.code,{children:".env"})," file be present in this directory. The ",(0,i.jsx)(s.code,{children:"default.env"})," file provides a template and can be copied ",(0,i.jsx)(s.code,{children:".env"}),":"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"cp default.env .env\n"})}),"\n",(0,i.jsx)(s.h6,{id:"beacon-node-only",children:"Beacon node only"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"docker-compose up -d\n"})}),"\n",(0,i.jsx)(s.h6,{id:"beacon-node-and-validator",children:"Beacon node and validator"}),"\n",(0,i.jsxs)(s.p,{children:["First, you must have keystores and their secrets available locally at ",(0,i.jsx)(s.code,{children:"./keystores"})," and your ",(0,i.jsx)(s.code,{children:"password.txt"})," in ",(0,i.jsx)(s.code,{children:"./secrets"})]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"docker-compose -f docker-compose.yml -f docker-compose.validator.yml up -d\n"})}),"\n",(0,i.jsx)(s.h6,{id:"dockerized-metrics--local-beacon-node",children:"Dockerized metrics + local beacon node"}),"\n",(0,i.jsxs)(s.p,{children:["Run a local beacon with ",(0,i.jsx)(s.code,{children:"--metrics"})," enabled. Then start Prometheus + Grafana with all dashboards in ",(0,i.jsx)(s.code,{children:"./dashboards"})," automatically loaded running:"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"./docker/docker-compose.local_dev.sh\n"})}),"\n",(0,i.jsx)(s.h2,{id:"first-time-contributor",children:"First Time Contributor?"}),"\n",(0,i.jsx)(s.p,{children:"Unsure where to begin contributing to Lodestar? Here are some ideas!"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\u270f\ufe0f"," See any typos? See any verbiage that should be changed or updated? Go for it! Github makes it easy to make contributions right from the browser."]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83d\udd0e"," Look through our ",(0,i.jsx)(s.a,{href:"https://github.com/ChainSafe/lodestar/issues?q=is%3Aopen+is%3Aissue+no%3Aassignee",children:"outstanding unassigned issues"}),". (Hint: look for issues labeled ",(0,i.jsx)(s.code,{children:"good first issue"})," or ",(0,i.jsx)(s.code,{children:"help-wanted"}),"!)"]}),"\n",(0,i.jsxs)(s.li,{children:["\ud83d\udcac"," Join our ",(0,i.jsx)(s.a,{href:"https://discord.gg/aMxzVcr",children:"Discord chat"}),"!\n",(0,i.jsx)(s.a,{href:"https://discord.gg/aMxzVcr",children:(0,i.jsx)(s.img,{src:"https://img.shields.io/discord/593655374469660673.svg?label=Discord&logo=discord",alt:"Discord"})})]}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"reporting-a-bug",children:"Reporting A Bug?"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\ud83d\uddd2"," ",(0,i.jsx)(s.a,{href:"https://github.com/ChainSafe/lodestar/issues/new/choose",children:"Create a new issue!"})," Select the type of issue that best fits, and please fill out as much of the information as you can."]}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"contribution-process",children:"Contribution Process"}),"\n",(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["Make sure you're familiar with our contribution guidelines ",(0,i.jsx)(s.em,{children:"(this document)"}),"!"]}),"\n",(0,i.jsxs)(s.li,{children:["Create your ",(0,i.jsx)(s.a,{href:"https://github.com/ChainSafe/lodestar/fork",children:"own fork"})," of this repository."]}),"\n",(0,i.jsx)(s.li,{children:"Make your changes in your local fork."}),"\n",(0,i.jsxs)(s.li,{children:["If you've made a code change, make sure to lint and test your changes (",(0,i.jsx)(s.code,{children:"yarn lint"})," and ",(0,i.jsx)(s.code,{children:"yarn test:unit"}),")."]}),"\n",(0,i.jsx)(s.li,{children:"Make an open pull request when you're ready for it to be reviewed. We review PRs on a regular basis. See Pull request etiquette for more information."}),"\n",(0,i.jsx)(s.li,{children:"You may be asked to sign a Contributor License Agreement (CLA). We make it relatively painless with CLA-bot."}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"github-style-guide",children:"Github Style Guide"}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:"Branch Naming"})}),"\n",(0,i.jsxs)(s.p,{children:["If you are contributing from this repository prefix the branch name with your Github username (i.e. ",(0,i.jsx)(s.code,{children:"myusername/short-description"}),")"]}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:"Pull Request Naming"})}),"\n",(0,i.jsx)(s.p,{children:"Pull request titles must be:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["Adhering to the ",(0,i.jsx)(s.a,{href:"https://www.conventionalcommits.org/en/v1.0.0/#summary",children:"conventional commits"})," spec"]}),"\n",(0,i.jsx)(s.li,{children:"Short and descriptive summary"}),"\n",(0,i.jsx)(s.li,{children:"Written in imperative present tense"}),"\n",(0,i.jsx)(s.li,{children:"Not end with a period"}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"For example:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"feat: add lodestar prover for execution api"}),"\n",(0,i.jsx)(s.li,{children:"fix: ignore known block in publish blinded block flow"}),"\n",(0,i.jsx)(s.li,{children:"refactor(reqresp)!: support byte based handlers"}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:"Pull Request Etiquette"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"Pull requests should remain as drafts when they are not ready for review by maintainers. Open pull requests signal to the maintainers that it's ready for review."}),"\n",(0,i.jsx)(s.li,{children:"If your pull request is no longer applicable or validated to fix an issue, close your pull request."}),"\n",(0,i.jsx)(s.li,{children:"If your pull request is fixable and needs additional changes or commits within a short period of time, switch your pull request into a draft until it's ready."}),"\n",(0,i.jsxs)(s.li,{children:["Otherwise, close your pull request and ",(0,i.jsx)(s.a,{href:"https://github.com/ChainSafe/lodestar/issues/new/choose",children:"create a new issue instead."})]}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"lodestar-monorepo",children:"Lodestar Monorepo"}),"\n",(0,i.jsxs)(s.p,{children:["We're currently experimenting with hosting the majority of lodestar packages and support packages in this repository as a ",(0,i.jsx)(s.a,{href:"https://en.wikipedia.org/wiki/Monorepo",children:"monorepo"}),". We're using ",(0,i.jsx)(s.a,{href:"https://lerna.js.org/",children:"Lerna"})," to manage the packages. See ",(0,i.jsx)(s.a,{href:"https://github.com/ChainSafe/lodestar/tree/unstable/packages",children:"packages/"})," for a list of packages hosted in this repository."]}),"\n",(0,i.jsx)(s.h2,{id:"style-guide",children:"Style Guide"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"Lodestar has migrated to using ES modules."}),"\n",(0,i.jsxs)(s.li,{children:["Many module class constructors have the following signature: ",(0,i.jsx)(s.code,{children:"(options, dependencies)"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["e.g.: ",(0,i.jsx)(s.code,{children:"public constructor(opts: IExampleOptions, {db, logger}: IExampleModules)"})]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["Modules should be designed to ",(0,i.jsx)(s.em,{children:'"do one thing and do it well!"'}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"Consider the interface of a module -- events included, and make sure it is coherent"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["Make sure your code is properly linted","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"use an IDE that will show linter errors/warnings"}),"\n",(0,i.jsxs)(s.li,{children:["run ",(0,i.jsx)(s.code,{children:"yarn lint"})," from the command line"]}),"\n",(0,i.jsxs)(s.li,{children:["common rules:","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["Functions and variables should be ",(0,i.jsx)(s.a,{href:"https://en.wikipedia.org/wiki/Camel_case",children:(0,i.jsx)(s.code,{children:"camelCase"})}),", classes should be ",(0,i.jsx)(s.a,{href:"http://wiki.c2.com/?PascalCase",children:(0,i.jsx)(s.code,{children:"PascalCase"})}),", constants should be ",(0,i.jsx)(s.code,{children:"UPPERCASE_WITH_UNDERSCORES"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["Use ",(0,i.jsx)(s.code,{children:'"'})," instead of ",(0,i.jsx)(s.code,{children:"'"})]}),"\n",(0,i.jsx)(s.li,{children:"All functions should have types declared for all parameters and return value"}),"\n",(0,i.jsxs)(s.li,{children:["You shouldn't be using TypeScript type ",(0,i.jsx)(s.code,{children:"any"})]}),"\n",(0,i.jsxs)(s.li,{children:["Private class properties should not be prefixed with a ",(0,i.jsx)(s.code,{children:"_"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["e.g.: ",(0,i.jsx)(s.code,{children:"private dirty;"}),", not ",(0,i.jsx)(s.code,{children:"private _dirty;"})]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["Make sure that your code is properly type checked:","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"use an IDE that will show type errors"}),"\n",(0,i.jsxs)(s.li,{children:["run ",(0,i.jsx)(s.code,{children:"yarn check-types"})," from the command line"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["Make sure that the tests are still passing:","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["run ",(0,i.jsx)(s.code,{children:"yarn test:unit"})," from the command line"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["Commenting: If your code does something that is not obvious or deviates from standards, leave a comment for other developers to explain your logic and reasoning.","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["Use ",(0,i.jsx)(s.code,{children:"//"})," commenting format unless it's a comment you want people to see in their IDE."]}),"\n",(0,i.jsxs)(s.li,{children:["Use ",(0,i.jsx)(s.code,{children:"/** */"})," commenting format for documenting a function/variable."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.li,{children:"Code white space can be helpful for reading complex code, please add some."}),"\n",(0,i.jsx)(s.li,{children:"For unit tests, we forbid import stubbing when other approaches are feasible."}),"\n",(0,i.jsxs)(s.li,{children:["Metrics are a ",(0,i.jsx)(s.a,{href:"https://www.youtube.com/watch?v=49_qQDbLjGU",children:"critical part of Lodestar"}),", every large feature should be documented with metrics","\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["Metrics need to follow the ",(0,i.jsx)(s.a,{href:"https://prometheus.io/docs/practices/naming/",children:"Prometheus Best Practices"})]}),"\n",(0,i.jsxs)(s.li,{children:["For metric names, make sure to add the unit as suffix, e.g. ",(0,i.jsx)(s.code,{children:"_seconds"})," or ",(0,i.jsx)(s.code,{children:"_bytes"})]}),"\n",(0,i.jsxs)(s.li,{children:["Metric code variables on the other hand should not be suffixed, i.e. ",(0,i.jsx)(s.code,{children:"Sec"}),"-suffix should be omitted"]}),"\n",(0,i.jsx)(s.li,{children:"Time-based metrics must use seconds as the unit"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"tests-style-guide",children:"Tests style guide"}),"\n",(0,i.jsx)(s.p,{children:"Test must not depend on external live resources, such that running tests for a commit must be deterministic:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"Do not pull data from external APIs like execution JSON RPC (instead run a local node)."}),"\n",(0,i.jsx)(s.li,{children:"Do not pull unpinned versions from dockerhub (use deterministic tag) or Github (checkout commit not branch)."}),"\n",(0,i.jsx)(s.li,{children:"Carefully design tests that depend on timing sensitive events like p2p network e2e tests. Consider that Github runners are significantly less powerful than your development environment."}),"\n"]}),"\n",(0,i.jsxs)(s.p,{children:["Add assertion messages where possible to ease fixing tests if they fail. If an assertion message is called from multiple times with the same stack trace, you ",(0,i.jsx)(s.strong,{children:"MUST"})," include an assertion message. For example, if an assertion is inside a for loop add some metadata to be able to locate the error source:"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-ts",children:'for (const blockResult of blocksResult) {\n  expect(blockResult.status).equals("processed", `wrong block ${blockResult.id} result status`);\n}\n'})}),"\n",(0,i.jsx)(s.h2,{id:"logging-policy",children:"Logging policy"}),"\n",(0,i.jsx)(s.h3,{id:"logging-levels",children:"Logging Levels"}),"\n",(0,i.jsx)(s.p,{children:"Contributors must choose the log level carefully to ensure a consistent experience for every type of user:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"error"}),": Critical issues that prevent the application from functioning correctly or cause significant disruption to users. Examples include failed network connections, crashes, or data corruption."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"warn"}),": Situations that may lead to critical issues if not addressed but do not prevent the application from functioning. Examples include configuration issues, deprecated features, or temporary network disruptions."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"info"}),": General sporadic informational about the node's state. Examples include initialization messages, infrequent periodic status updates, or high-level progress reports."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"debug"}),": Detailed diagnostic information that can help developers or users troubleshoot specific issues. Examples include individual request logs for every REST API, networking interactions, or internal components status changes. Alias to ",(0,i.jsx)(s.code,{children:"verbose"}),"."]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"logging-guidelines",children:"Logging guidelines"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"Avoid excessive logging. Log messages should be clear and concise, providing enough information to understand the context and severity of the issue."}),"\n",(0,i.jsx)(s.li,{children:"Do not log sensitive data, such as private keys, user credentials, or personal information."}),"\n",(0,i.jsxs)(s.li,{children:["Do not log arbitrary data from the network as ASCII or UTF8 at levels higher or equal to ",(0,i.jsx)(s.code,{children:"info"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["Use clear and concise language. Prefer to log variables in JSON format ",(0,i.jsx)(s.code,{children:'log.debug("Action", {slot})'})," instead of formatting the text yourself ",(0,i.jsx)(s.code,{children:"log.debug('slot=${slot}')"}),"."]}),"\n",(0,i.jsx)(s.li,{children:"Include only relevant context in log messages, sufficient to debug the issue or action it refers to."}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"contributing-to-grafana-dashboards",children:"Contributing to Grafana dashboards"}),"\n",(0,i.jsx)(s.p,{children:"To edit or extend an existing Grafana dashboard with minimal diff:"}),"\n",(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["Grab the ",(0,i.jsx)(s.code,{children:".json"})," dashboard file from current unstable"]}),"\n",(0,i.jsxs)(s.li,{children:["Import the file to Grafana via the web UI at ",(0,i.jsx)(s.code,{children:"/dashboard/import"})," without modifying the UID of the dashboard"]}),"\n",(0,i.jsx)(s.li,{children:"Visually edit the dashboard"}),"\n",(0,i.jsx)(s.li,{children:"Once done make sure to leave the exact same visual aspect as before: same refresh interval, time range, etc."}),"\n",(0,i.jsx)(s.li,{children:"Save the dashboard (CTRL+S)"}),"\n",(0,i.jsxs)(s.li,{children:["Run download script, see ",(0,i.jsx)(s.a,{href:"#using-download-script",children:"below"})," on how to use it"]}),"\n",(0,i.jsx)(s.li,{children:"Check git diff of updated dashboards, commit, push and open your PR"}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"using-download-script",children:"Using Download Script"}),"\n",(0,i.jsxs)(s.p,{children:["Create a file ",(0,i.jsx)(s.code,{children:".secrets.env"})," with envs"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"GRAFANA_API_KEY=$token\nGRAFANA_URL=https://yourgrafanaapi.io\n"})}),"\n",(0,i.jsxs)(s.p,{children:["Run script to download dashboards to ",(0,i.jsx)(s.code,{children:"./dashboards"})," folder"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"node scripts/download_dashboards.mjs\n"})}),"\n",(0,i.jsx)(s.h2,{id:"contributing-to-documentation",children:"Contributing to Documentation"}),"\n",(0,i.jsxs)(s.p,{children:["When submitting PRs for documentation updates, build and run the documentation locally to ensure functionality before submission. First generate the CLI documentation with ",(0,i.jsx)(s.code,{children:"yarn docs:build"}),". Then build and serve the documentation locally with ",(0,i.jsx)(s.code,{children:"yarn docs:serve"}),"."]}),"\n",(0,i.jsxs)(s.p,{children:["Your locally served documentation will then be accessible at ",(0,i.jsx)(s.a,{href:"http://localhost:3000/lodestar/",children:"http://localhost:3000/lodestar/"}),"."]}),"\n",(0,i.jsxs)(s.p,{children:["We also use a spelling ",(0,i.jsx)(s.a,{href:"https://github.com/ChainSafe/lodestar/blob/unstable/.wordlist.txt",children:"word list"})," as part of our documentation checks. If using unrecognized words or abbreviations, please extend the word list to pass checks. Make sure the list is sorted with ",(0,i.jsx)(s.code,{children:"./scripts/wordlist_sort.sh"})," and checked with ",(0,i.jsx)(s.code,{children:"./scripts/wordlist_sort_check.sh"})," for sorting and duplicates."]}),"\n",(0,i.jsx)(s.h2,{id:"label-guide",children:"Label Guide"}),"\n",(0,i.jsx)(s.p,{children:"Issues and pull requests are subject to the following labeling guidelines."}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["PRs may have a status label to indicate deviation from the normal process such as ",(0,i.jsx)(s.code,{children:"status-blocked"})," or ",(0,i.jsx)(s.code,{children:"status-do-not-merge"})]}),"\n",(0,i.jsxs)(s.li,{children:["Issues and PRs will be tagged with a ",(0,i.jsx)(s.code,{children:"scope"})," and ",(0,i.jsx)(s.code,{children:"prio"})," to indicate type and priority for triage."]}),"\n",(0,i.jsx)(s.li,{children:"All other labels allow for further evaluation and organization."}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"Label descriptions can be found below."}),"\n",(0,i.jsxs)(s.h6,{id:"status-issues-and-pull-request-status",children:[(0,i.jsx)(s.code,{children:"status.*"})," Issues and Pull Request Status"]}),"\n",(0,i.jsx)(s.p,{children:"Status labels apply to issues and pull requests which deviate from normal processes."}),"\n",(0,i.jsxs)(s.h6,{id:"scope-scope-indicator",children:[(0,i.jsx)(s.code,{children:"scope.*"})," Scope Indicator"]}),"\n",(0,i.jsx)(s.p,{children:"Scope is comparable to Module labels but less strict with the definition of components. It applies to both, issues and pull requests."}),"\n",(0,i.jsxs)(s.h6,{id:"prio-prioritization-indicator",children:[(0,i.jsx)(s.code,{children:"prio.*"})," Prioritization Indicator"]}),"\n",(0,i.jsx)(s.p,{children:"A simple indicator of issue prioritization. It mainly applies to issues."}),"\n",(0,i.jsxs)(s.h6,{id:"spec-ethereum-consensus-spec-version-target",children:[(0,i.jsx)(s.code,{children:"spec.*"})," Ethereum Consensus Spec Version Target"]}),"\n",(0,i.jsx)(s.p,{children:"Issues that target a specific version of the Ethereum consensus spec, shall be tagged accordingly."}),"\n",(0,i.jsx)(s.h2,{id:"community",children:"Community"}),"\n",(0,i.jsxs)(s.p,{children:["Come chat with us on ",(0,i.jsx)(s.a,{href:"https://discord.gg/aMxzVcr",children:"Discord"})," and join our public weekly planning meetings!"]})]})}function h(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},8453:(e,s,n)=>{n.d(s,{R:()=>o,x:()=>l});var i=n(6540);const t={},r=i.createContext(t);function o(e){const s=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),i.createElement(r.Provider,{value:s},e.children)}}}]);