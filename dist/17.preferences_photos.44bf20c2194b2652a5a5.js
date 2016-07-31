webpackJsonp([17],{29:function(e,t,a){var n,r;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
!function(){"use strict";function a(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var r=typeof n;if("string"===r||"number"===r)e.push(this&&this[n]||n);else if(Array.isArray(n))e.push(a.apply(this,n));else if("object"===r)for(var o in n)u.call(n,o)&&n[o]&&e.push(this&&this[o]||o)}}return e.join(" ")}var u={}.hasOwnProperty;"undefined"!=typeof e&&e.exports?e.exports=a:(n=[],r=function(){return a}.apply(t,n),!(void 0!==r&&(e.exports=r)))}()},52:function(e,t,a){var n,r;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
!function(){"use strict";function a(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var r=typeof n;if("string"===r||"number"===r)e.push(n);else if(Array.isArray(n))e.push(a.apply(null,n));else if("object"===r)for(var o in n)u.call(n,o)&&n[o]&&e.push(o)}}return e.join(" ")}var u={}.hasOwnProperty;"undefined"!=typeof e&&e.exports?e.exports=a:(n=[],r=function(){return a}.apply(t,n),!(void 0!==r&&(e.exports=r)))}()},67:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.LoaderSmall=void 0;var r=a(3),u=n(r),o=a(4),s=n(o),l=a(5),c=n(l),i=a(7),d=n(i),f=a(6),p=n(f),h=a(1),m=n(h),v=a(52),_=n(v),g=a(100),y=n(g),k=function(e){function t(){return(0,s["default"])(this,t),(0,d["default"])(this,(0,u["default"])(t).apply(this,arguments))}return(0,p["default"])(t,e),(0,c["default"])(t,[{key:"shouldComponentUpdate",value:function(){return!1}},{key:"render",value:function(){return m["default"].createElement("div",{className:y["default"].spinner})}}]),t}(m["default"].Component);t.LoaderSmall=function(){return m["default"].createElement("div",{className:(0,_["default"])(y["default"].spinner,y["default"].spinnerSmall)})};t["default"]=k},81:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.actions=t.saveStatus=t.saveAlias=t.saveUsername=t.removeBackground=t.removeAvatar=void 0;var n=a(25),r=a(64),u=a(80),o=t.removeAvatar=function(){return function(e,t){fetch(n.config.http+"/upload/avatar/delete",{method:"post",credentials:"include",headers:{"Content-type":n.config.post}}).then(function(){e((0,r.fetchRemoveAvatar)(!0))})}},s=t.removeBackground=function(){return function(e,t){fetch(n.config.http+"/upload/background/delete",{method:"post",credentials:"include",headers:{"Content-type":n.config.post}}).then(function(){e((0,r.fetchRemoveBackground)(!0))})}},l=t.saveUsername=function(e){return function(t,a){if(t((0,r.fetchUsername)({status:!0})),0===e.length)return t((0,r.fetchUsername)({status:!1,state:!1,message:"Поле не может быть пустым!"}));if(e.length>30)return t((0,r.fetchUsername)({status:!1,state:!1,message:"Не подходит! Придумайте более короткое имя."}));t((0,u.changeUsername)(e));var o=d({username:e});console.log(e),fetch(n.config.http+"/api/preferences/change/username",{method:"POST",headers:{"Content-type":n.config.post},credentials:"include",body:o}).then(function(e){return e.json()}).then(function(e){console.log(e),e.status,t((0,r.fetchUsername)({status:!1,state:!0,message:"Имя успешно обновлено."}))})}},c=t.saveAlias=function(e){return function(t,a){t((0,r.fetchAlias)({status:!0}));var o=new RegExp(/^[a-z\d_]{1,32}$/g);if(!o.test(e))return t((0,r.fetchAlias)({status:!1,state:!1,message:"Только латинские буквы, цифры и _"}));t((0,u.changeAlias)(e));var s=d({alias:e});fetch(n.config.http+"/api/preferences/change/alias",{method:"POST",headers:{"Content-type":n.config.post},credentials:"include",body:s}).then(function(e){return e.json()}).then(function(e){t((0,r.fetchAlias)({status:!1,state:!0,message:"Адрес успешно обновлён."}))})}},i=t.saveStatus=function(e){return console.log(e),function(t,a){t((0,r.fetchStatus)({status:!0})),e||(e=""),e.length>250&&t((0,r.fetchStatus)({status:!1,state:!1,message:"Пожалуйста, не пишите себе так много!"})),t((0,u.changeStatus)(e));var o=d({status:e});fetch(n.config.http+"/api/preferences/change/status",{method:"POST",headers:{"Content-type":n.config.post},credentials:"include",body:o}).then(function(e){return e.json()}).then(function(e){console.log(e),t((0,r.fetchStatus)({status:!1,state:!0,message:"Статус успешно обновлён."}))})}},d=function(e){var t="";return e.username&&(t+="username="+e.username+"&"),e.alias&&(t+="alias="+e.alias+"&"),e.status&&(t+="status="+e.status+"&"),e.vk&&(t+="vk="+e.vk+"&"),e.twitter&&(t+="twitter="+e.twitter+"&"),e.tumblr&&(t+="tumblr="+e.tumblr+"&"),e.instagram&&(t+="instagram="+e.instagram+"&"),t};t.actions={removeAvatar:o,removeBackground:s,saveUsername:l,saveAlias:c,saveStatus:i}},100:function(e,t){e.exports={spinner:"Loader__spinner___1FNks",rotation:"Loader__rotation___1di0_",spinnerSmall:"Loader__spinnerSmall___36DvX"}},102:function(e,t){e.exports={alias:"Preferences__alias___1pHVc",network:"Preferences__network___23w5m",status:"Preferences__status___1weNp",username:"Preferences__username___goFS5",avatar:"Preferences__avatar___2BNF1",background:"Preferences__background___37UTQ",uploadSuccess:"Preferences__uploadSuccess___1eYxL",checkmark:"Preferences__checkmark___egl8J",avatarHolder:"Preferences__avatarHolder___4975Y",backgroundHolder:"Preferences__backgroundHolder___akKts",photoPlus:"Preferences__photoPlus___UGvQb",savePreferences:"Preferences__savePreferences___36g_K",loader:"Preferences__loader___1nDm3",photoLeft:"Preferences__photoLeft___gTIU9",photoRight:"Preferences__photoRight___26_Tv",descTitle:"Preferences__descTitle___1xhDy",category:"Preferences__category___2JHnt",anim:"Preferences__anim___2njXn"}},145:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.actions=t.loadBackground=t.loadAvatar=void 0;var n=a(25),r=a(64),u=a(28),o=t.loadAvatar=function(e){return function(t,a){console.log("saving uploading avatar.."),t((0,r.fetchAvatar)({status:!0,state:!1})),fetch(n.config.http+"/upload/avatar",{method:"post",credentials:"include",body:e}).then(function(e){return e.json()}).then(function(e){t((0,r.fetchAvatar)({status:!1,state:!0})),t((0,u.patchAvatar)(e.src)),console.log(e)})["catch"](function(e){console.log("Error catched while attaching a photo",e)})}},s=t.loadBackground=function(e){return function(t,a){console.log("saving uploading background.."),t((0,r.fetchBackground)({status:!0,state:!1})),fetch(n.config.http+"/upload/background",{method:"post",credentials:"include",body:e}).then(function(e){return e.json()}).then(function(e){t((0,r.fetchBackground)({status:!1,state:!0})),t((0,u.patchBackground)(e.src)),console.log(e)})["catch"](function(e){console.log("Error catched while attaching a photo",e)})}};t.actions={loadAvatar:o,loadBackground:s}},151:function(e,t){e.exports={removePhoto:"Remove__removePhoto___2qADQ",removedPhoto:"Remove__removedPhoto___1tYS9"}},210:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.AvatarAndBackground=void 0;var r=a(3),u=n(r),o=a(4),s=n(o),l=a(5),c=n(l),i=a(7),d=n(i),f=a(6),p=n(f),h=a(1),m=n(h),v=a(213),_=n(v),g=a(214),y=n(g),k=a(211),P=n(k),b=a(212),E=n(b),A=a(102),N=n(A),T=(t.AvatarAndBackground=function(e){function t(){return(0,s["default"])(this,t),(0,d["default"])(this,(0,u["default"])(t).apply(this,arguments))}return(0,p["default"])(t,e),(0,c["default"])(t,[{key:"render",value:function(){return m["default"].createElement("div",{style:{height:"150px"}},m["default"].createElement("div",{className:N["default"].photoLeft},m["default"].createElement(_["default"],null)),m["default"].createElement("div",{className:N["default"].photoRight},m["default"].createElement(y["default"],null)))}}]),t}(h.Component),function(e){function t(){return(0,s["default"])(this,t),(0,d["default"])(this,(0,u["default"])(t).apply(this,arguments))}return(0,p["default"])(t,e),(0,c["default"])(t,[{key:"render",value:function(){return m["default"].createElement("div",null,m["default"].createElement("h3",null,"Фотографии"),m["default"].createElement("div",null,m["default"].createElement("div",{className:N["default"].photoLeft},m["default"].createElement(_["default"],null),m["default"].createElement(P["default"],null)),m["default"].createElement("div",{className:N["default"].photoRight},m["default"].createElement(y["default"],null),m["default"].createElement(E["default"],null))))}}]),t}(h.Component));t["default"]=T},211:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(3),u=n(r),o=a(4),s=n(o),l=a(5),c=n(l),i=a(7),d=n(i),f=a(6),p=n(f),h=a(1),m=n(h),v=a(10),_=a(81),g=a(151),y=n(g),k=function(e){function t(){return(0,s["default"])(this,t),(0,d["default"])(this,(0,u["default"])(t).apply(this,arguments))}return(0,p["default"])(t,e),(0,c["default"])(t,[{key:"render",value:function(){var e=this;return this.props.isRemoved?m["default"].createElement("div",{className:y["default"].removedPhoto},"фото успешно удалено"):m["default"].createElement("div",{onClick:function(){return e.props.removeAvatar()},className:y["default"].removePhoto},"удалить аватар профиля")}}]),t}(h.Component);k.propTypes={removeAvatar:h.PropTypes.func.isRequired,isRemoved:h.PropTypes.bool.isRequired};var P=function(e){return{isRemoved:e.isFetching.removeAvatar}};t["default"]=(0,v.connect)(P,_.actions)(k)},212:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(3),u=n(r),o=a(4),s=n(o),l=a(5),c=n(l),i=a(7),d=n(i),f=a(6),p=n(f),h=a(1),m=n(h),v=a(10),_=a(81),g=a(151),y=n(g),k=function(e){function t(){return(0,s["default"])(this,t),(0,d["default"])(this,(0,u["default"])(t).apply(this,arguments))}return(0,p["default"])(t,e),(0,c["default"])(t,[{key:"render",value:function(){var e=this;return this.props.isRemoved?m["default"].createElement("div",{className:y["default"].removedPhoto},"фон успешно удалён"):m["default"].createElement("div",{onClick:function(){return e.props.removeBackground()},className:y["default"].removePhoto},"удалить фон")}}]),t}(h.Component);k.propTypes={removeBackground:h.PropTypes.func.isRequired,isRemoved:h.PropTypes.bool.isRequired};var P=function(e){return{isRemoved:e.isFetching.removeBackground}};t["default"]=(0,v.connect)(P,_.actions)(k)},213:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e){return{isFetching:e.isFetching.avatar}}function u(e){return{loadAvatar:function(t){return e((0,E.loadAvatar)(t))}}}Object.defineProperty(t,"__esModule",{value:!0});var o=a(3),s=n(o),l=a(4),c=n(l),i=a(5),d=n(i),f=a(7),p=n(f),h=a(6),m=n(h),v=a(1),_=n(v),g=a(102),y=n(g),k=a(10),P=a(29),b=n(P),E=a(145),A=a(67),N=b["default"].bind(y["default"]),T=function(e){function t(){return(0,c["default"])(this,t),(0,p["default"])(this,(0,s["default"])(t).apply(this,arguments))}return(0,m["default"])(t,e),(0,d["default"])(t,[{key:"uploadAvatar",value:function(){var e=this.avatarForm,t=new FormData;t.append("file",e[0].files[0]),this.props.loadAvatar(t)}},{key:"render",value:function(){var e,t=this,a=this.props.isFetching,n=a.state,r=a.status;return e=r?_["default"].createElement("div",{className:y["default"].loader},_["default"].createElement(A.LoaderSmall,null)):_["default"].createElement("div",{className:y["default"].photoPlus},"+"),n===!0&&(e=_["default"].createElement("div",{className:y["default"].checkmark})),_["default"].createElement("div",null,_["default"].createElement("div",{className:y["default"].avatarHolder},_["default"].createElement("button",{onClick:function(){return t.avatarInput.click()},className:N({avatar:!0,uploadSuccess:a.state})},_["default"].createElement("div",null,e),!a.status&&"ФОТО")),_["default"].createElement("div",{className:y["default"].descTitle},"Добавьте фото профиля."),_["default"].createElement("form",{ref:function(e){return t.avatarForm=e},encType:"multipart/form-data",method:"post",className:"hidden"},_["default"].createElement("input",{type:"file",onChange:this.uploadAvatar.bind(this),name:"avatar",id:"file-avatar",ref:function(e){return t.avatarInput=e}})))}}]),t}(v.Component);T.propTypes={loadAvatar:v.PropTypes.func.isRequired,isFetching:v.PropTypes.object.isRequired},t["default"]=(0,k.connect)(r,u)(T)},214:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}function r(e){return{isFetching:e.isFetching.background}}function u(e){return{loadBackground:function(t){return e((0,E.loadBackground)(t))}}}Object.defineProperty(t,"__esModule",{value:!0});var o=a(3),s=n(o),l=a(4),c=n(l),i=a(5),d=n(i),f=a(7),p=n(f),h=a(6),m=n(h),v=a(1),_=n(v),g=a(102),y=n(g),k=a(10),P=a(29),b=n(P),E=a(145),A=a(67),N=b["default"].bind(y["default"]),T=function(e){function t(){return(0,c["default"])(this,t),(0,p["default"])(this,(0,s["default"])(t).apply(this,arguments))}return(0,m["default"])(t,e),(0,d["default"])(t,[{key:"uploadBackground",value:function(){var e=this.backgroundForm,t=new FormData;t.append("file",e[0].files[0]),this.props.loadBackground(t)}},{key:"render",value:function(){var e,t=this,a=this.props.isFetching,n=a.state,r=a.status;return e=r?_["default"].createElement("div",{className:y["default"].loader},_["default"].createElement(A.LoaderSmall,null)):_["default"].createElement("div",{className:y["default"].photoPlus},"+"),n===!0&&(e=_["default"].createElement("div",{className:y["default"].checkmark})),_["default"].createElement("div",null,_["default"].createElement("div",{className:y["default"].backgroundHolder},_["default"].createElement("button",{onClick:function(){return t.backgroundInput.click()},className:N({background:!0,uploadSuccess:a.state})},_["default"].createElement("div",null,e),!a.status&&"ФОН")),_["default"].createElement("div",{className:y["default"].descTitle},"Загрузите фон."),_["default"].createElement("form",{ref:function(e){return t.backgroundForm=e},encType:"multipart/form-data",method:"post",className:"hidden"},_["default"].createElement("input",{type:"file",onChange:this.uploadBackground.bind(this),name:"background",id:"file-avatar",ref:function(e){return t.backgroundInput=e}})))}}]),t}(v.Component);T.propTypes={loadBackground:v.PropTypes.func,isFetching:v.PropTypes.bool.isRequired},t["default"]=(0,k.connect)(r,u)(T)}});