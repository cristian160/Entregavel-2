// Interface: coleta e valida as entradas antes de chamar as funções em algoritmos.js.
const lista = (id, label, value) => ({id, label, value, list:true, hint:'Separe os inteiros por vírgula, espaço ou ponto e vírgula. Até 500 valores, entre −1 bilhão e 1 bilhão.'});
const inteiro = (id, label, value, min, max, hint) => ({id, label, value, min, max, hint});
const algorithms = [
  {id:'primo',title:'Número primo',icon:'#',category:'DIVISIBILIDADE',description:'Verifique se um número inteiro positivo tem exatamente dois divisores: 1 e ele mesmo.',fields:[inteiro('numero','Número para verificar','17',1,1000000,'Informe um inteiro de 1 a 1.000.000.')],fn:ehPrimo,run:({numero})=>({big:numero,verdict:ehPrimo(numero)?'É um número primo.':'Não é um número primo.',detail:ehPrimo(numero)?`${numero} é divisível apenas por 1 e por ele mesmo.`:numero===1?'O número 1 tem apenas um divisor e não é primo.':`${numero} tem outros divisores além de 1 e dele mesmo.`})},
  {id:'somatorio',title:'Somatório',icon:'Σ',category:'ACUMULAÇÃO',description:'Some todos os valores de um conjunto de números. Cada elemento da lista participa da soma.',fields:[lista('numeros','Números para somar','10, 20, 30, 40')],fn:calcularSomatorio,run:({numeros})=>({big:calcularSomatorio(numeros),verdict:'Soma dos valores',detail:`${numeros.length} valores somados, incluindo números repetidos.`})},
  {id:'fibonacci',title:'Fibonacci',icon:'φ',category:'SEQUÊNCIAS',description:'Gere uma sequência que começa em 0 e 1. Cada novo termo é a soma dos dois anteriores.',fields:[inteiro('n','Quantidade de termos','10',2,78,'Informe de 2 a 78 termos para manter a precisão dos números.')],fn:fibonacci,run:({n})=>({sequence:fibonacci(n),detail:`${n} termos, começando em 0. Cada termo, a partir do terceiro, soma os dois anteriores.`})},
  {id:'mdc',title:'Máximo divisor comum',nav:'MDC',icon:'÷',category:'ALGORITMO DE EUCLIDES',description:'Encontre o maior inteiro positivo que divide os dois números sem deixar resto.',fields:[inteiro('a','Primeiro número','48',0,1000000000,'Inteiro entre 0 e 1.000.000.000.'),inteiro('b','Segundo número','18',0,1000000000,'Inteiro entre 0 e 1.000.000.000. Pelo menos um dos dois deve ser maior que zero.')],fn:calcularMDC,run:({a,b})=>{if(a===0&&b===0)throw new Error('Informe pelo menos um número maior que zero para calcular o MDC.');return {big:calcularMDC(a,b),verdict:'Máximo divisor comum',detail:`MDC(${a}, ${b}) = ${calcularMDC(a,b)}.`};}},
  {id:'quicksort',title:'QuickSort',icon:'↕',category:'ORDENAÇÃO',description:'Organize os valores em ordem crescente usando a divisão por pivô do algoritmo QuickSort.',fields:[lista('vetor','Vetor para ordenar','10, 7, 8, 9, 1, 5')],fn:quickSort,run:({vetor})=>({sequence:quickSort(vetor),detail:`${vetor.length} valores em ordem crescente. Valores repetidos são preservados.`})},
  {id:'contagem',title:'Contagem',icon:'∈',category:'INTERVALOS',description:'Conte os elementos do vetor entre o primeiro valor informado e o limite N, incluindo os extremos.',fields:[lista('dados','Vetor de dados','2, 5, 3, 8, 4, 1'),inteiro('n','Limite superior (N)','6',-1000000000,1000000000,'O primeiro elemento do vetor define o limite inferior.')],fn:contar,run:({dados,n})=>({big:contar(dados,n),verdict:'Valores dentro do intervalo',detail:`Intervalo: ${dados[0]} até ${n}, inclusive. Repetições contam separadamente.${n<dados[0]?' Como N é menor que o primeiro valor, nenhum elemento atende ao intervalo.':''}`})}
];
const $ = id => document.getElementById(id);
let current = algorithms[0];
let language = 'javascript';
let revision = 0;
let pendingController;
function invalidate() {
  revision++;
  if (pendingController) pendingController.abort();
  document.querySelector('.primary').disabled = false;
}
async function updateCode() {
  const chosen = current;
  const chosenLanguage = language;
  if (language === 'javascript') { $('code').textContent = current.fn.toString(); return; }
  $('code').textContent = 'Carregando código Java…';
  try {
    const response = await fetch('/codigo/' + chosen.id, {signal: AbortSignal.timeout(5000)});
    if (!response.ok) throw new Error();
    const code = await response.text();
    if (chosen === current && chosenLanguage === language) $('code').textContent = code;
  } catch {
    if (chosen === current && chosenLanguage === language) $('code').textContent = 'Inicie o servidor e acesse http://127.0.0.1:8080 para visualizar o código Java.';
  }
}
async function runJava(values) {
  if (!['http:', 'https:'].includes(location.protocol)) throw new Error('Para executar Java, inicie o servidor e abra http://127.0.0.1:8080.');
  const body = new URLSearchParams({algoritmo:current.id});
  Object.entries(values).forEach(([key,value]) => body.set(key, Array.isArray(value) ? value.join(',') : String(value)));
  pendingController = new AbortController();
  const timeout = setTimeout(() => pendingController?.abort(), 10000);
  let response;
  try {
    response = await fetch('/api/executar', {method:'POST',body,signal:pendingController.signal});
  } catch {
    throw new Error('Não foi possível acessar o Java. Inicie o servidor, mantenha o terminal aberto e use http://127.0.0.1:8080.');
  } finally { clearTimeout(timeout); }
  let result;
  try { result = await response.json(); }
  catch { throw new Error('Resposta inválida. Acesse a página pelo servidor Java em http://127.0.0.1:8080.'); }
  if (!response.ok) throw new Error(result.erro || 'Erro no servidor Java.');
  if (result.language !== 'java') throw new Error('O servidor não confirmou a execução Java.');
  return result;
}

