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
