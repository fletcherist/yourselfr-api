webpackJsonp([18],{29:function(e,t,i){var a,n;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
!function(){"use strict";function i(){for(var e=[],t=0;t<arguments.length;t++){var a=arguments[t];if(a){var n=typeof a;if("string"===n||"number"===n)e.push(this&&this[a]||a);else if(Array.isArray(a))e.push(i.apply(this,a));else if("object"===n)for(var o in a)l.call(a,o)&&a[o]&&e.push(this&&this[o]||o)}}return e.join(" ")}var l={}.hasOwnProperty;"undefined"!=typeof e&&e.exports?e.exports=i:(a=[],n=function(){return i}.apply(t,a),!(void 0!==n&&(e.exports=n)))}()},79:function(e,t,i){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=i(3),l=a(n),o=i(4),u=a(o),r=i(5),d=a(r),s=i(7),c=a(s),f=i(6),_=a(f),m=i(1),h=a(m),v=i(29),p=a(v),g=i(87),E=a(g),N=i(18),y=i(10),k=i(28),b=i(19),M=p["default"].bind(E["default"]),C={backgroundColor:"rgb(246, 246, 246)"},P=function(e){function t(e){(0,u["default"])(this,t);var i=(0,c["default"])(this,(0,l["default"])(t).call(this,e));return i.state={hideMenu:!0},i}return(0,_["default"])(t,e),(0,d["default"])(t,[{key:"toggle",value:function(){this.setState({hideMenu:!this.state.hideMenu})}},{key:"render",value:function(){var e=this;return h["default"].createElement("div",{className:E["default"].navigation},this.props.isAuthenticated&&h["default"].createElement("div",null,h["default"].createElement("div",{className:E["default"].yoButton,title:"Вернуться на главную - Йорселфер",onClick:this.toggle.bind(this)}),h["default"].createElement("div",{title:"Main Menu",className:M({menu:!0,hiddenMenu:this.state.hideMenu})},h["default"].createElement("div",{className:E["default"].element,onClick:this.toggle.bind(this)},h["default"].createElement(N.Link,{to:"/"+this.props.user.alias},h["default"].createElement("div",{title:"перейти к профилю",className:E["default"].photo,onClick:function(){return e.props.loadUser(e.props.user.alias)}},h["default"].createElement("img",{src:(0,b.isValidPhoto)(this.props.user.photo)})),h["default"].createElement("div",null,"профиль"))),h["default"].createElement("div",{className:E["default"].element,onClick:this.toggle.bind(this)},h["default"].createElement(N.Link,{to:"/feed",activeStyle:C},h["default"].createElement("div",{title:"мнения о друзьях",className:M(E["default"].icon,E["default"].iconFeed)}),h["default"].createElement("div",null,"лента"))),h["default"].createElement("div",{className:E["default"].element,onClick:this.toggle.bind(this)},h["default"].createElement(N.Link,{to:"/preferences",activeStyle:C},h["default"].createElement("div",{title:"настройки профиля",className:M(E["default"].icon,E["default"].iconPreferences)}),h["default"].createElement("div",null,"настройки"))),h["default"].createElement("div",{className:E["default"].element,onClick:this.toggle.bind(this)},h["default"].createElement(N.Link,{to:"/"+this.props.user.alias+"/followers",activeStyle:C},h["default"].createElement("div",{title:"люди, подписанные на вас",className:M(E["default"].icon,E["default"].iconFollowers)}),h["default"].createElement("div",null,"подписчики"))),h["default"].createElement("div",{className:E["default"].element,onClick:this.toggle.bind(this)},h["default"].createElement(N.Link,{to:"/"+this.props.user.alias+"/following",activeStyle:C},h["default"].createElement("div",{title:"люди, на которых подписаны вы",className:M(E["default"].icon,E["default"].iconFollowing)}),h["default"].createElement("div",null,"подписки"))),h["default"].createElement("div",{className:E["default"].element,onClick:this.toggle.bind(this)},h["default"].createElement("a",{href:"http://yoursel.fr/auth/logout"},h["default"].createElement("div",{title:"выйти",className:M(E["default"].icon,E["default"].iconLogout)}),h["default"].createElement("div",null,"выход"))))),!this.props.isAuthenticated&&h["default"].createElement(N.Link,{to:"/signup"},h["default"].createElement("div",{className:E["default"].yoButton,title:"Вернуться на главную - Йорселфер",onClick:this.toggle.bind(this)})))}}]),t}(m.Component);P.propTypes={isAuthenticated:m.PropTypes.bool.isRequired,user:m.PropTypes.object,loadUser:m.PropTypes.func.isRequired};var w=function(e){return{isAuthenticated:e.auth.authenticated,user:e.auth.user}},F=function(e){return{loadUser:function(t){return e((0,k.loadUser)(t))}}};t["default"]=(0,y.connect)(w,F)(P)},87:function(e,t){e.exports={navigation:"Navigation__navigation___1IO9e",yoButton:"Navigation__yoButton___2bfyV",menu:"Navigation__menu___3VviX",hiddenMenu:"Navigation__hiddenMenu___37ROC",element:"Navigation__element___dzEW6",photo:"Navigation__photo___1Armo",icon:"Navigation__icon___nRf4j",iconProfile:"Navigation__iconProfile___2_5pL",iconFeed:"Navigation__iconFeed___2Ikob",iconPreferences:"Navigation__iconPreferences___MqiEY",iconFollowers:"Navigation__iconFollowers___5fBny",iconFollowing:"Navigation__iconFollowing___2qePr",iconLogout:"Navigation__iconLogout___1k-xQ"}},587:function(e,t,i){"use strict";function a(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.NotFoundView=void 0;var n=i(3),l=a(n),o=i(4),u=a(o),r=i(5),d=a(r),s=i(7),c=a(s),f=i(6),_=a(f),m=i(1),h=a(m),v=i(853),p=a(v),g=i(79),E=a(g),N=t.NotFoundView=function(e){function t(){return(0,u["default"])(this,t),(0,c["default"])(this,(0,l["default"])(t).apply(this,arguments))}return(0,_["default"])(t,e),(0,d["default"])(t,[{key:"render",value:function(){return h["default"].createElement("div",{className:"container text-center"},h["default"].createElement(E["default"],null),h["default"].createElement("div",{className:p["default"].title},"404"))}}]),t}(h["default"].Component);t["default"]=N},853:function(e,t){e.exports={title:"_404__title___1qEmW"}}});