Instrument arbitrary JavaScript functions automatically

Simply load this module first, all subsequent modules loaded will be
automatically instrumented for function entry and exit.

A dtrace probe is fired for every function entry and exit, the first argument
is the function name and the second argument is the file name

```awk
#!/usr/sbin/dtrace -q -s

BEGIN
{
        self->indent = 0;
}

trace-func*:::func-entry
{
        printf("%*s-> %s:%s\n", self->indent, " ", copyinstr(arg1), copyinstr(arg0));
        self->indent += 4;
}

trace-func*:::func-exit
/self->indent/
{
        self->indent -= 4;
        printf("%*s<- %s:%s\n", self->indent, " ", copyinstr(arg1), copyinstr(arg0));
}
```

```
 -> /Users/tjfontaine/Development/node-trace-func/test/a.js:a
    -> /Users/tjfontaine/Development/node-trace-func/test/a.js:b
        -> /Users/tjfontaine/Development/node-trace-func/test/a.js:c
            <- /Users/tjfontaine/Development/node-trace-func/test/a.js:d
            -> /Users/tjfontaine/Development/node-trace-func/test/a.js:d
        <- /Users/tjfontaine/Development/node-trace-func/test/a.js:c
    <- /Users/tjfontaine/Development/node-trace-func/test/a.js:b
 <- /Users/tjfontaine/Development/node-trace-func/test/a.js:a
```

```awk
#!/usr/sbin/dtrace -s

trace-func*:::func-entry
{
        self->func[copyinstr(arg0),copyinstr(arg1)] = timestamp;
}

trace-func*:::func-exit
/self->func[copyinstr(arg0),copyinstr(arg1)]/
{
        start = self->func[copyinstr(arg0), copyinstr(arg1)];
        @[copyinstr(arg0), copyinstr(arg1)] = quantize(timestamp - start);
        self->func[copyinstr(arg0),copyinstr(arg1)] = 0;
}

END
{
        printa(@);
}
```