function readValues() {
  const values = {};
  for (const field of current.fields) {
    const element = $(field.id);
    const raw = element.value.trim();
    let message = '';
    if (!raw) message = `Preencha o campo “${field.label}”.`;
    else if (field.list) {
      const tokens = raw.split(/[\s,;]+/);
      if (tokens.some(token => !/^[+-]?\d+$/.test(token))) message = `Use somente inteiros em “${field.label}”, separados por vírgula, espaço ou ponto e vírgula.`;
      else {
        values[field.id] = tokens.map(Number);
        if (tokens.length > 500 || values[field.id].some(n => !Number.isSafeInteger(n) || Math.abs(n)>1000000000)) message = 'Use até 500 inteiros, cada um entre −1.000.000.000 e 1.000.000.000.';
      }
    } else {
      const value = Number(raw);
      if (!/^[+-]?\d+$/.test(raw) || !Number.isSafeInteger(value) || value < field.min || value > field.max) message = `Em “${field.label}”, informe um inteiro entre ${field.min} e ${field.max}.`;
      else values[field.id] = value;
    }
    element.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) { element.focus(); throw new Error(message); }
  }
  return values;
}

async function execute(isExample = false) {
  invalidate();
  const requestRevision = revision;
  const submit = document.querySelector('.primary');
  $('error').textContent = '';
  try {
    const values = readValues();
    submit.disabled = true;
    $('status').textContent = 'EXECUTANDO';
    const output = language === 'java' ? await runJava(values) : current.run(values);
    if (requestRevision !== revision) return;
    $('result').replaceChildren();
    if (output.sequence) {
      const sequence = document.createElement('div');
      sequence.className = 'sequence';
      output.sequence.forEach(value => {
        const chip = document.createElement('span'); chip.className = 'number-chip'; chip.textContent = value; sequence.append(chip);
      });
      $('result').append(sequence);
    } else {
      const big = document.createElement('span'); big.className='big-value'; big.textContent=output.big;
      const verdict=document.createElement('span'); verdict.className='verdict'; verdict.textContent=output.verdict;
      $('result').append(big, verdict);
    }
    $('result-detail').textContent = output.detail;
    $('status').textContent = (isExample ? 'EXEMPLO · ' : 'OK · ') + (language === 'java' ? 'JAVA' : 'JS');
  } catch(error) {
    if (requestRevision !== revision) return;
    $('error').textContent = error.message;
    $('status').textContent = 'REVISAR';
    $('result').textContent = '—';
    $('result-detail').textContent = 'Confira a mensagem de erro antes de executar novamente.';
  } finally { if (requestRevision === revision) submit.disabled = false; }
}

