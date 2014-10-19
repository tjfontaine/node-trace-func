var Module = require('module');

var dtrace = require('dtrace-provider');
var falafel = require('falafel');

var dtp = dtrace.createDTraceProvider('trace-func');
dtp.addProbe('func-entry', 'char*', 'char*');
dtp.addProbe('func-exit', 'char*', 'char*');
dtp.enable();

dtrace._trace_func = dtp;

var originalCompile = Module.prototype._compile;

function traceCompile(src, file) {
  var anonId = 0;
  src = 'var _trace_func = require("dtrace-provider")._trace_func;' + src;
  var output = falafel(src, function (node) {
    var name;
    switch(node.type) {
      case 'FunctionExpression':
        if (node.parent.type === 'VariableDeclarator')
          name = node.parent.id.name;
        //console.log(node);
      case 'FunctionDeclaration':
        var f = node.body.source();
        if (!name && node.id)
          name = node.id.name;
        else if (!name) {
          name = '<anon' + anonId + '>';
          anonId++;
        }
        var enter = '_trace_func.fire("func-entry", ';
        enter += 'function traceFuncEntry(){ return [ "' + name + '", "' + file + '" ] });';
        var exit = '_trace_func.fire("func-exit", ';
        exit += 'function traceFuncExit(){ return [ "' + name + '", "' + file + '" ] });';
        f = f.replace(/^{/, '{'+enter);
        f = f.replace(/}$/, exit+'}');
        node.body.update(f);
        break;
      default:
        //console.log(node.type);
        break;
    }
  });
  //console.log(output);
  return originalCompile.call(this, output.toString(), file);
}

Module.prototype._compile = traceCompile;
