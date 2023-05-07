import sanctuary from "sanctuary";
import {env as flutureEnv} from 'fluture-sanctuary-types';
import * as F from "fluture";

const S = sanctuary.create ({checkTypes: true, env: sanctuary.env.concat (flutureEnv)});

const logWithTime = startTime => x => console.log (Date.now () - startTime, x);

// const getThingA = F.reject ("A");
const getThingA = F.after (2000) ("A");
const getThingB = F.after (2000) ("B");
const getThingC = a => b => F.resolve (a + b + "C");

let runPap1 = () =>
    F.pap (getThingA) (F.pap (getThingB) (F.resolve (B => A => getThingC (A) (B)))).pipe (S.join);

runPap1 ()
    .pipe (F.fork (console.error)
                (logWithTime (Date.now ())));



const runPap2 = S.lift2 (getThingC)
                        (F.Par (getThingA))
                        (F.Par (getThingB));

F.fork (console.error)
     (logWithTime (Date.now ()))
     (F.seq (runPap2).pipe (S.join));



const runPap3 = S.lift2 (getThingC)
                        (F.Par (getThingA));

const runProgram1 = S.pipe ([runPap3, F.seq, S.join]);

F.fork (console.error)
     (logWithTime (Date.now ()))
     (runProgram1 (F.Par (getThingB)));



const joinAfter   = S.compose (S.join);
const runProgram2 = S.compose (joinAfter (F.seq))
                              (runPap3);

F.fork (console.error)
     (logWithTime (Date.now ()))
     (runProgram2 (F.Par (getThingB)));



F.fork (console.error)
     (logWithTime (Date.now ()))
     (joinAfter (F.seq) (runPap2));




// https://matrix.to/#/!tntZjsTSRQiWTjlnqS:gitter.im/$IIYMytDfilm5ewdu7KyCT6vo9VzvLNgsJqCuC05jEj0?via=gitter.im&via=matrix.org&via=aldwin.land
// getThingA :: Future a b
// getThingB :: Future a b
// getThingC :: a -> b -> Future c d
//    runPap :: ConcurrentFuture a (Future a b)

//    flatten :: Applicative ConcurrentFuture, Monad Future => ConcurrentFuture a (Future a b) -> Future a b
//    flatten :: ConcurrentFuture a (Future a b) -> Future a b
//    flatten :: Applicative a, Chain c => a b -> c b
const flatten = S.compose (S.join)
                          (F.seq);
F.fork (console.error)
       (logWithTime (Date.now ()))
       (flatten (runPap2));
