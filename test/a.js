function a() {
        console.log('I am A');
        b();
}

function b() {
        console.log('I am B');
        for (var i = 0; i < 1e9; i++) {}
        c();
}

function c() { console.log('I am C'); d(); }
function d() { console.log('I am D'); };
var e = function () { console.log('I am E'); };
var f = e;

setInterval(a, 1000);
a();
