import sanctuary from "sanctuary";
import {env as flutureEnv} from 'fluture-sanctuary-types';
import {
    after,
    fork,
    pap,
    Par,
    seq,
    resolve,
} from "fluture";

const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)});

const logWithTime = startTime => x => console.log (Date.now () - startTime, x);

const getThingA = after (2000) ("A");
const getThingB = after (2000) ("B");
const getThingC = a => b => resolve (a + b + "C");

let runPap1 = () =>
    pap (getThingA) (pap (getThingB) (resolve (B => A => getThingC (A) (B)))).pipe (S.join);

runPap1 ()
    .pipe (fork (console.error)
                (logWithTime (Date.now ())));



const runPap2 = S.lift2 (getThingC)
                        (Par (getThingA))
                        (Par (getThingB));

fork (console.error)
     (logWithTime (Date.now ()))
     (seq (runPap2).pipe (S.join));



const runPap3 = S.lift2 (getThingC)
                        (Par (getThingA));

const runProgram1 = S.pipe ([runPap3, seq, S.join]);

fork (console.error)
     (logWithTime (Date.now ()))
     (runProgram1 (Par (getThingB)));



const joinWith = S.compose (S.join)
const runProgram2 = S.compose (joinWith (seq))
                              (runPap3);

fork (console.error)
     (logWithTime (Date.now ()))
     (runProgram2 (Par (getThingB)));



const runPap4 = S.lift2 (getThingC)
                        (Par (getThingA))
                        (Par (getThingB))

fork (console.error)
     (logWithTime (Date.now ()))
     (seq (runPap4).pipe (S.join));



fork (console.error)
     (logWithTime (Date.now ()))
     (joinWith (seq) (runPap4));