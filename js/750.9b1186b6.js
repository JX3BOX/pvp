"use strict";(self["webpackChunkpvp"]=self["webpackChunkpvp"]||[]).push([[750],{73750:function(t,a,e){e.r(a),e.d(a,{default:function(){return Pa}});var n=e(66252);const o={class:"m-pvp-sandbox-content"},i={class:"m-extend"},p={class:"m-strategy-box"},s=(0,n._)("b",null,"沙盘攻略",-1),l=(0,n._)("b",null,"沙盘记录",-1);function r(t,a,e,r,u,g){const c=(0,n.up)("SandboxIndex"),d=(0,n.up)("SandboxIntro"),m=(0,n.up)("Collection"),x=(0,n.up)("el-icon"),f=(0,n.up)("SandboxHandbook"),h=(0,n.up)("el-tab-pane"),v=(0,n.up)("DataAnalysis"),_=(0,n.up)("SandboxLogs"),b=(0,n.up)("el-tabs"),L=(0,n.up)("ListLayout");return(0,n.wg)(),(0,n.j4)(L,{"has-right":!1},{default:(0,n.w5)((()=>[(0,n._)("div",o,[(0,n.Wm)(c,{onSandboxChangeKey:g.onSandboxLogs},null,8,["onSandboxChangeKey"]),(0,n._)("div",i,[(0,n._)("div",p,[(0,n.Wm)(d)]),(0,n.Wm)(b,{class:"m-tabs",modelValue:t.view,"onUpdate:modelValue":a[0]||(a[0]=a=>t.view=a)},{default:(0,n.w5)((()=>[(0,n.Wm)(h,{label:"沙盘攻略",name:"index"},{label:(0,n.w5)((()=>[(0,n.Wm)(x,null,{default:(0,n.w5)((()=>[(0,n.Wm)(m)])),_:1}),s])),default:(0,n.w5)((()=>[(0,n.Wm)(f)])),_:1}),(0,n.Wm)(h,{label:"沙盘记录",name:"logs"},{label:(0,n.w5)((()=>[(0,n.Wm)(x,null,{default:(0,n.w5)((()=>[(0,n.Wm)(v)])),_:1}),l])),default:(0,n.w5)((()=>[(0,n.Wm)(_,{sandboxData:t.sandboxLogsData},null,8,["sandboxData"])])),_:1})])),_:1},8,["modelValue"])])])])),_:1})}var u=e(24239),g=e(61787);const c={class:"m-pvp-sandbox__content",ref:"sandboxMap"},d={class:"m-sandbox-map"};function m(t,a,e,o,i,p){const s=(0,n.up)("sandboxSearch"),l=(0,n.up)("sandboxMaps"),r=(0,n.up)("sandboxLog");return(0,n.wg)(),(0,n.iD)("div",c,[(0,n.Wm)(s,{servers:t.servers,onSandboxChange:p.onSandbox},null,8,["servers","onSandboxChange"]),(0,n._)("div",d,[(0,n.Wm)(l,{maps:t.sandMaps,camp:t.camp,route:t.route,onMapClick:p.mapClick},null,8,["maps","camp","route","onMapClick"]),t.showLog?((0,n.wg)(),(0,n.j4)(r,{key:0,item:t.itemLog},null,8,["item"])):(0,n.kq)("",!0)]),t.showLog?((0,n.wg)(),(0,n.iD)("div",{key:0,class:"m-mask",onClick:a[0]||(a[0]=(...t)=>p.closeLog&&p.closeLog(...t))})):(0,n.kq)("",!0)],512)}var x=e(60490),f=e(3577);const h={class:"m-sandbox-search"},v=["onClick"];function _(t,a,e,o,i,p){const s=(0,n.up)("el-switch"),l=(0,n.up)("el-option"),r=(0,n.up)("el-select");return(0,n.wg)(),(0,n.iD)("div",h,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.camps,((a,e)=>((0,n.wg)(),(0,n.iD)("span",{class:"u-camp",key:e,onClick:t=>p.changeCamp(e)},[(0,n._)("b",{class:(0,f.C_)(e==t.camp?"active":"")},null,2),(0,n._)("span",null,(0,f.zw)(a),1)],8,v)))),128)),(0,n.Wm)(s,{class:"u-route",modelValue:t.route,"onUpdate:modelValue":a[0]||(a[0]=a=>t.route=a),"inactive-text":"进攻路线"},null,8,["modelValue"]),(0,n.Wm)(r,{class:"u-server",modelValue:t.server,"onUpdate:modelValue":a[1]||(a[1]=a=>t.server=a)},{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e.servers,(t=>((0,n.wg)(),(0,n.j4)(l,{key:t,label:t,value:t},null,8,["label","value"])))),128))])),_:1},8,["modelValue"])])}var b={name:"SandboxSearch",props:["servers"],data:function(){return{server:this.servers[0]||"",camp:"haoqi",camps:{haoqi:"浩气盟",eren:"恶人谷"},route:!0}},computed:{serverData:function(){return{server:this.server,route:this.route,camp:this.camp}}},watch:{serverData:{handler(){this.toEmit()},deep:!0,immediate:!0}},methods:{changeCamp(t){this.camp=t},toEmit:function(){this.$emit("sandboxChange",this.serverData)}}},L=e(83744);const w=(0,L.Z)(b,[["render",_]]);var y=w;const k={class:"m-sandboxMap"},D=(0,n._)("div",{class:"u-mapLine"},null,-1),S=["src"],M=["src"],H=["src"],C=["onClick","onMousemove"],W=["src"],P=["src"],Y=["src"],B=["src"],G={key:0,class:"u-box"},F=["src"],Z={class:"u-txt"},K={class:"u-line"},q={class:"u-camp"},z={class:"u-line"},J=(0,n._)("span",null,"占领势力：",-1),Q=(0,n._)("i",{class:"el-icon-date"},null,-1),j=[Q];function V(t,a,e,o,i,p){const s=(0,n.up)("el-popover");return(0,n.wg)(),(0,n.iD)("div",k,[D,((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.camps,(t=>((0,n.wg)(),(0,n.iD)("div",{key:t.key},[(0,n._)("img",{class:"u-pic",src:p.imgPath(t.id,t.name,"pic"),style:(0,f.j5)(p.positionStyle(t.name,"pic"))},null,12,S),(0,n._)("img",{class:"u-icon",src:p.imgPath(t.key,t.name,"camp"),style:(0,f.j5)([p.positionStyle(t.name,"icon"),{cursor:"default"}])},null,12,M),(0,n._)("div",{class:"u-name",style:(0,f.j5)(p.positionStyle(t.name,"name"))},(0,f.zw)(t.names),5)])))),128)),e.maps.list&&e.maps.list.length>0?((0,n.wg)(!0),(0,n.iD)(n.HY,{key:0},(0,n.Ko)(e.maps.list,(t=>((0,n.wg)(),(0,n.iD)("div",{key:t.id},[(0,n._)("img",{class:"u-pic",src:p.imgPath(t.id,t.camp,"pic"),style:(0,f.j5)(p.positionStyle(t.name_pinyin,"pic"))},null,12,H),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e.maps.list,((t,e)=>((0,n.wg)(),(0,n.iD)("div",{class:"u-icon",style:(0,f.j5)(p.positionStyle(t.name_pinyin,"icon")),key:e},[(0,n._)("div",{onClick:a=>p.showLog(t),ref_for:!0,ref:a=>p.setRefs(a,t),onMousemove:a=>p.showPopover(t),onMouseleave:a[0]||(a[0]=(...t)=>p.hidePopover&&p.hidePopover(...t))},[(0,n._)("img",{src:p.imgPath(t.id,t.camp,"icon")},null,8,W)],40,C)],4)))),128)),(0,n._)("div",{class:"u-name",style:(0,f.j5)(p.positionStyle(t.name_pinyin,"name"))},(0,f.zw)(t.name),5)])))),128)):(0,n.kq)("",!0),e.maps.detail&&e.maps.detail.length?((0,n.wg)(!0),(0,n.iD)(n.HY,{key:1},(0,n.Ko)(e.maps.detail,(t=>((0,n.wg)(),(0,n.iD)("div",{class:"detail",key:t.id},[(0,n._)("img",{class:"u-camps",src:p.imgPath(t.name_pinyin,e.camp,"camp"),style:(0,f.j5)(p.positionStyle(t.name_pinyin,"camp"))},null,12,P),e.route?((0,n.wg)(),(0,n.iD)(n.HY,{key:0},[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.castles,(t=>((0,n.wg)(),(0,n.iD)("div",{key:t.id},[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.attacks,(a=>((0,n.wg)(),(0,n.iD)("img",{key:a.id,class:"u-attacks",src:p.imgPath(a,e.camp,"arr"),style:(0,f.j5)(p.positionStyle(t.name_pinyin,"arr",a.name_pinyin))},null,12,Y)))),128))])))),128)),t.attacks&&0!==t.attacks.length?((0,n.wg)(!0),(0,n.iD)(n.HY,{key:0},(0,n.Ko)(t.attacks,(a=>((0,n.wg)(),(0,n.iD)("div",{key:a.id},[(0,n._)("img",{class:"u-attacks",src:p.imgPath(a,e.camp,"attacks"),style:(0,f.j5)(p.positionStyle(t.name_pinyin,"attacks",a.name_pinyin))},null,12,B)])))),128)):(0,n.kq)("",!0)],64)):(0,n.kq)("",!0)])))),128)):(0,n.kq)("",!0),(0,n.Wm)(s,{visible:t.visiblePopover,"onUpdate:visible":a[2]||(a[2]=a=>t.visiblePopover=a),"virtual-ref":t.activeRef,trigger:"manual",width:"240","virtual-triggering":"",placement:"top-start","show-arrow":!1},{default:(0,n.w5)((()=>[t.active?((0,n.wg)(),(0,n.iD)("div",G,[(0,n._)("img",{src:p.imgPath(t.active.name_pinyin,t.active.camp,"camp")},null,8,F),(0,n._)("div",Z,[(0,n._)("div",K,[(0,n._)("span",q,(0,f.zw)(t.active.name),1)]),(0,n._)("div",z,[J,(0,n._)("span",{class:(0,f.C_)(t.active.camp)},"【"+(0,f.zw)("haoqi"==t.active.camp?"浩气盟":"恶人谷")+"】",3)])]),(0,n._)("div",{class:"u-log",onClick:a[1]||(a[1]=a=>p.showLog(t.active))},j)])):(0,n.kq)("",!0)])),_:1},8,["visible","virtual-ref"])])}e(57658);var R=e(2262),A=e(89847);const T=A.__imgPath,{placeArr:N,placeAttacks:I,placeCamp:X,placeImg:E,placeName:U}=e(49120);var $={name:"SandBoxMaps",props:["maps","camp","route"],data:function(){return{camps:[{id:27,name:"eren",names:"恶人谷",key:"erengu"},{id:25,name:"haoqi",names:"浩气盟",key:"haoqimeng"}],active:"",activeRef:(0,R.iH)(null),visiblePopover:!1,refMap:[]}},methods:{setRefs:function(t,a){t&&this.refMap.push({ref:t,item:a})},showPopover:function(t){const a=this.refMap.findIndex((a=>a.item.id===t.id));this.activeRef=this.refMap[a].ref,this.active=t,this.visiblePopover=!0},hidePopover:function(){this.visiblePopover=!1},imgPath(t,a,e){switch(e){case"pic":return"haoqi"==a?T+"image/camp/h"+t+".png":T+"image/camp/e"+t+".png";case"camp":return T+"image/camp/"+t+".png";case"icon":return"haoqi"==a?T+"image/camp/h"+this.icon(t)+".png":T+"image/camp/e"+this.icon(t)+".png";case"arr":case"attacks":return"haoqi"==a?T+"image/camp/charr.png":T+"image/camp/cearr.png";default:return""}},positionStyle(t,a,e){switch(a){case"pic":return E[t];case"camp":return X[t];case"icon":return U[t];case"name":{let{left:a,top:e}=U[t];return"LinFengBao"!=t&&"WuWangCheng"!=t||(a=this.pixel(a,15)),"eren"!=t&&"haoqi"!=t||(a=this.pixel(a,40)),a=this.pixel(a,45),e=this.pixel(e,-10),{left:a,top:e}}case"attacks":return I[t][e];case"arr":return N[t][e];default:return"default"}},icon(t){switch(t){case 301:return"_lingfengbao";case 221:return"_wuwangcheng";case 231:case 1031:case 92:case 1002:return"02";case 1392:case 212:case 1012:case 1001:return"03";case 131:case 1042:case 1051:case 351:return"04";case 211:case 1531:return"05";default:return"01"}},pixel(t,a){let e=t.substr(0,t.length-2);return t=+e+a,t+"px"},showLog(t){t.img=T+"image/camp/"+t.name_pinyin+".png",this.$emit("mapClick",t)}}};const O=(0,L.Z)($,[["render",V]]);var tt=O;const at={key:0,class:"m-sandbox-log"},et={class:"m-log-box"},nt={class:"m-box-info"},ot=["src"],it={class:"u-box"},pt={class:"u-title"},st={class:"u-desc"},lt=["href"],rt={key:0,class:"u-cont",style:{overflow:"auto"}},ut={class:"u-line"},gt={class:"u-time"},ct={class:"u-line"},dt=(0,n._)("span",null,"占领势力：",-1),mt={class:"u-line"},xt=(0,n._)("span",null,"占领帮会：",-1),ft={key:1,class:"u-cont"},ht=(0,n._)("div",{class:"u-nonedata"},"暂无数据",-1),vt=[ht];function _t(t,a,e,o,i,p){var s,l;return e.item?((0,n.wg)(),(0,n.iD)("div",at,[(0,n._)("div",et,[(0,n._)("div",nt,[(0,n._)("img",{class:"u-img",src:e.item.img},null,8,ot),(0,n._)("div",it,[(0,n._)("span",pt,(0,f.zw)(e.item.name),1),(0,n._)("span",st,(0,f.zw)(e.item.desc||"暂无介绍"),1),(0,n._)("a",{class:"u-baike",href:e.item.link,target:"_blank"},"查看百科 »",8,lt)])]),null!==(s=e.item)&&void 0!==s&&null!==(l=s.list)&&void 0!==l&&l.length?((0,n.wg)(),(0,n.iD)("ul",rt,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e.item.list,((t,a)=>((0,n.wg)(),(0,n.iD)("li",{key:a},[(0,n._)("div",ut,[(0,n._)("span",gt,(0,f.zw)(t.date),1)]),(0,n._)("div",ct,[dt,(0,n._)("span",{class:(0,f.C_)(t.camp)},"["+(0,f.zw)("haoqi"==t.camp?"浩气盟":"恶人谷")+"]",3)]),(0,n._)("div",mt,[xt,(0,n._)("span",{class:(0,f.C_)(t.camp)},(0,f.zw)(t.gang),3)])])))),128))])):((0,n.wg)(),(0,n.iD)("div",ft,vt))])])):(0,n.kq)("",!0)}var bt={name:"SandBoxLog",props:["item"],data:function(){return{}},methods:{}};const Lt=(0,L.Z)(bt,[["render",_t]]);var wt=Lt,yt=JSON.parse('["蝶恋花","龙争虎斗","长安城","幽月轮","斗转星移","剑胆琴心","乾坤一掷","唯我独尊","梦江南","绝代天骄","天鹅坪","破阵子","飞龙在天","青梅煮酒","共結來緣","傲血戰意","巔峰再起","江海雲夢"]'),kt=e(18371);function Dt(t){return(0,kt.c)().get("/api/sandmap",{params:t}).then((t=>t.data))}function St(t=1,a=1){return(0,kt.Ac)().get(`/api/sandmap/${t}/castle/${a}/logs`).then((t=>t.data))}function Mt(t){return(0,kt.nj)().get("/api/cms/posts",{params:t}).then((t=>t.data.data.list))}var Ht={name:"SandBox",components:{sandboxSearch:y,sandboxMaps:tt,sandboxLog:wt},data:function(){return{sandMaps:{},servers:yt,itemLog:"",showLog:!1,server:yt[0]||""}},computed:{parms:function(){return{server:this.server,camp:this.camp}}},mounted(){(0,x.i9H)(this.$refs.sandboxMap,(()=>{this.showLog&&(this.showLog=!1)}))},methods:{onSandbox(t){let{server:a,camp:e,route:n}=t;this.server=a,this.camp=e,this.route=n,this.getSandbox(),this.$emit("sandboxChangeKey",a)},getSandbox(){Dt(this.parms).then((t=>{this.sandMaps={list:t.data.castles}}))},mapClick(t){St(this.id,t.id).then((a=>{t.list=a.data.data,this.itemLog=t,this.showLog=!0}))},closeLog(){this.showLog=!1}},created:function(){this.getSandbox()}};const Ct=(0,L.Z)(Ht,[["render",m]]);var Wt=Ct;const Pt={class:"m-sandbox-logs"},Yt={class:"m-log-box"},Bt={class:"m-box-info"},Gt=["innerHTML"],Ft={class:"u-title"},Zt={key:0,class:"u-desc"};function Kt(t,a,e,o,i,p){var s;return(0,n.wg)(),(0,n.iD)("div",Pt,[(0,n._)("div",Yt,[(0,n._)("div",Bt,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e.sandboxData,((t,a)=>((0,n.wg)(),(0,n.iD)("div",{class:"u-box",key:a},[(0,n._)("span",{class:"u-desc",innerHTML:p.toLogText(t.content)},null,8,Gt),(0,n._)("span",Ft,(0,f.zw)(p.ToDate(t.time)),1)])))),128)),(null===(s=e.sandboxData)||void 0===s?void 0:s.length)<1?((0,n.wg)(),(0,n.iD)("span",Zt,"暂无记录")):(0,n.kq)("",!0)])])])}const qt=(t,a="yyyy-mm-dd MM:mm:ss")=>{let e=new Date(isNaN(t)?t:Number(t)),n=e.getMonth()+1,o=e.getDate(),i=e.getHours(),p=e.getMinutes(),s=e.getSeconds();n>=1&&n<=9&&(n="0"+n),o>=0&&o<=9&&(o="0"+o),i>=0&&i<=9&&(i="0"+i),p>=0&&p<=9&&(p="0"+p),s>=0&&s<=9&&(s="0"+s);let l=e.getFullYear()+"年"+(e.getMonth()+1)+"月"+e.getDate()+"日";return"yyyy-mm-dd"==a&&(l=e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()),"yyyy.mm.dd"==a&&(l=e.getFullYear()+"."+(e.getMonth()+1)+"."+e.getDate()),"yyyy-mm-dd MM:mm:ss"==a&&(l=e.getFullYear()+"-"+n+"-"+o+" "+i+":"+p+":"+s),"yyyy-mm-dd MM:mm"==a&&(l=e.getFullYear()+"-"+n+"-"+o+" "+i+":"+p),"mm-dd MM:mm:ss"==a&&(l=n+"-"+o+" "+i+":"+p+":"+s),"yyyy年mm月dd日 MM:mm:ss"==a&&(l=e.getFullYear()+"年"+n+"月"+o+"日 "+i+":"+p+":"+s),l};var zt={name:"sendbox_handbook",props:["sandboxData"],data:function(){return{item:{list:[]}}},methods:{ToDate(t){let a=Number(t+"000");return qt(a,"yyyy-mm-dd MM:mm")},toLogText(t){let a=t.split("贡献前三名的帮会将均分"),e=a?a[0].split("感谢他们为阵营的付出")[0]:t,n=e.replaceAll("浩气盟","<i class='sandbox-em-hq'>浩气盟</i>").replaceAll("恶人谷","<i class='sandbox-em-er'>恶人谷</i>"),o=n.replaceAll("【","<i class='sandbox-em-point'>【").replaceAll("】","】</i>");return o}},created(){}};const Jt=(0,L.Z)(zt,[["render",Kt],["__scopeId","data-v-371b331a"]]);var Qt=Jt;const jt={class:"m-sandbox-handbook"},Vt={class:"m-log-box"},Rt={key:0,class:"u-list"},At=["href","target"],Tt=["src"],Nt=["src","alt","title"],It={key:0,class:"u-label u-zlp"},Xt=["href","target"],Et={key:1,class:"u-marks"},Ut={class:"u-content u-desc"},$t={class:"u-metalist u-collection"},Ot=(0,n._)("strong",null,"小册",-1),ta=["href"],aa={class:"u-metalist u-topics"},ea=(0,n._)("strong",null,"主题",-1),na=["href"],oa={class:"u-misc"},ia=["src","alt"],pa=["href"],sa={class:"u-date"};function la(t,a,e,o,i,p){const s=(0,n.up)("el-pagination"),l=(0,n.Q2)("loading");return(0,n.wg)(),(0,n.iD)("div",jt,[(0,n.wy)(((0,n.wg)(),(0,n.iD)("div",Vt,[t.handbookList.length?((0,n.wg)(),(0,n.iD)("ul",Rt,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.handbookList,(t=>((0,n.wg)(),(0,n.iD)("li",{class:"u-item",key:t.ID},[(0,n._)("a",{class:"u-banner",href:p.postLink(t.ID),target:e.target},[((0,n.wg)(),(0,n.iD)("img",{src:p.getBanner(t.post_banner,t.post_subtype),key:t.ID},null,8,Tt)),(0,n._)("span",{class:(0,f.C_)(["u-subject",p.subject(t)||"ALL"])},(0,f.zw)(p.subject(t)||"ALL"),3)],8,At),(0,n._)("h2",{class:(0,f.C_)(["u-post",{isSticky:t.sticky}])},[(0,n._)("img",{class:"u-icon",src:p.xficon(t.post_subtype),alt:t.post_subtype,title:t.post_subtype},null,8,Nt),t.zlp?((0,n.wg)(),(0,n.iD)("span",It,(0,f.zw)(t.zlp),1)):(0,n.kq)("",!0),(0,n._)("a",{class:"u-title",style:(0,f.j5)(p.showHighlight(t.color)),href:p.postLink(t.ID),target:e.target},(0,f.zw)(t.post_title||"无标题"),13,Xt),t.mark&&t.mark.length?((0,n.wg)(),(0,n.iD)("span",Et,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(t.mark,(t=>((0,n.wg)(),(0,n.iD)("i",{class:"u-mark",key:t},(0,f.zw)(p.showMark(t)),1)))),128))])):(0,n.kq)("",!0)],2),(0,n._)("div",Ut,[(0,n._)("div",$t,[Ot,(0,n._)("em",null,[~~t.post_collection?((0,n.wg)(),(0,n.iD)("a",{key:0,href:`/collection/${t.post_collection}`,target:"_blank"},"《"+(0,f.zw)(t.collection_info&&t.collection_info.title)+"》",9,ta)):((0,n.wg)(),(0,n.iD)(n.HY,{key:1},[(0,n.Uk)("-")],64))])]),(0,n._)("div",aa,[ea,(0,n._)("em",null,[t.topics&&t.topics.length?((0,n.wg)(!0),(0,n.iD)(n.HY,{key:0},(0,n.Ko)(t.topics,(t=>((0,n.wg)(),(0,n.iD)("a",{class:"u-topic",href:`/bps?topic=${t}`,key:t},(0,f.zw)(t),9,na)))),128)):((0,n.wg)(),(0,n.iD)(n.HY,{key:1},[(0,n.Uk)("-")],64))])])]),(0,n._)("div",oa,[(0,n._)("img",{class:"u-author-avatar",src:p.showAvatar(t.author_info),alt:p.showNickname(t.author_info)},null,8,ia),(0,n._)("a",{class:"u-author-name",href:p.authorLink(t.post_author),target:"_blank"},(0,f.zw)(p.showNickname(t.author_info)),9,pa),(0,n._)("span",sa,[(0,n.Uk)(" Updated on "),(0,n._)("time",null,(0,f.zw)(p.dateFormat(t.post_modified)),1)])])])))),128))])):(0,n.kq)("",!0),(0,n.Wm)(s,{modelValue:t.page,"onUpdate:modelValue":a[0]||(a[0]=a=>t.page=a),"hide-on-single-page":"",class:"u-pagination",small:"",background:"",layout:"prev, pager, next","page-size":t.per,total:t.total},null,8,["modelValue","page-size","total"])])),[[l,t.loading]])])}var ra=e(69876),ua=e(27484),ga=e.n(ua),ca=e(17233),da=e(91254),ma=e(23910),xa=e(37412),fa=e.n(xa),ha=e(79212),va=e.n(ha);ga().extend(fa()),ga().extend(va());var _a={name:"sendbox_handbook",props:{target:{type:String,default:"_blank"}},data:function(){return{handbookList:[],loading:!0,per:10,page:1,total:0}},computed:{...(0,ra.rn)(u.o,["client"]),params(){return{per:this.per,page:this.page,type:"bps",order:"update",client:this.client,topic:"小攻防"}}},methods:{authorLink:ca.authorLink,async initHandbookList(){try{this.loading=!0;let t=await Mt(this.params);this.handbookList=t}catch(t){console.log(t)}finally{this.loading=!1}},getBanner:function(t,a){if(t)return(0,ca.showBanner)(t);{var e;let t=a&&(null===(e=da[a])||void 0===e?void 0:e["id"])||0;return A.__imgPath+"image/bps_thumbnail/"+t+".png"}},showAvatar(t){return(0,ca.showAvatar)(null===t||void 0===t?void 0:t.user_avatar)},showNickname(t){return(null===t||void 0===t?void 0:t.display_name)||"匿名"},showMark:function(t){return ma.I[t]||t},postLink(t){return location.origin+"/bps/"+t},dateFormat(t){return ga()(new Date(t)).format("YYYY-MM-DD")},xficon:function(t){t&&"其它"!=t||(t="通用");let a=da[t]&&da[t]["id"];return A.__imgPath+"image/xf/"+a+".png"},showHighlight:function(t){return t?`color:${t};font-weight:600;`:""},subject:function(t){var a,e,n,o;let i="";return null!==(a=t.tags)&&void 0!==a&&a.includes("PVE")&&null!==(e=t.tags)&&void 0!==e&&e.includes("PVP")?i="ALL":null!==(n=t.tags)&&void 0!==n&&n.includes("PVE")?i="PVE":null!==(o=t.tags)&&void 0!==o&&o.includes("PVP")&&(i="PVP"),i}},created(){this.initHandbookList()}};const ba=(0,L.Z)(_a,[["render",la]]);var La=ba;const wa={class:"m-sandbox-intro"},ya=["innerHTML"];function ka(t,a,e,o,i,p){const s=(0,n.up)("el-icon"),l=(0,n.up)("el-tab-pane"),r=(0,n.up)("el-tabs"),u=(0,n.Q2)("loading");return(0,n.wy)(((0,n.wg)(),(0,n.iD)("div",wa,[(0,n.Wm)(r,{modelValue:t.active,"onUpdate:modelValue":a[0]||(a[0]=a=>t.active=a)},{default:(0,n.w5)((()=>[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(p.tabs,(a=>((0,n.wg)(),(0,n.j4)(l,{key:a.name,label:a.label,name:a.name},{label:(0,n.w5)((()=>[(0,n.Wm)(s,{class:"u-tab-icon"},{default:(0,n.w5)((()=>[((0,n.wg)(),(0,n.j4)((0,n.LL)(t.icons[a.name])))])),_:2},1024),(0,n._)("b",null,(0,f.zw)(a.label),1)])),default:(0,n.w5)((()=>[(0,n._)("div",{innerHTML:null===a||void 0===a?void 0:a.html},null,8,ya)])),_:2},1032,["label","name"])))),128))])),_:1},8,["modelValue"])])),[[u,t.loading]])}var Da=e(10910),Sa={name:"SandboxIntro",props:[],components:{},data:function(){return{loading:!1,data:[],active:"",icons:(0,R.Xl)({pvp_sandbox_intro:"Compass",pvp_sandbox_rule:"DataBoard",pvp_sandbox_background:"Monitor",pvp_sandbox_base:"LocationInformation",pvp_sandbox_gameplay:"Cpu",pvp_sandbox_tree:"Grape",pvp_sandbox_model:"Apple"})}},computed:{tabs(){return this.data.map((t=>({name:t.name,label:t.label,html:t.html})))}},watch:{tabs:{handler(){this.active=this.tabs[0].name},deep:!0}},mounted(){this.loadData()},methods:{loadData(){this.loading=!0;const t="pvp_sandbox_intro,pvp_sandbox_rule,pvp_sandbox_base,pvp_sandbox_gameplay,pvp_sandbox_tree,pvp_sandbox_model";(0,Da.Sj)({key:t}).then((t=>{this.data=t.data.data||[]})).finally((()=>{this.loading=!1}))}}};const Ma=(0,L.Z)(Sa,[["render",ka]]);var Ha=Ma,Ca={name:"SandBoxPage",components:{SandboxIndex:Wt,ListLayout:g.Z,SandboxLogs:Qt,SandboxHandbook:La,SandboxIntro:Ha},data:function(){return{view:"index",sandboxLogsData:[]}},computed:{client(){return(0,u.o)().client},params:function(){return{sandmap_id:this.id,camp:this.camp}}},methods:{async onSandboxLogs(t="斗转星移"){let a=await(0,Da.Pb)({server:t});this.sandboxLogsData=a.data?a.data.list:[]}},mounted(){this.onSandboxLogs()}};const Wa=(0,L.Z)(Ca,[["render",r]]);var Pa=Wa},49120:function(t){t.exports=JSON.parse('{"placeImg":{"eren":{"left":"72px","top":"10px"},"haoqi":{"left":"683px","top":"523px"},"QiuYuBao":{"left":"623px","top":"318px"},"HongLianGang":{"left":"607px","top":"259px"},"JinMenGuan":{"left":"637px","top":"123px"},"QingYunWu":{"left":"733px","top":"144px"},"PanLongWu":{"left":"502px","top":"476px"},"ZhuLuPing":{"left":"573px","top":"391px"},"WuWangCheng":{"left":"562px","top":"430px"},"LongMenZhen":{"left":"395px","top":"117px"},"FeiShaGuan":{"left":"362px","top":"136px"},"LinFengBao":{"left":"149px","top":"65px"},"BuKongGuan":{"left":"392px","top":"368px"},"JiLiuWu":{"left":"432px","top":"431px"},"WoLongPo":{"left":"226px","top":"476px"},"RiYueYa":{"left":"257px","top":"356px"},"ShuangGeBao":{"left":"50px","top":"602px"},"LanCangCheng":{"left":"123px","top":"626px"},"ShenChiLing":{"left":"109px","top":"206px"},"LieRiGang":{"left":"12px","top":"271px"},"JingQiuGu":{"left":"11px","top":"386px"},"FengMingBao":{"left":"23px","top":"494px"},"DaLiShanCheng":{"left":"304px","top":"606px"},"QianYanGuan":{"left":"305px","top":"581px"},"DanXingLin":{"left":"502px","top":"152px"},"FengHuZhai":{"left":"496px","top":"203px"},"ShiWaiPo":{"left":"234px","top":"233px"},"FuFengJun":{"left":"295px","top":"187px"}},"placeName":{"eren":{"left":"149px","top":"49px"},"haoqi":{"left":"762px","top":"622px"},"QiuYuBao":{"left":"674px","top":"370px"},"HongLianGang":{"left":"698px","top":"284px"},"JinMenGuan":{"left":"684px","top":"212px"},"QingYunWu":{"left":"768px","top":"178px"},"PanLongWu":{"left":"578px","top":"536px"},"ZhuLuPing":{"left":"622px","top":"434px"},"WuWangCheng":{"left":"706px","top":"560px"},"LongMenZhen":{"left":"450px","top":"162px"},"FeiShaGuan":{"left":"370px","top":"142px"},"LinFengBao":{"left":"284px","top":"132px"},"BuKongGuan":{"left":"480px","top":"392px"},"JiLiuWu":{"left":"458px","top":"466px"},"WoLongPo":{"left":"320px","top":"524px"},"RiYueYa":{"left":"332px","top":"428px"},"ShuangGeBao":{"left":"102px","top":"640px"},"LanCangCheng":{"left":"170px","top":"718px"},"ShenChiLing":{"left":"129px","top":"234px"},"LieRiGang":{"left":"88px","top":"348px"},"JingQiuGu":{"left":"132px","top":"444px"},"FengMingBao":{"left":"62px","top":"522px"},"DaLiShanCheng":{"left":"336px","top":"622px"},"QianYanGuan":{"left":"390px","top":"734px"},"DanXingLin":{"left":"516px","top":"172px"},"FengHuZhai":{"left":"578px","top":"240px"},"ShiWaiPo":{"left":"300px","top":"308px"},"FuFengJun":{"left":"326px","top":"222px"}},"placeCamp":{"LuoDao":{"left":"724px","top":"326px"},"JinShuiZhen":{"left":"730px","top":"150px"},"BaLingXian":{"left":"644px","top":"486px"},"NanPingShan":{"left":"670px","top":"560px"},"LongMenHuangMo":{"left":"428px","top":"124px"},"KunLun":{"left":"252px","top":"142px"},"QuTangXia":{"left":"522px","top":"438px"},"BaiLongKou":{"left":"380px","top":"476px"},"WuLiangShan":{"left":"216px","top":"636px"},"RongTianLing":{"left":"170px","top":"290px"},"HeiLongZhao":{"left":"80px","top":"444px"},"CangShanErHai":{"left":"466px","top":"654px"},"FengHuaGuZhanLuan":{"left":"526px","top":"204px"},"MaWeiYi":{"left":"278px","top":"238px"}},"placeAttacks":{"KunLun":{"RongTianLing":{"left":"192px","top":"212px","transform":"rotate(200deg)"},"MaWeiYi":{"left":"298px","top":"204px","transform":"rotate(170deg)"},"LongMenHuangMo":{"left":"178px","top":"110px","transform":"rotate(110deg)"}},"MaWeiYi":{"KunLun":{"left":"300px","top":"184px","transform":"rotate(320deg)"},"RongTianLing":{"left":"218px","top":"280px","transform":"rotate(250deg)"},"LongMenHuangMo":{"left":"380px","top":"182px","transform":"rotate(50deg)"},"BaiLongKou":{"left":"312px","top":"346px","transform":"rotate(180deg)"}},"LongMenHuangMo":{"KunLun":{"left":"378px","top":"108px","transform":"rotate(280deg)"},"MaWeiYi":{"left":"356px","top":"183px","transform":"rotate(220deg)"},"FengHuaGuZhanLuan":{"left":"504px","top":"144px","transform":"rotate(120deg)"}},"FengHuaGuZhanLuan":{"LongMenHuangMo":{"left":"488px","top":"132px","transform":"rotate(300deg)"},"JinShuiZhen":{"left":"638px","top":"140px","transform":"rotate(90deg)"}},"JinShuiZhen":{"LuoDao":{"left":"704px","top":"246px","transform":"rotate(200deg)"},"FengHuaGuZhanLuan":{"left":"618px","top":"142px","transform":"rotate(270deg)"}},"LuoDao":{"JinShuiZhen":{"left":"666px","top":"228px","transform":"rotate(7deg)"},"BaLingXian":{"left":"644px","top":"382px","transform":"rotate(210deg)"},"NanPingShan":{"left":"726px","top":"414px","transform":"rotate(180deg)"}},"BaLingXian":{"LuoDao":{"left":"642px","top":"368px","transform":"rotate(30deg)"},"NanPingShan":{"left":"674px","top":"512px","transform":"rotate(120deg)"},"CangShanErHai":{"left":"520px","top":"564px","transform":"rotate(200deg)"},"QuTangXia":{"left":"556px","top":"454px","transform":"rotate(290deg)"}},"QuTangXia":{"BaLingXian":{"left":"568px","top":"466px","transform":"rotate(120deg)"},"BaiLongKou":{"left":"400px","top":"434px","transform":"rotate(270deg)"}},"CangShanErHai":{"BaLingXian":{"left":"536px","top":"550px","transform":"rotate(40deg)"},"NanPingShan":{"left":"596px","top":"616px","transform":"rotate(70deg)"},"WuLiangShan":{"left":"282px","top":"652px","transform":"rotate(270deg)"}},"WuLiangShan":{"HeiLongZhao":{"left":"114px","top":"598px","transform":"rotate(0deg)"},"BaiLongKou":{"left":"230px","top":"588px","transform":"rotate(40deg)"},"CangShanErHai":{"left":"300px","top":"652px","transform":"rotate(100deg)"}},"BaiLongKou":{"WuLiangShan":{"left":"240px","top":"610px","transform":"rotate(200deg)"},"QuTangXia":{"left":"416px","top":"438px","transform":"rotate(70deg)"},"MaWeiYi":{"left":"316px","top":"336px","transform":"rotate(340deg)"}},"HeiLongZhao":{"WuLiangShan":{"left":"114px","top":"600px","transform":"rotate(180deg)"},"RongTianLing":{"left":"162px","top":"390px","transform":"rotate(10deg)"}},"RongTianLing":{"KunLun":{"left":"200px","top":"208px","transform":"rotate(30deg)"},"MaWeiYi":{"left":"244px","top":"236px","transform":"rotate(90deg)"},"HeiLongZhao":{"left":"98px","top":"384px","transform":"rotate(190deg)"}},"NanPingShan":{"BaLingXian":{"left":"644px","top":"536px","transform":"rotate(300deg)"},"LuoDao":{"left":"730px","top":"402px","transform":"rotate(0deg)"},"CangShanErHai":{"left":"576px","top":"616px","transform":"rotate(240deg)"}}},"placeArr":{"QiuYuBao":{"HongLianGang":{"left":"678px","top":"318px","transform":"rotate(10deg)"}},"HongLianGang":{"QiuYuBao":{"left":"654px","top":"332px","transform":"rotate(180deg)"}},"JinMenGuan":{"QingYunWu":{"left":"758px","top":"202px","transform":"rotate(70deg)"}},"QingYunWu":{"JinMenGuan":{"left":"750px","top":"202px","transform":"rotate(250deg)"}},"PanLongWu":{"ZhuLuPing":{"left":"604px","top":"470px","transform":"rotate(30deg)"}},"ZhuLuPing":{"PanLongWu":{"left":"600px","top":"490px","transform":"rotate(210deg)"}},"LongMenZhen":{"FeiShaGuan":{"left":"428px","top":"164px","transform":"rotate(240deg)"}},"FeiShaGuan":{"LongMenZhen":{"left":"440px","top":"142px","transform":"rotate(90deg)"}},"BuKongGuan":{"JiLiuWu":{"left":"438px","top":"482px","transform":"rotate(120deg)"}},"JiLiuWu":{"BuKongGuan":{"left":"464px","top":"426px","transform":"rotate(320deg)"}},"WoLongPo":{"RiYueYa":{"left":"312px","top":"466px","transform":"rotate(40deg)"}},"RiYueYa":{"WoLongPo":{"left":"312px","top":"480px","transform":"rotate(200deg)"}},"ShuangGeBao":{"LanCangCheng":{"left":"150px","top":"688px","transform":"rotate(100deg)"}},"LanCangCheng":{"ShuangGeBao":{"left":"136px","top":"688px","transform":"rotate(290deg)"}},"ShenChiLing":{"LieRiGang":{"left":"126px","top":"268px","transform":"rotate(210deg)"}},"LieRiGang":{"ShenChiLing":{"left":"126px","top":"266px","transform":"rotate(30deg)"}},"JingQiuGu":{"FengMingBao":{"left":"124px","top":"476px","transform":"rotate(30deg)"}},"FengMingBao":{"JingQiuGu":{"left":"124px","top":"480px","transform":"rotate(30deg)"}},"DaLiShanCheng":{"QianYanGuan":{"left":"348px","top":"670px","transform":"rotate(180deg)"}},"QianYanGuan":{"DaLiShanCheng":{"left":"348px","top":"662px","transform":"rotate(0deg)"}},"DanXingLin":{"FengHuZhai":{"left":"556px","top":"214px","transform":"rotate(120deg)"}},"FengHuZhai":{"DanXingLin":{"left":"558px","top":"218px","transform":"rotate(320deg)"}},"ShiWaiPo":{"FuFengJun":{"left":"338px","top":"258px","transform":"rotate(30deg)"}},"FuFengJun":{"ShiWaiPo":{"left":"322px","top":"264px","transform":"rotate(210deg)"}}}}')}}]);
//# sourceMappingURL=750.9b1186b6.js.map