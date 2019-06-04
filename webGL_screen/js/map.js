(function() {
	class DatePick {
		constructor() {
	  }
		show() {
			alert(100);
		}
	}
	
	
	window.DatePick = DatePick;
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/*Calendar-start*/
  window.Calendar = function(beginYear, endYear, date2StringPattern, string2DatePattern, language, patternDelimiter) {
    this.beginYear = beginYear || 1990;
    this.endYear   = endYear   || 2020;
    this.language  = language  || 0;
    this.patternDelimiter = patternDelimiter     || "-";
    this.date2StringPattern = date2StringPattern || Calendar.language["date2StringPattern"][this.language].replace(/\-/g, this.patternDelimiter);
    this.string2DatePattern = string2DatePattern || Calendar.language["string2DatePattern"][this.language];
    this.dateControl = null;
    this.panel  = this.getElementById("__calendarPanel");
    this.iframe = window.frames["__calendarIframe"];
    this.form   = null;
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth();
    this.colors = {"bg_cur_day":"#DEDEDE","bg_over":"#FFFFFF","bg_out":"#DEDEDE"}
  };
  Calendar.language = {
    "year"   : ["", "", "", "\u5e74"],
    "months" : [
          ["1","2","3","4","5","6","7","8","9","10","11","12"],
          ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
          ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
          ["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"]
          ],
    "weeks"  : [["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],
          ["Sun","Mon","Tur","Wed","Thu","Fri","Sat"],
          ["Sun","Mon","Tur","Wed","Thu","Fri","Sat"],
          ["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"]
      ],
    "clear"  : ['清除', "Clear", "Clear", "\u6e05\u7a7a"],
    "today"  : ['今天', "Today", "Today", "\u4eca\u5929"],
    "close"  : ['确定', "Close", "Close", "\u95dc\u9589"],
    "date2StringPattern" : ["yyyy-MM-dd", "yyyy-MM-dd", "yyyy-MM-dd", "yyyy-MM-dd"],
    "string2DatePattern" : ["ymd","ymd", "ymd", "ymd"]
  };
  //<input type="text" style="width:16px;display:inline-block;"/><input type="text" style="width:16px;display:inline-block;"/><input type="text" style="width:16px;display:inline-block;"/>
  Calendar.prototype.draw = function() {
    calendar = this;
    var _cs = [];
    _cs[_cs.length] = '<form id="__calendarForm" name="__calendarForm" method="post">';
    _cs[_cs.length] = '<table id="__calendarTable" width="100%" border="0" cellpadding="3" cellspacing="1" align="center">';
    _cs[_cs.length] = ' <tr>';
    _cs[_cs.length] = '  <th><input class="l" name="goPrevMonthButton" type="button" id="goPrevMonthButton" value="&lt;" \/><\/th>';
    _cs[_cs.length] = '  <th colspan="5"><select class="year" name="yearSelect" id="yearSelect"><\/select><select class="month" name="monthSelect" id="monthSelect"><\/select><\/th>';
    _cs[_cs.length] = '  <th colspan="2"><input class="r" name="goNextMonthButton" type="button" id="goNextMonthButton" value="&gt;" \/><\/th>';
    _cs[_cs.length] = ' <\/tr>';
    if(calendar.date2StringPattern == "yyyy-MM-dd hh:mm:ss") {
      var hs = "", mss = "";
      for(var i=0;i<24;i++) {
        hs += '<option value="' + i + '">' + (i < 10 ? "0" + i : i) + '</option>';
      }
      for(var i=0;i<60;i++) {
        mss += '<option value="' + i + '">' + (i < 10 ? "0" + i : i) + '</option>';
      }
      //_cs[_cs.length] = '<tr><th></th><th colspan="5"><input type="text" class="h" name="h" id="h" style="width:26px;" onkeydown="return _inputNumber(event, this, 23);" onkeyup="_afterInputNumber(event, this, 23)" onblur="_afterInputNumber(event, this, 23)"/>&nbsp;:&nbsp;<input type="text" class="m" name="m" id="m" style="width:26px;"onkeydown="return _inputNumber(event, this, 59);" onkeyup="_afterInputNumber(event, this, 59)" onblur="_afterInputNumber(event, this, 59)"/>&nbsp;:&nbsp;<input type="text" class="s" name="s" id="s" style="width:26px;"onkeydown="return _inputNumber(event, this, 59);" onkeyup="_afterInputNumber(event, this, 59)" onblur="_afterInputNumber(event, this, 59)"/></th><th></th></tr>';
      _cs[_cs.length] = '<tr><th colspan="7"><select class="h" name="h" id="h" style="width: 48px;">' + hs + '<\/select>&nbsp;:&nbsp;<select class="m" name="m" id="m" style="width: 48px;">' + mss + '<\/select>&nbsp;:&nbsp;<select class="s" name="s" id="s" style="width: 48px;">' + mss + '<\/select></th></tr>';
    } else {
      _cs[_cs.length] = '<tr><th>&nbsp;</th></tr>';
    }
    _cs[_cs.length] = ' <tr>';
    for(var i = 0; i < 7; i++) {
      _cs[_cs.length] = '<th class="theader">';
      _cs[_cs.length] = Calendar.language["weeks"][this.language][i];
      _cs[_cs.length] = '<\/th>'; 
    }
    _cs[_cs.length] = '<\/tr>';
    for(var i = 0; i < 6; i++){
      _cs[_cs.length] = '<tr align="center">';
      for(var j = 0; j < 7; j++) {
        switch (j) {
          case 0: _cs[_cs.length] = '<td class="sun">&nbsp;<\/td>'; break;
          case 6: _cs[_cs.length] = '<td class="sat">&nbsp;<\/td>'; break;
          default:_cs[_cs.length] = '<td class="normal">&nbsp;<\/td>'; break;
        }
      }
      _cs[_cs.length] = '<\/tr>';
    }
    _cs[_cs.length] = ' <tr>';
    _cs[_cs.length] = '  <th colspan="2"><input type="button" class="b" name="clearButton" id="clearButton" style="margin-top: -4px;" \/><\/th>';
    _cs[_cs.length] = '  <th colspan="3"><input type="button" class="b" name="selectTodayButton" id="selectTodayButton" style="margin-top: -4px;" \/><\/th>';
    _cs[_cs.length] = '  <th colspan="2"><input type="button" class="b" name="closeButton" id="closeButton" style="margin-top: -4px;" \/><\/th>';
    _cs[_cs.length] = ' <\/tr>';
    _cs[_cs.length] = '<\/table>';
    _cs[_cs.length] = '<\/form>';
    this.iframe.document.body.innerHTML = _cs.join("");
    this.form = this.iframe.document.forms["__calendarForm"];
    this.form.clearButton.value = Calendar.language["clear"][this.language];
    this.form.selectTodayButton.value = Calendar.language["today"][this.language];
    this.form.closeButton.value = Calendar.language["close"][this.language];
    this.form.goPrevMonthButton.onclick = function () {calendar.goPrevMonth(this);}
    this.form.goNextMonthButton.onclick = function () {calendar.goNextMonth(this);}
    this.form.yearSelect.onchange = function () {
      calendar.update(this);
      if(calendar.date2StringPattern == "yyyy" || calendar.date2StringPattern == "yyyy-MM") {
        calendar.dateControl.value = new Date(calendar.date.getFullYear(), calendar.date.getMonth(), 1).format(calendar.date2StringPattern)
      }
    }
    this.form.monthSelect.onchange = function () {
      calendar.update(this);
      if(calendar.date2StringPattern == "yyyy" || calendar.date2StringPattern == "yyyy-MM") {
        calendar.dateControl.value = new Date(calendar.date.getFullYear(), calendar.date.getMonth(), 1).format(calendar.date2StringPattern)
      }
    }
    this.form.clearButton.onclick = function () {calendar.dateControl.value = "";calendar.hide();}
    this.form.closeButton.onclick = function () {
      if(calendar.date2StringPattern == "yyyy-MM-dd hh:mm:ss") {
        var G = calendar.dateControl.value.split(" ");
        if(G.length > 1) {
          var K = calendar.trans(calendar.form.h.value, calendar.form.m.value, calendar.form.s.value);
          calendar.dateControl.value = G[0] + " " + (K[0] < 10 ? "0" + K[0] : K[0]) + ":" + (K[1] < 10 ? "0" + K[1] : K[1]) + ":" + (K[2] < 10 ? "0" + K[2] : K[2]);
        }
      }
      calendar.hide();
    }
    this.form.selectTodayButton.onclick = function () {
      var today = new Date();
      calendar.date = today;
      calendar.year = today.getFullYear();
      calendar.month = today.getMonth();
      calendar.dateControl.value = today.format(calendar.date2StringPattern);
      calendar.hide();
    }
  };
  Calendar.prototype.trans = function(h, m, s) {
    var h = parseInt(h, 10);
    var m = parseInt(m, 10);
    var s = parseInt(s, 10);
    if(!(typeof h == "number" && isFinite(h))) {
      h = 0;
    }
    if(!(typeof m == "number" && isFinite(m))) {
      m = 0;
    }
    if(!(typeof s == "number" && isFinite(s))) {
      s = 0;
    }
    /*if(h < 10) {
      h = "0" + h;
    }
    if(m < 10) {
      m = "0" + m;
    }
    if(s < 10) {
      s = "0" + s;
    }*/
    return [h, m, s];
  };
  Calendar.prototype.bindYear = function() {
    var ys = this.form.yearSelect;
    ys.length = 0;
    for (var i = this.beginYear; i <= this.endYear; i++){
      ys.options[ys.length] = new Option(i + Calendar.language["year"][this.language], i);
    }
  };
  Calendar.prototype.bindMonth = function() {
    var ms = this.form.monthSelect;
    ms.length = 0;
    for (var i = 0; i < 12; i++){
      ms.options[ms.length] = new Option(Calendar.language["months"][this.language][i], i);
    }
  };
  Calendar.prototype.goPrevMonth = function(e){
    if (this.year == this.beginYear && this.month == 0){return;}
    this.month--;
    if (this.month == -1) {
      this.year--;
      this.month = 11;
    }
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
  };
  Calendar.prototype.goNextMonth = function(e){
    if (this.year == this.endYear && this.month == 11){return;}
    this.month++;
    if (this.month == 12) {
      this.year++;
      this.month = 0;
    }
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
  };
  Calendar.prototype.changeSelect = function() {
    var ys = this.form.yearSelect;
    var ms = this.form.monthSelect;
    for (var i= 0; i < ys.length; i++){
      if (ys.options[i].value == this.date.getFullYear()){
        ys[i].selected = true;
        break;
      }
    }
    for (var i= 0; i < ms.length; i++){
      if (ms.options[i].value == this.date.getMonth()){
        ms[i].selected = true;
        break;
      }
    }
  };
  Calendar.prototype.update = function (e){
    this.year  = e.form.yearSelect.options[e.form.yearSelect.selectedIndex].value;
    this.month = e.form.monthSelect.options[e.form.monthSelect.selectedIndex].value;
    this.date = new Date(this.year, this.month, 1);
    this.changeSelect();
    this.bindData();
  };
  Calendar.prototype.bindData = function () {
    var calendar = this;
    var dateArray = this.getMonthViewDateArray(this.date.getFullYear(), this.date.getMonth());
    var tds = this.getElementsByTagName("td", this.getElementById("__calendarTable", this.iframe.document));
    for(var i = 0; i < tds.length; i++) {
        tds[i].style.backgroundColor = calendar.colors["bg_over"];
      tds[i].onclick = null;
      tds[i].onmouseover = null;
      tds[i].onmouseout = null;
      tds[i].innerHTML = dateArray[i] || "&nbsp;";
      if (i > dateArray.length - 1) continue;
      if (dateArray[i]){
        tds[i].onclick = function () {
          if (calendar.dateControl){
            if(calendar.date2StringPattern == "yyyy-MM-dd hh:mm:ss") {
              var K = calendar.trans(calendar.form.h.value, calendar.form.m.value, calendar.form.s.value);
              calendar.dateControl.value = new Date(calendar.date.getFullYear(), calendar.date.getMonth(), this.innerHTML, K[0], K[1], K[2]).format(calendar.date2StringPattern);
            } else {
              calendar.dateControl.value = new Date(calendar.date.getFullYear(), calendar.date.getMonth(), this.innerHTML).format(calendar.date2StringPattern);
            }
          }
          calendar.hide();
        }
        tds[i].onmouseover = function () {this.style.backgroundColor = calendar.colors["bg_out"];}
        tds[i].onmouseout  = function () {this.style.backgroundColor = calendar.colors["bg_over"];}
        var today = new Date();
        if (today.getFullYear() == calendar.date.getFullYear()) {
          if (today.getMonth() == calendar.date.getMonth()) {
            if (today.getDate() == dateArray[i]) {
              tds[i].style.backgroundColor = calendar.colors["bg_cur_day"];
              tds[i].onmouseover = function () {this.style.backgroundColor = calendar.colors["bg_out"];}
              tds[i].onmouseout  = function () {this.style.backgroundColor = calendar.colors["bg_cur_day"];}
            }
          }
        }
      }
    }
  };
  Calendar.prototype.getMonthViewDateArray = function (y, m) {
    var dateArray = new Array(42);
    var dayOfFirstDate = new Date(y, m, 1).getDay();
    var dateCountOfMonth = new Date(y, m + 1, 0).getDate();
    for (var i = 0; i < dateCountOfMonth; i++) {
      dateArray[i + dayOfFirstDate] = i + 1;
    }
    return dateArray;
  };

  Calendar.prototype.show = function (dateControl, popuControl) {
    if (this.panel.style.visibility == "visible") {
      this.panel.style.visibility = "hidden";
    }
    if (!dateControl){
      throw new Error("arguments[0] is necessary!")
    }
    this.dateControl = dateControl;
    popuControl = popuControl || dateControl;

    this.draw();
    this.bindYear();
    this.bindMonth();
    if (dateControl.value.length > 0){
      this.date  = new Date(dateControl.value.toDate(this.patternDelimiter, this.string2DatePattern));
      this.year  = this.date.getFullYear();
      this.month = this.date.getMonth();
  //alert(this.date.getHours() + "    " + this.date.getMinutes() + "    " + this.date.getSeconds());
      this.h = this.date.getHours();
      this.m = this.date.getMinutes();
      this.s = this.date.getSeconds();
    }
    this.changeSelect();
    this.bindData();
    if(this.date2StringPattern == "yyyy-MM-dd hh:mm:ss") {
      var K = calendar.trans(this.date.getHours(), this.date.getMinutes(), this.date.getSeconds());
      this.form.h.value = K[0];
      this.form.m.value = K[1];
      this.form.s.value = K[2];
    }
    var xy = this.getAbsPoint(popuControl);
    this.panel.style.left = xy.x + "px";
    this.panel.style.top = (xy.y + dateControl.offsetHeight) + "px";
    this.panel.style.visibility = "visible";
    //$(document).bind("mousedown", {scope : this}, this.onMouseDown);
    //if(top.document) {
      //$(top.document).bind("mousedown", {scope : this}, this.onMouseDown);
    //}
  };
  Calendar.prototype.onMouseDown = function(e) {
    e.data.scope.hide();
    //$(document).unbind("mousedown", e.data.scope.onMouseDown);
    //if(top.document) {
      //$(top.document).unbind("mousedown", e.data.scope.onMouseDown);
    //}
  };
  Calendar.prototype.hide = function() {
    this.panel.style.visibility = "hidden";
  };
  Calendar.prototype.getElementById = function(id, object){
    object = object || document;
    return document.getElementById ? object.getElementById(id) : document.all(id);
  };
  Calendar.prototype.getElementsByTagName = function(tagName, object){
    object = object || document;
    return document.getElementsByTagName ? object.getElementsByTagName(tagName) : document.all.tags(tagName);
  };
  Calendar.prototype.getAbsPoint = function (e){
    var x = e.offsetLeft;
    var y = e.offsetTop;
    while(e = e.offsetParent){
      x += e.offsetLeft;
      y += e.offsetTop;
    }
    return {"x": x, "y": y};
  };
  Date.prototype.format = function(style) {
    var o = {
      "M+" : this.getMonth() + 1, //month
      "d+" : this.getDate(),      //day
      "h+" : this.getHours(),     //hour
      "m+" : this.getMinutes(),   //minute
      "s+" : this.getSeconds(),   //second
      "w+" : "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(this.getDay()),   //week
      "q+" : Math.floor((this.getMonth() + 3) / 3),  //quarter
      "S"  : this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(style)) {
      style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for(var k in o){
      if (new RegExp("("+ k +")").test(style)){
        style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return style;
  };
  String.prototype.toDate = function(delimiter, pattern) {
    delimiter = delimiter || "-";
    pattern = pattern || "ymd";
    var a = this.split(delimiter);
    var y = parseInt(a[pattern.indexOf("y")], 10);
    if(a.length == 1) {
      return new Date(y, 0, 1);
    } 
    //remember to change this next century ;)
    if(y.toString().length <= 2) y += 2000;
    if(isNaN(y)) y = new Date().getFullYear();
    var m = parseInt(a[pattern.indexOf("m")], 10) - 1;
    var d = a[pattern.indexOf("d")];
    if(typeof d == "undefined") {
      d = 1;
      return new Date(y, m, d);
    } else {
      var _d = d.split(" ");
      d = parseInt(_d[0], 10);
      if(isNaN(d)) d = 1;
      if(_d[1]) {
        _d = _d[1].split(":");
        return new Date(y, m, d, parseInt(_d[0], 10), parseInt(_d[1], 10), parseInt(_d[2], 10));
      } else {
        return new Date(y, m, d);
      }
    }
  };
  document.writeln('<div id="__calendarPanel" style="position:absolute;visibility:hidden;z-index:9999;background-color:#FFFFFF;border:1px solid #666666;width:200px;height:256px;border-radius: 3px 3px 3px 3px;border: 1px solid #C6C6C6;box-shadow: 0 1px 3px rgba(34, 25, 25, 0.4);-moz-box-shadow: 0 1px 3px rgba(34, 25, 25, 0.4);-webkit-box-shadow: 0 1px 3px rgba(34, 25, 25, 0.4);filter: progid:DXImageTransform.Microsoft.shadow(color=#D9D9D9,direction=120,strength=4);">');
  document.writeln('<iframe name="__calendarIframe" id="__calendarIframe" width="100%" height="100%" scrolling="no" frameborder="0" style="margin:0px;"><\/iframe>');
  var __ci = window.frames['__calendarIframe'];
  __ci.document.writeln('<!DOCTYPE html>');
  __ci.document.writeln('<html>');
  __ci.document.writeln('<head>');
  __ci.document.writeln('<meta http-equiv="Content-Type" content="text\/html; charset=utf-8" \/>');
  __ci.document.writeln('<title>Web Calendar(UTF-8) Written By KimSoft<\/title>');
  __ci.document.writeln('<style type="text\/css">');
  __ci.document.writeln('<!--');
  __ci.document.writeln('body {font-size:12px;margin:0px;text-align:center;font-family:arial,helvetica,clean,sans-serif;background-color:#FFFFFF;}');
  __ci.document.writeln('form {margin:0px;padding-top:6px;}');
  __ci.document.writeln('select {font-size:12px;padding:3px;border:1px solid #EEEEEE;background:#FFFFFF;}');
  __ci.document.writeln('table {border:0px solid #CCCCCC;background-color:#FFFFFF}');
  __ci.document.writeln('th {font-size:12px;font-weight:normal;background-color:#FFFFFF;}');
  __ci.document.writeln('th.theader {font-weight:normal;background-color:#00B7EE;color:#FFFFFF;font-weight:bold;width:24px;}');
  __ci.document.writeln('select.year {width:64px;}');
  __ci.document.writeln('select.month {width:60px;}');
  __ci.document.writeln('td {font-size:12px;text-align:center;cursor:pointer;}');
  __ci.document.writeln('td.sat {color:#FF0000;background-color:#EFEFEF;}');
  __ci.document.writeln('td.sun {color:#FF0000;}');
  __ci.document.writeln('td.normal {background-color:#EFEFEF;}');
  __ci.document.writeln('input.l {cursor:pointer;border:none;background-color:#FFFFFF;}');
  __ci.document.writeln('input.r {cursor:pointer;border:none;background-color:#FFFFFF;}');
  __ci.document.writeln('input.b {cursor:pointer;border:none;background-color:#FFFFFF;color:#333333;}');
  __ci.document.writeln('input.b:hover {cursor:pointer;border:none;background-color:#FFFFFF;color:red;}');
  __ci.document.writeln('-->');
  __ci.document.writeln('<\/style>');
  __ci.document.writeln('<script>');
  __ci.document.writeln('var _inputNumber = function(event, o, max) {var k = event.keyCode;if((k <= 57 && k >= 48) || (k <= 105 && k >= 96) || (k == 8)) {return true;} else {return false;}};this._afterInputNumber = function(event, o, max) {if(o.value < 0 || o.value > max) {o.value = "";}};');
  __ci.document.writeln('<\/script>');
  __ci.document.writeln('<\/head>');
  __ci.document.writeln('<body>');
  __ci.document.writeln('<\/body>');
  __ci.document.writeln('<\/html>');
  __ci.document.close();
  document.writeln('<\/div>');
  var calendar = new Calendar();
})();