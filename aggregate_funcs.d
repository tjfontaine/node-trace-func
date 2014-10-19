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
        /*
        printf("%s - %s - %d\n",
                        copyinstr(arg0),
                        copyinstr(arg1),
                        timestamp - start);
        */
        self->func[copyinstr(arg0),copyinstr(arg1)] = 0;
}

END
{
        printa(@);
}
