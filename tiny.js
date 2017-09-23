const tokenize = (program) => {
  return program
         .replace(/\(/g, ' ( ')
         .replace(/\)/g, ' ) ')
         .split(' ')
         .filter((x) => x !== '')
}

const program = '(* 2 (+ 3 (- 4 5)))'
console.log(tokenize(program))

const readFromTokens = (tokens) => {
  if(tokens.length === 0){
    throw new Error('unexpected EOF while reading')
  }
  token = tokens.shift()
  if(token === '('){
    let L = []
    while(tokens[0] != ')'){
      L.push(readFromTokens(tokens))
    }
    tokens.shift()
    return L
  }
  else if(token === ')'){
    throw new Error('unexpected')
  }
  else{
    return String(token)
  }
}

const parse = (program) => {
  return readFromTokens(tokenize(program))
}

console.log(JSON.stringify(parse(program), null, 2))

const standardEnv = () => {
  let env = {
    'pi' : Math.PI,
    'sin' : Math.sin,
    'cos' : Math.cos,
    'sqrt' : Math.sqrt,
    '+' : (x, y) => x + y,
    '-' : (x, y) => x - y,
    '*' : (x, y) => x * y,
    '/' : (x, y) => x / y,
    '>' : (x, y) => x > y,
    '<' : (x, y) => x < y,
    '>=' : (x, y) => x >= y,
    '<=' : (x, y) => x <= y,
    '=' : (x, y) => x === y,
    'abs' : Math.abs,
    'append' : (x, y) => x.concat(y),
    'car' : (x) => x[0],
    'cdr' : (x) => x.slice(1),
    'cons' : (x, y) => [x].concat(y),
    'length' : (x) => x.length,
    'list' : (...args) => Array.apply({}, args),
    'list?' : (x) => x instanceof Array,
    'map' : (x, f) => x.map(f),
    'filter' : (x, pre) => x.filter(pre),
    'max' : Math.max,
    'min' : Math.min,
    'not' : (x) => !x,
    'null?' : (x) => !x || x !== x || x.length === 0,
    'number?' : (x) => typeof(x) === 'number',
    'prcedure?' : (x) => typeof(x) === 'function'
  }
  return env
}

const evaluator = (x, env) => {
  if(typeof(x) === 'string'){
    if(isNaN(x)){
      return env[x]
    }
    else{
      return Number(x)
    }
  }
  else if(!(x instanceof Array)){
    return x
  }
  else if(x[0] === 'if'){
    let [_, test, conseq, alt] = x
    let exp = alt
    if(evaluator(test, env)){
      exp = conseq
    }
    return evaluator(exp, env)
  }
  else if(x[0] === 'define'){
    let [_, variable, exp] = x
    console.log(variable)
    console.log(exp)
    env[variable] = evaluator(exp, env)
    console.log(env)
  }
  else{
    let proc = evaluator(x[0], env)
    let args = x.slice(1).map((x) => evaluator(x, env))
    return proc.apply({}, args)
  }
}

let globalEnv = standardEnv()

const interpret = (program) => {
  return evaluator(parse(program), globalEnv)
}

console.log(interpret(program))

let f = '(define r 10)'
let g = '(* pi (* r r))'
interpret(f)
console.log(interpret(g))
let h = '(if (< 2 3) 2 3)'
console.log(interpret(h))
exports.tinyLambda = interpret
