"use strict";(self.webpackChunkmantis_material_react=self.webpackChunkmantis_material_react||[]).push([[78],{5078:(e,a,n)=>{n.r(a),n.d(a,{default:()=>i});var t=n(7313),l=n(1387),s=(n(8282),n(6417));const i=()=>{const[e,a]=(0,t.useState)(""),[n,i]=(0,t.useState)(0),[r,d]=(0,t.useState)("bg-sky-600"),[c,o]=(0,t.useState)("bg-gray-300"),[m,p]=(0,t.useState)(1),[u,h]=(0,t.useState)(""),y=(0,t.useRef)(null),[g,x]=(0,t.useState)([]);let _="",b="",f=0,v=["HigherOrSame","LowerOrSame"];const N=(0,t.useRef)(1),j=(0,t.useRef)(""),k=(0,t.useRef)(0);const S=e=>{console.log("data----\x3e",e._id),y.current.send(JSON.stringify({id:"9dafaba2-98c7-11ee-b9d1-0242ac120002",payload:{query:"mutation ($_id: ID!, $pick: HiloGamePick!) {\n  hiloPick(_id: $_id, pick: $pick) {\n    __typename\n    ... on SinglePlayerGameBet {\n      id\n      isWin\n      multiplier\n      profit\n      amount\n      details {\n        ... on HiloGameDetails {\n          __typename\n          cards\n          picks\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on TowerGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on SinglePlayerGameBetInProgress {\n      _id\n      amount\n      details {\n        ... on HiloGameDetails {\n          __typename\n          cards\n          picks\n        }\n        ... on MinesGameDetails {\n          __typename\n        }\n        ... on DiceGameDetails {\n          __typename\n        }\n        ... on TargetGameDetails {\n          __typename\n        }\n        ... on TowerGameDetails {\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}",variables:{pick:e.pick,_id:e.playId}},type:"subscribe"}))},w=e=>{let a="";for(let n=0;n<e.length;n++)a=a+e[n]+",";return a};return(0,t.useEffect)((()=>(y.current=new WebSocket("wss://bch.games/api/graphql","graphql-transport-ws"),y.current.onopen=()=>{y.current.send(JSON.stringify({type:"connection_init"}))},y.current.onmessage=e=>{const a=JSON.parse(e.data);"2302f5fa-98c0-11ee-b9d1-0242ac120002"===a.id&&a.payload?_=a.payload.data.authenticate.username:"134fa1dd-86c9-4bd4-ae31-2b8d0db16d98"===a.id&&a.payload?a.payload.errors&&"INSUFFICIENT_FUNDS_ERROR"===a.payload.errors[0].message?(0,l.Am)("Not enough BCH",{hideProgressBar:!1,autoClose:2e3,type:"error"}):a.payload.data&&(b=a.payload.data.playHilo._id,S({playId:b,pick:"LowerOrSame"})):"9dafaba2-98c7-11ee-b9d1-0242ac120002"===a.id&&a.payload?(console.log("--------\x3e",a.payload),"SinglePlayerGameBet"===a.payload.data.hiloPick.__typename?(x((e=>[...e,{username:_,data:a.payload.data.hiloPick}])),f<N.current&&(f++,setTimeout((()=>{y.current.send(JSON.stringify({id:"134fa1dd-86c9-4bd4-ae31-2b8d0db16d98",payload:{query:"mutation ($amount: Float!, $card: String!, $clientSeed: String!) {\n  playHilo(amount: $amount, card: $card, clientSeed: $clientSeed) {\n    _id\n    amount\n    details {\n      ... on HiloGameDetails {\n        __typename\n        cards\n        picks\n      }\n      ... on MinesGameDetails {\n        __typename\n      }\n      ... on DiceGameDetails {\n        __typename\n      }\n      ... on TargetGameDetails {\n        __typename\n      }\n      ... on TowerGameDetails {\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",variables:{card:"\u2666K",amount:parseInt(k.current),clientSeed:j.current}},type:"subscribe"}))}),500))):"SinglePlayerGameBetInProgress"===a.payload.data.hiloPick.__typename&&S({playId:b,pick:v[Math.floor(2*Math.random())]})):console.log("response =>",a)},()=>{y.current&&y.current.close()})),[]),(0,t.useEffect)((()=>{N.current=m,j.current=e,k.current=n}),[m,n,e]),(0,s.jsxs)("div",{className:"w-screen",children:[(0,s.jsxs)("div",{className:"inline-flex mb-3",children:[(0,s.jsx)("div",{className:"flex items-center justify-center mr-[70px]",children:(0,s.jsx)("div",{className:"text-[20px]",children:"UserId"})}),(0,s.jsx)("input",{className:"items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100",onChange:function(e){a(e.target.value)}})]}),(0,s.jsxs)("div",{className:"inline-flex w-full mb-3",children:[(0,s.jsx)("div",{className:"flex items-center justify-center mr-[32px]",children:(0,s.jsx)("div",{className:"text-[20px]",children:"UserToken"})}),(0,s.jsx)("input",{className:"items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100",onChange:function(e){h(e.target.value)}})]}),(0,s.jsxs)("div",{className:"inline-flex w-full mb-5",children:[(0,s.jsx)("div",{className:"flex items-center mr-[58px]",children:(0,s.jsx)("div",{className:"text-[20px]",children:"Amount"})}),(0,s.jsx)("input",{className:"items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100",onChange:function(e){i(e.target.value)}})]}),(0,s.jsxs)("div",{className:"inline-flex w-full mb-5",children:[(0,s.jsx)("div",{className:"flex items-center mr-[28px]",children:(0,s.jsx)("div",{className:"text-[20px]",children:"Play Number"})}),(0,s.jsx)("input",{className:"items-center text-sm leading-6 text-black rounded-md ring-1 shadow-sm py-1.5 pl-2 pr-3 hover:ring-white bg-gray-300 dark:highlight-white/5 dark:hover:bg-gray-100",onChange:function(e){p(parseInt(e.target.value))}}),(0,s.jsx)("button",{className:"rounded-full bg-gray-300 hover:bg-gray-500 ml-3",onClick:()=>{(async()=>{""===e?(0,l.Am)("Please input UserID",{hideProgressBar:!1,autoClose:2e3,type:"error"}):0===n?(0,l.Am)("Please input Amount",{hideProgressBar:!1,autoClose:2e3,type:"error"}):""===u?(0,l.Am)("Please input userToken",{hideProgressBar:!1,autoClose:2e3,type:"error"}):(f=0,y.current&&(setTimeout((()=>{y.current.send(JSON.stringify({id:"2302f5fa-98c0-11ee-b9d1-0242ac120002",payload:{query:'{\n  authenticate(\n    authToken: \n"'+u+'"\n  ) {\n    _id\n    username\n    authToken\n    email\n    twoFactorEnabled\n    role\n    countryBlock\n    __typename\n  }\n}',variables:{}},type:"subscribe"}))}),1e3),setTimeout((()=>{y.current.send(JSON.stringify({id:"134fa1dd-86c9-4bd4-ae31-2b8d0db16d98",payload:{query:"mutation ($amount: Float!, $card: String!, $clientSeed: String!) {\n  playHilo(amount: $amount, card: $card, clientSeed: $clientSeed) {\n    _id\n    amount\n    details {\n      ... on HiloGameDetails {\n        __typename\n        cards\n        picks\n      }\n      ... on MinesGameDetails {\n        __typename\n      }\n      ... on DiceGameDetails {\n        __typename\n      }\n      ... on TargetGameDetails {\n        __typename\n      }\n      ... on TowerGameDetails {\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",variables:{card:"\u2666K",amount:parseInt(n),clientSeed:e}},type:"subscribe"}))}),2e3)))})()},children:(0,s.jsx)("div",{className:"mx-[20px]",children:"Play"})})]}),0!=g.length?(0,s.jsx)(s.Fragment,{children:(0,s.jsxs)("div",{className:"table text-[15px] w-full",children:[(0,s.jsx)("div",{className:"table-header-group",children:(0,s.jsxs)("div",{className:"table-row",children:[(0,s.jsx)("div",{className:"table-cell text-left",children:"No"}),(0,s.jsx)("div",{className:"table-cell text-left",children:"User"}),(0,s.jsx)("div",{className:"table-cell text-left",children:"Amount"}),(0,s.jsx)("div",{className:"table-cell text-left",children:"Cards"}),(0,s.jsx)("div",{className:"table-cell text-left",children:"Picks"}),(0,s.jsx)("div",{className:"table-cell text-left",children:"Id"}),(0,s.jsx)("div",{className:"table-cell text-left",children:"Multiplier"}),(0,s.jsx)("div",{className:"table-cell text-left",children:"Profit"})]})}),(0,s.jsx)("div",{className:"table-row-group",children:g.map(((e,a)=>(0,s.jsxs)("div",{className:"table-row",children:[(0,s.jsx)("div",{className:"table-cell",children:a+1}),(0,s.jsx)("div",{className:"table-cell",children:e.username}),(0,s.jsx)("div",{className:"table-cell",children:e.data.amount}),(0,s.jsx)("div",{className:"table-cell",children:w(e.data.details.cards)}),(0,s.jsx)("div",{className:"table-cell",children:w(e.data.details.picks)}),(0,s.jsx)("div",{className:"table-cell",children:e.data.id}),(0,s.jsx)("div",{className:"table-cell",children:e.data.multiplier}),(0,s.jsx)("div",{className:"table-cell",children:e.data.profit})]},a)))})]})}):null,(0,s.jsx)(l.Ix,{})]})}}}]);