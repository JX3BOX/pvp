"use strict";(self["webpackChunkpvp"]=self["webpackChunkpvp"]||[]).push([[589],{86607:function(t,e,i){i.d(e,{Jq:function(){return n},Sx:function(){return s},VC:function(){return l},xl:function(){return o}});var a=i(18371);function n(t){return(0,a.nj)().get("/api/cms/posts",{params:t})}function o(t){return(0,a.nj)().get(`/api/cms/post/${t}`)}function s(t){return(0,a.nj)().get("/api/cms/pve/skill/changelog",{params:t})}function l(t){return(0,a.nj)().get("/api/cms/post/meta",{params:t})}},42325:function(t,e,i){i.d(e,{H:function(){return s},m:function(){return o}});var a=i(27484),n=i.n(a);const o=function(t){return n()(t).format("YYYY-MM-DD hh:mm:ss")};function s(t){if("[object Object]"===Object.prototype.toString.call(t)){for(const e in t)[void 0,null,""].includes(t[e])&&delete t[e];return t}return t}},60956:function(t,e,i){i.d(e,{Z:function(){return f}});var a=i(66252),n=i(3577);const o=["href"],s=["src"],l={key:0,class:"c-avatar-frame"},r=["src"];function c(t,e,i,c,d,u){return(0,a.wg)(),(0,a.iD)("a",{class:(0,n.C_)(["c-avatar",i.size]),href:u.authorLink(i.uid)},[(0,a._)("img",{src:u.showAvatar(i.url),class:"c-avatar-pic"},null,8,s),i.frame?((0,a.wg)(),(0,a.iD)("i",l,[(0,a._)("img",{src:u.frameUrl},null,8,r)])):(0,a.kq)("",!0),(0,a.WI)(t.$slots,"default")],10,o)}var d=i(89847),u=i(17233);const{__imgPath:p}=d;var m={name:"AvatarComp",props:{uid:{type:[Number,String],default:0},url:{type:String,default:""},frame:{type:String,default:""},size:{type:[Number,String],default:"m"}},components:{},data:function(){return{frames:[],styles:{xxs:36,xs:48,s:68,m:88,l:120,xl:150}}},computed:{frameUrl:function(){return p+`avatar/images/${this.frame}/${this.frame}.svg`}},methods:{showAvatar:function(t){return(0,u.showAvatar)(t,3*this.styles[this.size])},authorLink:u.authorLink}},h=i(83744);const v=(0,h.Z)(m,[["render",c]]);var f=v},75015:function(t,e,i){i.d(e,{Z:function(){return w}});var a=i(66252),n=i(3577);const o={class:"w-thx"},s={class:"w-thx-panel"},l=(0,a._)("path",{d:"M309.9 140.6h402.9c21.1 0 38.2-17.1 38.2-38.2s-17.1-38.2-38.2-38.2H309.9c-21.1 0-38.2 17.1-38.2 38.2s17.1 38.2 38.2 38.2z",fill:"#61D0ED"},null,-1),r=(0,a._)("path",{d:"M776.3 112.1c-4.7 30.5-30.8 54-62.7 54H309.1c-31.8 0-58-23.5-62.7-54-46.2 19.1-78.7 64.5-78.7 117.6v602.7c0 70.3 57 127.3 127.3 127.3h432.7c70.3 0 127.3-57 127.3-127.3V229.7c0-53.1-32.5-98.6-78.7-117.6zm-47.9 572.1h-434c-21.1 0-38.2-17.1-38.2-38.2s17.1-38.2 38.2-38.2h433.9c21.1 0 38.2 17.1 38.2 38.2s-17.1 38.2-38.1 38.2zm0-173h-434c-21.1 0-38.2-17.1-38.2-38.2s17.1-38.2 38.2-38.2h433.9c21.1 0 38.2 17.1 38.2 38.2s-17.1 38.2-38.1 38.2zm0-173h-434c-21.1 0-38.2-17.1-38.2-38.2s17.1-38.2 38.2-38.2h433.9c21.1 0 38.2 17.1 38.2 38.2s-17.1 38.2-38.1 38.2z",fill:"#61D0ED"},null,-1),c=[l,r];function d(t,e,i,l,r,d){const u=(0,a.up)("boxcoin-admin"),p=(0,a.up)("Like"),m=(0,a.up)("fav"),h=(0,a.up)("boxcoin-user"),v=(0,a.up)("el-tooltip"),f=(0,a.up)("BoxcoinRecords"),_=(0,a.up)("el-drawer");return(0,a.wg)(),(0,a.iD)("div",o,[(0,a._)("div",s,[t.hasRight&&i.adminBoxcoinEnable&&t.boxcoin_enable?((0,a.wg)(),(0,a.j4)(u,{key:0,postId:i.postId,postType:i.postType,userId:i.userId,max:t.admin_max,min:t.admin_min,own:t.admin_left,total:t.admin_total,points:t.admin_points,authors:i.authors,onUpdateRecord:d.updateRecord,client:i.client},null,8,["postId","postType","userId","max","min","own","total","points","authors","onUpdateRecord","client"])):(0,a.kq)("",!0),(0,a.Wm)(p,{postId:i.postId,postType:i.postType},null,8,["postId","postType"]),(0,a.Wm)(m,{postId:i.postId,postType:i.postType,postTitle:i.postTitle},null,8,["postId","postType","postTitle"]),i.userBoxcoinEnable&&t.boxcoin_enable&&i.allowGift?((0,a.wg)(),(0,a.j4)(h,{key:1,postId:i.postId,postType:i.postType,boxcoin:t.boxcoin,userId:i.userId,own:t.user_left,points:t.user_points,authors:i.authors,onUpdateRecord:d.updateRecord,client:i.client},null,8,["postId","postType","boxcoin","userId","own","points","authors","onUpdateRecord","client"])):(0,a.kq)("",!0),(0,a.Wm)(v,{effect:"dark",content:"打赏记录",placement:"top-start"},{default:(0,a.w5)((()=>[((0,a.wg)(),(0,a.iD)("svg",{class:(0,n.C_)(["icon","u-record-icon"]),viewBox:"0 0 1024 1024",xmlns:"http://www.w3.org/2000/svg",width:"200",height:"200","svg-inline":"",onClick:e[0]||(e[0]=(...t)=>d.onRecord&&d.onRecord(...t)),role:"presentation",focusable:"false",tabindex:"-1"},c))])),_:1})]),(0,a.Wm)(_,{modelValue:t.showDrawer,"onUpdate:modelValue":e[1]||(e[1]=e=>t.showDrawer=e),title:"打赏记录","append-to-body":""},{default:(0,a.w5)((()=>[(0,a.Wm)(f,{postId:i.postId,postType:i.postType,postClient:i.client,cacheRecord:t.cacheRecord,mode:i.mode,"onUpdate:boxcoin":d.updateBoxcoin},null,8,["postId","postType","postClient","cacheRecord","mode","onUpdate:boxcoin"])])),_:1},8,["modelValue"])])}var u=i(63553),p=i(57039),m=i(65801),h=i(5856),v=i(78401),f=i(49e3),_=i(50855),g={name:"SimpleThx",components:{Like:u.Z,Fav:p.Z,BoxcoinAdmin:m.Z,BoxcoinUser:h.Z,BoxcoinRecords:v.Z},props:{type:{type:String,default:"normal"},postId:{type:Number,default:0},postType:{type:String,default:""},postTitle:{type:String,default:""},userId:{type:Number,default:0},authors:{type:Array,default:()=>[]},mode:{type:String,default:"normal"},client:{type:String,default:"std"},allowGift:{type:[Number,Boolean],default:1},adminBoxcoinEnable:{type:Boolean,default:!1},userBoxcoinEnable:{type:Boolean,default:!1},presetConfig:{type:Object,default:()=>({})}},data:function(){return{boxcoin:0,hasRight:f.Z.getInfo().group>=32,user:f.Z.getInfo(),admin_max:0,admin_min:0,admin_left:0,admin_total:0,admin_points:[100],user_left:0,user_points:[100],cacheRecord:null,boxcoin_enable:0,showDrawer:!1}},computed:{post_keys:function(){return[this.postId,this.postType]}},watch:{post_keys:{immediate:!0,deep:!0,handler:function(){this.postType&&this.postId&&this.loadBoxcoinConfig()}}},methods:{loadBoxcoinConfig:function(){if(Object.keys(this.presetConfig)?.length)return this.admin_max=this.presetConfig.admin_max||0,this.admin_min=this.presetConfig.admin_min||0,this.admin_points=this.presetConfig.admin_points||[10,1e3],this.admin_left=this.presetConfig.admin_left||0,this.admin_total=this.presetConfig.admin_total||0,this.user_points=this.presetConfig.user_points||[10,1e3],this.user_left=this.presetConfig.user_left||0,void(this.boxcoin_enable=this.presetConfig.boxcoin_enable||0);f.Z.isLogin()&&(0,_.PD)(this.postType).then((t=>{this.admin_max=t.data.data.limit.admin_max||0,this.admin_min=t.data.data.limit.admin_min||0,this.admin_points=t.data.data.limit.admin_points||[10,1e3],this.admin_left=t.data.data.asManagerBoxCoinRemain||0,this.admin_total=t.data.data.asManagerBoxCoinTotal||0,this.user_points=t.data.data.limit.user_points||[10,1e3],"origin"==this.client?this.user_left=t.data.data.asUserBoxCoinRemainOrigin+t.data.data.asUserBoxCoinRemainAll:"std"==this.client?this.user_left=t.data.data.asUserBoxCoinRemainStd+t.data.data.asUserBoxCoinRemainAll:this.user_left=t.data.data.asUserBoxCoinRemainAll+t.data.data.asUserBoxCoinRemainStd+t.data.data.asUserBoxCoinRemainOrigin})),(0,_.hq)().then((t=>{this.boxcoin_enable=!!~~t.data?.data?.val}))},updateRecord:function(t){this.cacheRecord=t},onRecord:function(){this.showDrawer=!0},updateBoxcoin:function(t){this.boxcoin=t}}},k=i(83744);const y=(0,k.Z)(g,[["render",d]]);var w=y},67149:function(t,e,i){i.r(e),i.d(e,{default:function(){return Lt}});var a=i(66252);function n(t,e,i,n,o,s){const l=(0,a.up)("CompetitiveTrick"),r=(0,a.up)("ListLayout");return(0,a.wg)(),(0,a.j4)(r,null,{default:(0,a.w5)((()=>[(0,a.Wm)(l)])),_:1})}var o=i(24239),s=i(77371);const l={class:"m-competitive-trick"},r={key:0,class:"m-competitive-trick"};function c(t,e,i,n,o,s){const c=(0,a.up)("TrickNotice"),d=(0,a.up)("TrickHeader"),u=(0,a.up)("CompetitiveTrickItemVue"),p=(0,a.up)("el-alert"),m=(0,a.Q2)("loading");return(0,a.wg)(),(0,a.iD)("div",l,[(0,a.Wm)(c),(0,a.Wm)(d,{onFilterImperceptibly:s.filterImperceptibly,onFilterMeta:s.filterMeta,onSearch:s.onSearch},null,8,["onFilterImperceptibly","onFilterMeta","onSearch"]),o.data.length?(0,a.wy)(((0,a.wg)(),(0,a.iD)("div",r,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(o.data,(t=>((0,a.wg)(),(0,a.j4)(u,{key:t.id,data:t,preset:o.presetConfig},null,8,["data","preset"])))),128))])),[[m,o.loading]]):((0,a.wg)(),(0,a.j4)(p,{key:1,class:"m-strategy-null",title:"没有找到相关条目",type:"info",center:"","show-icon":""}))])}i(57658);var d=i(86607),u=i(3577),p=i(49963),m=i.p+"img/video.d285c52a.svg";const h={key:0,class:"m-trick-item"},v={class:"m-trick-item__header"},f={class:"m-trick-item__title"},_={key:0,class:"u-label u-zlp"},g=["href"],k={key:1,class:"u-marks"},y={key:2,class:"u-tv"},w=(0,a._)("img",{class:"u-tv-icon",src:m},null,-1),b=[w],x={class:"m-trick-item__thx"},D=(0,a._)("path",{d:"M655.36 0H368.64C165.888 0 0 165.888 0 368.64V921.6C0 977.92 46.08 1024 102.4 1024h552.96C859.136 1024 1024 859.136 1024 655.36V368.64C1024 165.888 858.112 0 655.36 0zM366.08 344.064c28.16 0 51.2 23.04 51.2 51.2s-23.04 51.2-51.2 51.2-51.2-23.04-51.2-51.2 23.04-51.2 51.2-51.2zM697.344 606.72c0 90.112-86.528 163.328-176.128 163.328h-18.432c-90.112 0-176.128-73.216-176.128-163.328 0-29.184 24.064-53.248 53.248-53.248H645.12c28.672 0 52.224 23.552 52.224 53.248zM657.92 446.464c-28.16 0-51.2-23.04-51.2-51.2s23.04-51.2 51.2-51.2 51.2 23.04 51.2 51.2-23.04 51.2-51.2 51.2z",fill:"#DD6572"},null,-1),I=[D],C={class:"m-trick-item__content"},T={class:"m-trick-item__left"},B=["href"],q={class:"u-name"},z={class:"m-trick-item__right"},S={key:0,class:"m-header"},R=["innerHTML"],M={class:"m-content"},L={key:0,class:"m-talent"},W={class:"m-talent__title"},U=["src"],Z={key:0,class:"u-desc"},H=["innerHTML"],$={class:"m-skills"},j={class:"u-title"},F=["src"],V={key:0,class:"u-skills"},A=["src","alt","title"],N=["title"],O={class:"u-gcd-icon",title:"无GCD技能"},Y={key:1,class:"u-desc"};function E(t,e,i,n,o,s){var l,r,c,d,m,w,D,E,K,J,G,P,Q,X,tt,et,it,at;const nt=(0,a.up)("SimpleThx"),ot=(0,a.up)("el-tooltip"),st=(0,a.up)("Avatar"),lt=(0,a.up)("Clock"),rt=(0,a.up)("el-icon"),ct=(0,a.up)("Comment"),dt=(0,a.up)("el-drawer");return s.hasData?((0,a.wg)(),(0,a.iD)("div",h,[(0,a._)("div",v,[(0,a._)("div",f,[i.data.zlp?((0,a.wg)(),(0,a.iD)("span",_,(0,u.zw)(i.data.zlp),1)):(0,a.kq)("",!0),(0,a._)("a",{class:"u-link",href:`/pvp/${null===(l=i.data)||void 0===l?void 0:l.ID}`,target:"_blank"},(0,u.zw)(i.data.post_title||"未知流派"),9,g),i.data.mark&&i.data.mark.length?((0,a.wg)(),(0,a.iD)("span",k,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(i.data.mark,(t=>((0,a.wg)(),(0,a.iD)("i",{class:"u-mark",key:t},(0,u.zw)(s.showMark(t)),1)))),128))])):(0,a.kq)("",!0),i.data.include_video?((0,a.wg)(),(0,a.iD)("span",y,b)):(0,a.kq)("",!0)]),(0,a._)("div",x,[(0,a.Wm)(nt,{postType:"pvp",postTitle:null===(r=i.data)||void 0===r?void 0:r.post_title,userId:null===(c=i.data)||void 0===c?void 0:c.post_author,adminBoxcoinEnable:!0,userBoxcoinEnable:!0,postId:null===(d=i.data)||void 0===d?void 0:d.ID,presetConfig:i.preset},null,8,["postTitle","userId","postId","presetConfig"]),(0,a.Wm)(ot,{content:"评论",placement:"top-start"},{default:(0,a.w5)((()=>[((0,a.wg)(),(0,a.iD)("svg",{class:(0,u.C_)(["icon","u-icon"]),viewBox:"0 0 1024 1024",xmlns:"http://www.w3.org/2000/svg",width:"200",height:"200","svg-inline":"",onClick:e[0]||(e[0]=t=>o.showComment=!0),role:"presentation",focusable:"false",tabindex:"-1"},I))])),_:1})])]),(0,a._)("div",C,[(0,a._)("div",T,[(0,a._)("a",{class:"m-author",href:s.authorLink(null===(m=i.data)||void 0===m?void 0:m.post_author)},[(0,a.Wm)(st,{class:"u-avatar",uid:null===(w=i.data)||void 0===w?void 0:w.post_author,size:"s",url:null===(D=i.data.author_info)||void 0===D?void 0:D.user_avatar,frame:null===(E=i.data.author_info)||void 0===E?void 0:E.user_avatar_frame},null,8,["uid","url","frame"]),(0,a._)("span",q,(0,u.zw)(null===(K=i.data.author_info)||void 0===K?void 0:K.display_name),1)],8,B)]),(0,a._)("div",z,[null!==(J=i.data)&&void 0!==J&&null!==(G=J.post_meta)&&void 0!==G&&G.content?((0,a.wg)(),(0,a.iD)("div",S,[(0,a._)("div",{innerHTML:s.nl2br(null===(P=i.data)||void 0===P||null===(Q=P.post_meta)||void 0===Q?void 0:Q.content)},null,8,R)])):(0,a.kq)("",!0),(0,a._)("div",M,[Object.keys(s.talent).length?((0,a.wg)(),(0,a.iD)("div",L,[(0,a._)("div",W,[(0,a._)("img",{class:"u-icon",src:s.getAppIcon("talent"),alt:""},null,8,U),(0,a.Uk)(" 奇穴 ")]),(0,a._)("div",{class:(0,u.C_)(["m-talent-box",`m-qx-container-${null===(X=i.data)||void 0===X?void 0:X.ID}`])},null,2),null!==(tt=i.data)&&void 0!==tt&&null!==(et=tt.post_meta)&&void 0!==et&&et.talent_desc?((0,a.wg)(),(0,a.iD)("div",Z,[(0,a.Uk)(" 奇穴讲解："),(0,a._)("span",{innerHTML:s.nl2br(null===(it=i.data)||void 0===it||null===(at=it.post_meta)||void 0===at?void 0:at.talent_desc)},null,8,H)])):(0,a.kq)("",!0)])):(0,a.kq)("",!0),(0,a._)("div",$,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(s.skills,((t,e)=>((0,a.wg)(),(0,a.iD)("div",{class:"m-skill-item",key:e},[(0,a._)("div",j,[(0,a._)("img",{class:"u-icon",src:s.getAppIcon("pvp"),alt:""},null,8,F),(0,a.Uk)(" 连招："+(0,u.zw)(t.name),1)]),t.sq?((0,a.wg)(),(0,a.iD)("div",V,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(t.sq,((t,e)=>((0,a.wg)(),(0,a.iD)("span",{key:t.SkillID+""+e,class:"u-skill"},[(0,a._)("img",{class:"u-skill-icon",src:s.iconLink(t.IconID),alt:t.IconID,title:t.Name},null,8,A),(0,a._)("span",{class:"u-skill-name",title:t.Name},(0,u.zw)(t.Name),9,N),(0,a.wy)((0,a._)("i",O,[(0,a.Wm)(rt,null,{default:(0,a.w5)((()=>[(0,a.Wm)(lt)])),_:1})],512),[[p.F8,t.WithoutGcd]])])))),128))])):(0,a.kq)("",!0),t.desc?((0,a.wg)(),(0,a.iD)("div",Y,"连招说明："+(0,u.zw)(t.desc),1)):(0,a.kq)("",!0)])))),128))])])])]),(0,a.Wm)(dt,{title:"评论",modelValue:o.showComment,"onUpdate:modelValue":e[1]||(e[1]=t=>o.showComment=t),"destroy-on-close":"",class:"m-trick-drawer"},{default:(0,a.w5)((()=>{var t;return[(0,a.Wm)(ct,{category:"post",id:null===(t=i.data)||void 0===t?void 0:t.ID},null,8,["id"])]})),_:1},8,["modelValue"])])):(0,a.kq)("",!0)}var K=i(17233),J=i(957),G=i(75015),P=i(72457),Q=i(60956),X=i(23910),tt={name:"CompetitiveTrickItem",components:{SimpleThx:G.Z,Comment:P.Z,Avatar:Q.Z},props:{preset:{type:Object,default:()=>{}},data:{type:Object,default:()=>{}}},data(){return{talentDriver:null,showComment:!1}},computed:{talent(){try{var t,e;return JSON.parse(null===(t=this.data)||void 0===t||null===(e=t.post_meta)||void 0===e?void 0:e.talent)}catch(i){return{}}},hasData(){var t;return!(null===(t=this.data)||void 0===t||!t.ID)},skills(){var t;return null===(t=this.data)||void 0===t?void 0:t.post_meta.data}},watch:{data:{deep:!0,immediate:!0,handler(){this.talentDriver||this.$nextTick((()=>{this.installTalent()}))}},talent:{deep:!0,handler(){this.reloadTalent()}}},methods:{authorLink:K.authorLink,iconLink:K.iconLink,getAppIcon:K.getAppIcon,installTalent(){var t;this.talentDriver=new J.Z({container:`.m-qx-container-${null===(t=this.data)||void 0===t?void 0:t.ID}`,version:this.talent.version,xf:this.talent.xf,editable:!1,sq:this.talent.sq})},reloadTalent(){this.$nextTick((()=>{var t;this.talentDriver&&(null===(t=this.talentDriver)||void 0===t||t.then((t=>{t.load({version:this.talent.version,xf:this.talent.xf,editable:!1,sq:this.talent.sq})})))}))},nl2br(t){return t.replace(/\n/g,"<br/>")},showMark:function(t){return X.I[t]||t}}},et=i(83744);const it=(0,et.Z)(tt,[["render",E]]);var at=it;const nt={class:"m-notice-top"},ot=(0,a._)("div",{class:"m-notice-top__header"},[(0,a._)("h3",{class:"u-title"},[(0,a._)("i",{class:"el-icon-news"}),(0,a.Uk)("公告")])],-1),st={class:"m-notice-top__content"},lt={class:"m-item_left"},rt=["innerHTML"];function ct(t,e,i,n,o,s){return(0,a.wg)(),(0,a.iD)("div",nt,[ot,(0,a._)("div",st,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(o.data,(t=>((0,a.wg)(),(0,a.iD)("div",{class:"m-notice-top__item",key:t.id},[(0,a._)("div",lt,[(0,a._)("span",{class:"u-title",innerHTML:t},null,8,rt)])])))),128))])])}var dt=i(2950),ut={data(){return{data:[]}},mounted(){this.getBreadcrumb()},methods:{getBreadcrumb(){try{const t=sessionStorage.getItem("pvp_ac");t?this.data=JSON.parse(t):(0,dt.k)("pvp_ac").then((t=>{var e,i;console.log(t);const a=(null===(e=t.data)||void 0===e||null===(i=e.data)||void 0===i?void 0:i.html)||"";this.data=a.split("\n"),sessionStorage.setItem("pvp_ac",JSON.stringify(this.data))}))}catch(t){this.data=[]}}}};const pt=(0,et.Z)(ut,[["render",ct]]);var mt=pt;const ht={class:"c-macro__header"},vt={class:"m-archive-search"},ft=["href"],_t={class:"u-search"},gt=(0,a._)("span",{class:"u-search"},"关键词",-1),kt={key:0,class:"m-archive-filter"},yt={class:"m-filter--left"},wt={class:"m-filter--right"};function bt(t,e,i,n,o,s){const l=(0,a.up)("Search"),r=(0,a.up)("el-icon"),c=(0,a.up)("el-button"),d=(0,a.up)("el-input"),u=(0,a.up)("clientBy"),m=(0,a.up)("markBy"),h=(0,a.up)("zlpBy"),v=(0,a.up)("orderBy");return(0,a.wg)(),(0,a.iD)("div",ht,[(0,a._)("div",vt,[(0,a._)("a",{href:s.publish_link,class:"u-publish el-button el-button--primary el-button--large"},"+ 发布作品",8,ft),(0,a.Wm)(d,{placeholder:"请输入搜索内容",modelValue:o.search,"onUpdate:modelValue":e[0]||(e[0]=t=>o.search=t),modelModifiers:{trim:!0,lazy:!0},clearable:"",onClear:s.onSearch,onKeydown:(0,p.D2)(s.onSearch,["enter"]),size:"large"},{prepend:(0,a.w5)((()=>[(0,a._)("span",_t,[(0,a.Wm)(r,null,{default:(0,a.w5)((()=>[(0,a.Wm)(l)])),_:1}),(0,a.Uk)(),gt])])),append:(0,a.w5)((()=>[(0,a.Wm)(c,{icon:"Position",class:"u-btn",onClick:s.onSearch},null,8,["onClick"])])),_:1},8,["modelValue","onClear","onKeydown"])]),i.canFilter?((0,a.wg)(),(0,a.iD)("div",kt,[(0,a._)("div",yt,[(0,a.Wm)(u,{onFilter:s.filterImperceptibly,type:o.client},null,8,["onFilter","type"]),(0,a.Wm)(m,{onFilter:s.filterMeta},null,8,["onFilter"]),(0,a.Wm)(h,{onFilter:s.filterMeta,type:"zlp",client:o.client},null,8,["onFilter","client"])]),(0,a._)("div",wt,[(0,a.Wm)(v,{onFilter:s.filterMeta},null,8,["onFilter"])])])):(0,a.kq)("",!0)])}var xt=i(60063),Dt={name:"TrickHeader",props:{canFilter:{type:Boolean,default:!0}},data(){return{search:"",client:(0,o.o)().client}},computed:{publish_link:function(){return(0,K.publishLink)(xt.mx)}},methods:{filterImperceptibly(t){this.$emit("filterImperceptibly",t)},filterMeta(t){this.$emit("filterMeta",t)},onSearch(){this.$emit("search",this.search)}}};const It=(0,et.Z)(Dt,[["render",bt]]);var Ct=It,Tt=i(96486),Bt=i(42325),qt={name:"CompetitiveTrick",components:{CompetitiveTrickItemVue:at,TrickNotice:mt,TrickHeader:Ct},data(){return{data:[],search:"",client:"",presetConfig:{},loading:!1}},computed:{subtype(){var t;return(null===(t=this.$route.query)||void 0===t?void 0:t.subtype)||"冰心诀"},mark(){var t;return(null===(t=this.$route.query)||void 0===t?void 0:t.mark)||""},order(){var t;return(null===(t=this.$route.query)||void 0===t?void 0:t.order)||""},zlp(){var t;return(null===(t=this.$route.query)||void 0===t?void 0:t.zlp)||""},query:function(){return{type:"pvp",sticky:1,subtype:this.subtype,order:this.order,mark:this.mark,client:this.client,search:this.search,zlp:this.zlp}}},watch:{query:{immediate:!0,deep:!0,handler(){this.loadData()}}},methods:{publishLink:K.publishLink,loadData(){this.loading=!0;const t=(0,Bt.H)((0,Tt.cloneDeep)(this.query));(0,d.Jq)(t).then((t=>{this.data=t.data.data.list||[]})).finally((()=>{this.loading=!1}))},onSearch:function(t){this.search=t},filterImperceptibly:function(t){this[t["type"]]=t["val"]},filterMeta:function(t){this.replaceRoute({[t["type"]]:t["val"]})},replaceRoute:function(t){return this.$router.push({name:this.$route.name,query:Object.assign({},this.$route.query,t)}).then((()=>{window.scrollTo(0,0)})).catch((()=>{}))}}};const zt=(0,et.Z)(qt,[["render",c]]);var St=zt,Rt={name:"PostView",components:{ListLayout:s.Z,CompetitiveTrick:St},props:[],data:function(){return{}},computed:{client(){return(0,o.o)().client}}};const Mt=(0,et.Z)(Rt,[["render",n]]);var Lt=Mt},60063:function(t){t.exports={mx:"pvp"}}}]);
//# sourceMappingURL=589.b6f68dba.js.map