"use strict";(self.webpackChunk_lodestar_docs=self.webpackChunk_lodestar_docs||[]).push([[707],{9654:(e,i,l)=>{l.r(i),l.d(i,{assets:()=>d,contentTitle:()=>o,default:()=>a,frontMatter:()=>t,metadata:()=>c,toc:()=>s});var n=l(4848),r=l(8453);const t={title:"CLI Reference"},o="lightclient CLI Command",c={id:"libraries/lightclient-prover/lightclient-cli",title:"CLI Reference",description:"Run lightclient",source:"@site/pages/libraries/lightclient-prover/lightclient-cli.md",sourceDirName:"libraries/lightclient-prover",slug:"/libraries/lightclient-prover/lightclient-cli",permalink:"/lodestar/libraries/lightclient-prover/lightclient-cli",draft:!1,unlisted:!1,editUrl:"https://github.com/ChainSafe/lodestar/tree/unstable/docs/pages/libraries/lightclient-prover/lightclient-cli.md",tags:[],version:"current",frontMatter:{title:"CLI Reference"},sidebar:"tutorialSidebar",previous:{title:"Lodestar Light Client",permalink:"/lodestar/libraries/lightclient-prover/lightclient"},next:{title:"Lodestar Prover",permalink:"/lodestar/libraries/lightclient-prover/prover"}},d={},s=[{value:"Examples",id:"examples",level:2},{value:"<code>lightclient</code> Options",id:"lightclient-options",level:2},{value:"<code>--dataDir</code>",id:"--datadir",level:4},{value:"<code>--network</code>",id:"--network",level:4},{value:"<code>--paramsFile</code>",id:"--paramsfile",level:4},{value:"<code>--terminal-total-difficulty-override</code>",id:"--terminal-total-difficulty-override",level:4},{value:"<code>--terminal-block-hash-override</code>",id:"--terminal-block-hash-override",level:4},{value:"<code>--terminal-block-hash-epoch-override</code>",id:"--terminal-block-hash-epoch-override",level:4},{value:"<code>--logLevel</code>",id:"--loglevel",level:4},{value:"<code>--logFile</code>",id:"--logfile",level:4},{value:"<code>--logFileLevel</code>",id:"--logfilelevel",level:4},{value:"<code>--logFileDailyRotate</code>",id:"--logfiledailyrotate",level:4},{value:"<code>--beaconApiUrl</code>",id:"--beaconapiurl",level:4},{value:"<code>--checkpointRoot</code>",id:"--checkpointroot",level:4}];function h(e){const i={code:"code",h1:"h1",h2:"h2",h4:"h4",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(i.h1,{id:"lightclient-cli-command",children:[(0,n.jsx)(i.code,{children:"lightclient"})," CLI Command"]}),"\n",(0,n.jsx)(i.p,{children:"Run lightclient"}),"\n",(0,n.jsx)(i.h2,{id:"examples",children:"Examples"}),"\n",(0,n.jsx)(i.p,{children:"Run lightclient with holesky network"}),"\n",(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{className:"language-sh",children:"./lodestar lightclient --network holesky\n"})}),"\n",(0,n.jsxs)(i.h2,{id:"lightclient-options",children:[(0,n.jsx)(i.code,{children:"lightclient"})," Options"]}),"\n",(0,n.jsx)(i.h4,{id:"--datadir",children:(0,n.jsx)(i.code,{children:"--dataDir"})}),"\n",(0,n.jsx)(i.p,{children:"Lodestar root data directory"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.h4,{id:"--network",children:(0,n.jsx)(i.code,{children:"--network"})}),"\n",(0,n.jsx)(i.p,{children:"Name of the Ethereum Consensus chain network to join"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.p,{children:'choices: "mainnet", "gnosis", "sepolia", "holesky", "chiado", "ephemery", "mekong", "dev"'}),"\n",(0,n.jsxs)(i.p,{children:["default: ",(0,n.jsx)(i.code,{children:'"mainnet"'})]}),"\n",(0,n.jsx)(i.h4,{id:"--paramsfile",children:(0,n.jsx)(i.code,{children:"--paramsFile"})}),"\n",(0,n.jsx)(i.p,{children:"Network configuration file"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.h4,{id:"--terminal-total-difficulty-override",children:(0,n.jsx)(i.code,{children:"--terminal-total-difficulty-override"})}),"\n",(0,n.jsx)(i.p,{children:"Terminal PoW block TTD override"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.h4,{id:"--terminal-block-hash-override",children:(0,n.jsx)(i.code,{children:"--terminal-block-hash-override"})}),"\n",(0,n.jsx)(i.p,{children:"Terminal PoW block hash override"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.h4,{id:"--terminal-block-hash-epoch-override",children:(0,n.jsx)(i.code,{children:"--terminal-block-hash-epoch-override"})}),"\n",(0,n.jsx)(i.p,{children:"Terminal PoW block hash override activation epoch"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.h4,{id:"--loglevel",children:(0,n.jsx)(i.code,{children:"--logLevel"})}),"\n",(0,n.jsx)(i.p,{children:"Logging verbosity level for emitting logs to terminal"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.p,{children:'choices: "error", "warn", "info", "verbose", "debug", "trace"'}),"\n",(0,n.jsxs)(i.p,{children:["default: ",(0,n.jsx)(i.code,{children:'"info"'})]}),"\n",(0,n.jsx)(i.h4,{id:"--logfile",children:(0,n.jsx)(i.code,{children:"--logFile"})}),"\n",(0,n.jsx)(i.p,{children:"Path to output all logs to a persistent log file, use 'none' to disable"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.h4,{id:"--logfilelevel",children:(0,n.jsx)(i.code,{children:"--logFileLevel"})}),"\n",(0,n.jsx)(i.p,{children:"Logging verbosity level for emitting logs to file"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.p,{children:'choices: "error", "warn", "info", "verbose", "debug", "trace"'}),"\n",(0,n.jsxs)(i.p,{children:["default: ",(0,n.jsx)(i.code,{children:'"debug"'})]}),"\n",(0,n.jsx)(i.h4,{id:"--logfiledailyrotate",children:(0,n.jsx)(i.code,{children:"--logFileDailyRotate"})}),"\n",(0,n.jsx)(i.p,{children:"Daily rotate log files, set to an integer to limit the file count, set to 0 (zero) to disable rotation"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"number"})]}),"\n",(0,n.jsxs)(i.p,{children:["default: ",(0,n.jsx)(i.code,{children:"5"})]}),"\n",(0,n.jsx)(i.h4,{id:"--beaconapiurl",children:(0,n.jsx)(i.code,{children:"--beaconApiUrl"})}),"\n",(0,n.jsx)(i.p,{children:"Url to a beacon node that support lightclient API"}),"\n",(0,n.jsx)(i.p,{children:"required: true"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]}),"\n",(0,n.jsx)(i.h4,{id:"--checkpointroot",children:(0,n.jsx)(i.code,{children:"--checkpointRoot"})}),"\n",(0,n.jsx)(i.p,{children:"Checkpoint root hex string to sync the lightclient from, start with 0x"}),"\n",(0,n.jsx)(i.p,{children:"required: true"}),"\n",(0,n.jsxs)(i.p,{children:["type: ",(0,n.jsx)(i.code,{children:"string"})]})]})}function a(e={}){const{wrapper:i}={...(0,r.R)(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},8453:(e,i,l)=>{l.d(i,{R:()=>o,x:()=>c});var n=l(6540);const r={},t=n.createContext(r);function o(e){const i=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function c(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),n.createElement(t.Provider,{value:i},e.children)}}}]);