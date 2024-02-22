(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[809],{3370:(e,s,i)=>{e.exports={src:{srcSet:i.p+"assets/ideal-img/bundle-size.33ac700.2314.png 2314w",images:[{path:i.p+"assets/ideal-img/bundle-size.33ac700.2314.png",width:2314,height:1462}],src:i.p+"assets/ideal-img/bundle-size.33ac700.2314.png",toString:function(){return i.p+"assets/ideal-img/bundle-size.33ac700.2314.png"},placeholder:void 0,width:2314,height:1462},preSrc:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAp0lEQVR4nG2OsQ4BQRRF59N8k7/Q6lQqHb8hEpWQSBAaEjtid72ZXdbMmyOWRuKU557iGlAg8kak5JJNsdkC533rPpti0ECKTx73Cu8ccrsit5y68sTYfMIUMaQEqjjnOFuLLUpsnpOLUIdAm6aEaeZH1qM+T824FI51ceVQV+wrz947dl6QpsFMhhs64x7jw6B9FDR8v/1iZtsT3eWIpaxaoUlJf8IXTD7kCv+jsZUAAAAASUVORK5CYII="}},6878:(e,s,i)=>{"use strict";i.r(s),i.d(s,{assets:()=>c,contentTitle:()=>d,default:()=>f,frontMatter:()=>l,metadata:()=>h,toc:()=>p});var a=i(1085),n=i(1184),t=i(9722),r=i(3370),o=i.n(r);const l={sidebar_position:1},d="Principles",h={id:"fundamentals/principles",title:"Principles",description:"Flash Calendar was initially built for Moni, the product I work on during my free time. I saw a need for a fast and easy-to-customize package that allowed me to build high-quality and polished date pickers.",source:"@site/docs/fundamentals/principles.mdx",sourceDirName:"fundamentals",slug:"/fundamentals/principles",permalink:"/fundamentals/principles",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"defaultSidebar",previous:{title:"Fundamentals",permalink:"/category/fundamentals"},next:{title:"Usage",permalink:"/fundamentals/usage"}},c={},p=[{value:"Solve fewer needs better",id:"solve-fewer-needs-better",level:2},{value:"Fast",id:"fast",level:2},{value:"Tiny footprint",id:"tiny-footprint",level:2},{value:"Easy to use and customizable",id:"easy-to-use-and-customizable",level:2}];function u(e){const s={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s.h1,{id:"principles",children:"Principles"}),"\n",(0,a.jsxs)(s.p,{children:["Flash Calendar was initially built for ",(0,a.jsx)(s.a,{href:"https://apps.apple.com/br/app/moni-finan%C3%A7as-pessoais/id6462422147",children:"Moni"}),", the product I work on during my free time. I saw a need for a fast and easy-to-customize package that allowed me to build high-quality and polished date pickers."]}),"\n",(0,a.jsxs)(s.p,{children:["The existing solutions at that time didn't cover my needs. The most popular one, ",(0,a.jsx)(s.a,{href:"https://github.com/wix/react-native-calendars",children:(0,a.jsx)(s.code,{children:"react-native-calendars"})})," by Wix, was bloated and filled with polish issues (e.g. months with 6 and 5 weeks had incosistent spacing between each other). After mantaining a patch for that library for more than 3 years, I decided to do things differently this time and build my own solution."]}),"\n",(0,a.jsx)(s.p,{children:"I choose the following principles to guide API decisions and come up with an alternative I was happy with:"}),"\n",(0,a.jsx)(s.h2,{id:"solve-fewer-needs-better",children:"Solve fewer needs better"}),"\n",(0,a.jsxs)(s.p,{children:["After working with ",(0,a.jsx)(s.code,{children:"react-native-calendars"}),", I realized that library tried to do too many things at once. Flash Calendar goes the opposite way. It offers an elegant way of building calendars and calendars lists. Features like an agenda mode are out of scope for this package."]}),"\n",(0,a.jsx)(s.h2,{id:"fast",children:"Fast"}),"\n",(0,a.jsx)(s.p,{children:"Flash Calendar, as the name implies, works at lightening speeds for the use cases it was built for:"}),"\n",(0,a.jsxs)(s.ul,{children:["\n",(0,a.jsx)(s.li,{children:"infinite lists"}),"\n",(0,a.jsx)(s.li,{children:"date picker"}),"\n",(0,a.jsx)(s.li,{children:"date range picker"}),"\n"]}),"\n",(0,a.jsx)(s.p,{children:"As such, it's heavily optimized to avoid unnecessary re-renders:"}),"\n",(0,a.jsx)("video",{controls:!0,width:500,children:(0,a.jsx)("source",{src:"/videos/rerender-demo.mp4",type:"video/mp4"})}),"\n",(0,a.jsxs)(s.p,{children:["From the video above, notice how ",(0,a.jsx)(s.strong,{children:"only the affected dates re-render"}),". This means your component stays responsive no matter how lengthy the calendar list is."]}),"\n",(0,a.jsxs)(s.p,{children:["Besides re-render performance, it's also heavily optimized for scroll performance, all thanks to the excellent ",(0,a.jsx)(s.a,{href:"https://shopify.github.io/flash-list",children:"FlashList"})," foundation (kudos to ",(0,a.jsx)(s.a,{href:"https://www.shopify.com/",children:"Shopify"})," for their incredible OSS work \ud83d\ude4f):"]}),"\n",(0,a.jsx)("video",{controls:!0,width:500,children:(0,a.jsx)("source",{src:"/videos/scroll-performance-demo.mp4",type:"video/mp4"})}),"\n",(0,a.jsxs)(s.p,{children:["Given the ",(0,a.jsx)(s.code,{children:"<Calendar.List />"})," component is ",(0,a.jsx)(s.a,{href:"https://github.com/marceloprado/flash-calendar/blob/06c813b26b2f4527b3eaacaddfa424df26d42e61/packages/flash-calendar/src/components/CalendarList.tsx#L266-L281",children:"just a wrapper"})," around ",(0,a.jsx)(s.code,{children:"FlashList"}),", it inherits all of its performance characteristics. Additionally, all of FlashList's performance tuning guides apply to Flash Calendar as well. You'll fell right at home."]}),"\n",(0,a.jsxs)(s.p,{children:["Finally, Flash Calendar also honors this principle for local development. Developing and writing tests for Flash Calendar should be so fast it makes you smile - in fact, this was the key reason ",(0,a.jsx)(s.a,{href:"https://bun.sh/",children:"Bun"})," was chosen as its test runner and ",(0,a.jsx)(s.a,{href:"https://turbo.build/",children:"Turbo"})," as its monorepo tool."]}),"\n",(0,a.jsx)(s.h2,{id:"tiny-footprint",children:"Tiny footprint"}),"\n",(0,a.jsx)(s.p,{children:"I work for a large company. I know we're not willing to substantially increase our bundle-size. In fact, we seize every oppotunity to decrease it."}),"\n",(0,a.jsxs)(s.p,{children:["Besides, most companies already have their preferred date formatting library. Companies use ",(0,a.jsx)(s.code,{children:"moment"}),", ",(0,a.jsx)(s.code,{children:"date-fns"}),", ",(0,a.jsx)(s.code,{children:"luxon"}),", ",(0,a.jsx)(s.code,{children:"dayjs"})," and others. Flash Calendar shouldn't make an assumption about a particular library - this would add unnecessary bloat to every consumer. Flash Calendar allows you to ",(0,a.jsx)(s.strong,{children:"bring your own date formatting library"}),", giving you full control over how dates are formatted and localized."]}),"\n",(0,a.jsxs)(s.p,{children:["As a result, the library weights just 18.8kb in size (",(0,a.jsx)(s.strong,{children:"6kb gzip"}),"), with a ",(0,a.jsx)(s.a,{href:"https://github.com/developit/mitt",children:"single 200 bytes"})," external dependency:"]}),"\n",(0,a.jsx)(t.A,{img:o(),width:500}),"\n",(0,a.jsx)(s.h2,{id:"easy-to-use-and-customizable",children:"Easy to use and customizable"}),"\n",(0,a.jsx)(s.p,{children:"With Flash Calendar, it's easy to do the right thing. The library offers a\nsimple and intuitive API, and give you full control over the look and feel of your calendars."}),"\n",(0,a.jsxs)(s.p,{children:["Read the ",(0,a.jsx)(s.a,{href:"/fundamentals/customization",children:"Customization"})," section for more details."]})]})}function f(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,a.jsx)(s,{...e,children:(0,a.jsx)(u,{...e})}):u(e)}}}]);