function selectAlgorithm(algorithm) {
  invalidate();
  current = algorithm;
  for (const button of $('algorithms').children) {
    const selected=button.dataset.id===algorithm.id;
    button.classList.toggle('active',selected); button.setAttribute('aria-pressed',String(selected));
  }
  $('algorithm-title').textContent=algorithm.title;
  $('category').textContent=algorithm.category;
  $('algorithm-mark').textContent=algorithm.icon;
  $('description').textContent=algorithm.description;
  updateCode();
  $('source').open=false;
  $('fields').replaceChildren();
  for (const field of algorithm.fields) {
    const wrapper=document.createElement('div'); wrapper.className='field';
    const label=document.createElement('label'); label.htmlFor=field.id; label.textContent=field.label;
    const input=document.createElement(field.list?'textarea':'input');
    input.id=field.id; input.name=field.id; input.value=field.value;
    if (!field.list) { input.type='text'; input.inputMode=field.min<0?'text':'numeric'; }
    input.required=true; input.setAttribute('aria-describedby',`${field.id}-hint error`);
    input.addEventListener('input',()=>{ invalidate(); $('status').textContent='ALTERADO'; $('result').textContent='—'; $('result-detail').textContent='Execute novamente para calcular com os novos valores.'; $('error').textContent=''; input.removeAttribute('aria-invalid'); });
    const hint=document.createElement('small'); hint.id=`${field.id}-hint`; hint.className='hint'; hint.textContent=field.hint;
    wrapper.append(label,input,hint); $('fields').append(wrapper);
  }
  if (language === 'javascript') execute(true);
  else { $('error').textContent=''; $('status').textContent='PRONTO'; $('result').textContent='—'; $('result-detail').textContent='Clique em Executar algoritmo para calcular no servidor Java.'; }
}

algorithms.forEach((algorithm,index)=>{
  const button=document.createElement('button'); button.type='button'; button.className='nav-button'; button.dataset.id=algorithm.id;
  const icon=document.createElement('span'); icon.className='nav-icon'; icon.textContent=algorithm.icon; icon.setAttribute('aria-hidden','true');
  const title=document.createElement('span'); title.className='nav-text'; title.textContent=algorithm.nav||algorithm.title;
  const number=document.createElement('span'); number.className='nav-index'; number.textContent=String(index+1).padStart(2,'0'); number.setAttribute('aria-hidden','true');
  button.append(icon,title,number); button.addEventListener('click',()=>selectAlgorithm(algorithm)); $('algorithms').append(button);
});
$('algorithm-form').addEventListener('submit',event=>{event.preventDefault();execute();});
$('example').addEventListener('click',()=>selectAlgorithm(current));
document.querySelectorAll('input[name="language"]').forEach(input => input.addEventListener('change', () => {
  invalidate();
  language = input.value;
  $('runtime-note').textContent = language === 'java' ? 'Java selecionado: execução nas classes Java pelo servidor local.' : 'JavaScript selecionado: execução no navegador.';
  updateCode();
  $('error').textContent = '';
  $('status').textContent = 'PRONTO';
  $('result').textContent = '—';
  $('result-detail').textContent = 'Clique em Executar algoritmo para usar a linguagem selecionada.';
}));
selectAlgorithm(current);
