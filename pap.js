import sanctuary from "sanctuary";
import {env as flutureEnv} from 'fluture-sanctuary-types'
import {
    pap,
    resolve,
    fork
} from "fluture";

const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)})

/*
Hi there! I have a scenario where a query (C) depends on the results of two others (A and B).
Reading through the docs I figured that pap would be a good candidate, so that A and B can be
run in parallel. However, I'm not sure what to do with the function argument (C), which,
according to pap must be a future, but the function itself returns a future. So when I fork my pap,
I get a future, not the result of running C. My first thought is to somehow use chain, but I'm not sure how.

So how do I get the fork to run the returned future?
*/

const getThingA = resolve ("A");
const getThingB = resolve ("B");
const getThingC = a => b => resolve (a + b + "C");

let runPap = () =>
      pap (getThingA) (pap (getThingB) (resolve (B => A => getThingC (A) (B)))).pipe (S.join);

runPap ()
   .pipe (fork (console.error) (console.log));


const runPap2 = S.lift2 (getThingC)
                        (getThingA)
                        (getThingB);

fork (console.error) (console.log) (runPap2.pipe (S.join));


const runPap3 = S.lift2 (getThingC)
                        (getThingA);

const runProgram1 = S.pipe ([runPap3, S.join]);

fork (console.error) (console.log) (runProgram1 (getThingB));


const runProgram2 = S.compose (S.join)
                              (runPap3);

fork (console.error) (console.log) (runProgram2 (getThingB));