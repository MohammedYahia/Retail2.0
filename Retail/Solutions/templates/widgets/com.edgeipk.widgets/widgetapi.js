
window.widgetapi = {};

widgetapi = {
  _initialise: function() {
    
  },
  
  __parameters: new Array(),
/*
  __widgetHandlerDefinitions: new Array(),

  __widgetHandlerInstances: new Array(),

  __widgetHandlerInstanceMethods: new Array(),

  defineWidgetHandler: function(name,variableArray,methodArray) {
    widgetapi.__widgetHandlerDefinitions[name] = function(){};
    var d = widgetapi.__widgetHandlerDefinitions[name];
    widgetapi.__widgetHandlerInstances[name] = new Array();
    widgetapi.__widgetHandlerInstanceMethods[name] = methodArray;

    // we could hold all variables within the classes themselves rather than in the widgetapi object, but I'd already coded this by that time!

    // mix in standard static and instance functions
    d.prototype.get = function(param) {
      return widgetapi.get(name,param);
    };
    d.prototype.has = function(param) {
      return widgetapi.has(name,param);
    };
    d.prototype.set = function(param,value) {
      return widgetapi.set(name,param,value);
    };

    d.__className = name;

    // mix in convenience helper instance methods 
    var v;
    for (var i = 0;i < variableArray.length;i++) {
      v = variableArray[i];
      vc = v.substring(0,1).toUpperCase() + v.substring(1);
      d.prototype["get" + vc] = function() {
        return this.get(v);
      };
      d.prototype["has" + vc] = function() {
        return this.has(v);
      };
      d.prototype["set" + vc] = function(value) {
        return this.set(v,value);
      };
    }
  },

  createWidgetHandler: function(name,instanceid) {
    // create instance
    var d = widgetapi.__widgetHandlerDefinitions[name];
    var ins = new widgetapi.__widgetHandlerDefinitions[name]();
    ins._instanceid = instanceid;

    // mix in instance methods
    var ma = widgetapi.__widgetHandlerInstanceMethods[name];
    for (method in ma) {
      ins[method] = ma[method];
    }

    widgetapi.__widgetHandlerInstances[name][instanceid] = ins;
    return ins;
  },
 */

  __widgets: new Array(),

  registerWidget: function(itemid,widget) {
    widgetapi.__widgets[itemid] = widget;
  },

  getWidget: function(itemid) {
    var w = widgetapi.__widgets[itemid];
    return w;
  },

  // helper method 
  setStyle: function(widget,style,value) {
    if (value.trim().length == 0) return;
    widget[style] = value;
  },

  setReadOnly: function(widget,rostring) {
    widget.readOnly = ("true"==rostring.trim().toLowerCase());
  },

  removeClassName: function(element,className) {
    if (undefined == (typeof className) || className.trim().length==0) return;
    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').trim();
  },
  
  addClassName: function(element,className) {
    if (undefined == (typeof className) || "string" != (typeof className) || className.trim().length==0) return;
    if (!widgetapi.hasClassName(element, className)) {
      element.className += (element.className ? ' ' : '') + className;
    }

  },
  
  hasClassName: function(element,className) {
    if (undefined == (typeof className) || className.trim().length==0) return false;
    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className ||
      new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  },

/*
  // parameter get/set
  get: function(control,instanceid,paramname) {
    if (!widgetapi.has(control,instanceid,paramname)) return undefined;
    return widgetapi.__parameters[control][instanceid][paramname];
  },
  set: function(control,instanceid,paramname,value) {
    if ("undefined"==typeof widgetapi.__parameters[control]) {
      widgetapi.__parameters[control] = new Array();
      widgetapi.__parameters[control][instanceid] = new Array();
    } else {
      if ("undefined"==typeof widgetapi.__parameters[control][instanceid]) {
        widgetapi.__parameters[control][instanceid] = new Array();
      }
    }
    widgetapi.__parameters[control][instanceid][paramname] = value;
  },
  has: function(control,instanceid,paramname) {
    if ("undefined"==typeof widgetapi.__parameters) return false;
    if ("undefined"==typeof widgetapi.__parameters[control]) return false;
    if ("undefined"==typeof widgetapi.__parameters[control][instanceid]) return false;
    return ("undefined" != typeof widgetapi.__parameters[control][instanceid][paramname]);
  },
*/
  __test: function(elid) {
    var el = document.getElementById(elid);
    var o = el.innerHTML;
    o += "Is adamwidget's colour set?: " + widgetapi.has("adamwidget","1","colour") + "<br/>";
    o += "Setting colour<br/>";
    widgetapi.set("adamwidget","1","colour","blue");
    o += "Is adamwidget's colour set?: " + widgetapi.has("adamwidget","1","colour") + "<br/>";
    o += "What is the colour?: " + widgetapi.get("adamwidget","1","colour") + "<br/>";
    o += "Test complete<br/>";
    el.innerHTML = o;

    el.innerHTML = el.innerHTML + "<h3>Widget handler tests</h3>";
    el.innerHTML = el.innerHTML + "Creating widget definition<br/>";
    var va = new Array();
    va.push("someProperty");
    var ma = {};
    ma = {someMethod: function(someparam) {el.innerHTML = el.innerHTML + "someMethod called with " + someparam + "<br/>";} };
    widgetapi.defineWidgetHandler("mywidgethandler",va,ma);
    el.innerHTML = el.innerHTML + "Instantiating widget<br/>";
    var w = widgetapi.createWidgetHandler("someid");
    el.innerHTML = el.innerHTML + "Calling widget's getSomePropety method<br/>";
    el.innerHTML = el.innerHTML + "Result: " + w.getSomeProperty() + "<br/>";
    el.innerHTML = el.innerHTML + "Calling widget's someMethod method<br/>";
    w.someMethod("wibble");
    el.innerHTML = el.innerHTML + "<b>Test complete: pass</b><br/>";

  }
};
widgetapi._initialise();

