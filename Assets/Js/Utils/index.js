function embaralharArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

let cores_da_img_musica_tocando_agora
let ultima_img_analizada = ''
//? Vai pegar as cores principais da img desejada
function obterCoresDaImagem(urlDaImagem) {
  return new Promise((resolve, reject) => {
    // const endpoint = 'http://localhost:3001/getColors'
    const endpoint = 'https://apicoresimg.onrender.com/getColors'

    // Crie a URL completa com o parâmetro da imagem
    const urlCompleta = `${endpoint}?imageUrl=${encodeURIComponent(urlDaImagem)}`

    // Faça uma requisição GET para o endpoint da API
    fetch(urlCompleta)
      .then(response => {
        // Verifique se a resposta da requisição foi bem-sucedida
        if (!response.ok) {
          throw new Error('Não foi possível obter as cores da imagem')
        }
        // Parse a resposta JSON
        return response.json() // Corrigido: adicionar 'return' aqui
      })
      .then(data => {
        // Manipule os dados recebidos
        // console.log('Cores principais da imagem:', data)
        resolve(data)
        //? Faça o que precisar com as cores, como atualizar a interface do seu site
      })
      .catch(error => {
        // console.warn('Erro ao obter as cores da imagem:', error)
        reject(error)
      })
  })
}

//? Vai pegar a alteração do tamanho da tela
// Variáveis de estado para controlar o comportamento
var tela_maior_629 = false
var tela_menor_629 = false
// Função para obter e exibir o tamanho da tela
function obterTamanhoDaTela() {
  // Obter a largura da janela de visualização do navegador
  var larguraDaPagina = document.documentElement.clientWidth

  //? Vai add class no container música tocando agora versão para cell
  if(larguraDaPagina <= 628) {
    document.getElementById('BarraMusica').classList.add('BarraMusicaCell')
  } else {
    document.getElementById('BarraMusica').classList.remove('BarraMusicaCell')
  }

  // Se a largura da página for maior que 629 e a tela não tiver passado do limite de 629
  if (larguraDaPagina >= 629 && !tela_maior_629) {
    // console.log('Tela Maior que 629')
    tela_maior_629 = true
    tela_menor_629 = false // Reseta a variável para garantir que a lógica funcione corretamente
    // Faça o que você precisa fazer quando a tela passar de 629 pixels
    document.querySelector('#BarraMusica').style.background = '#1a1a1d'
  } 
  // Se a largura da página for menor que 629 e a tela não tiver passado do limite de 629
  else if (larguraDaPagina < 629 && !tela_menor_629) {
    // console.log('Tela Menor que 629')
    tela_menor_629 = true
    tela_maior_629 = false // Reseta a variável para garantir que a lógica funcione corretamente
    // Faça o que você precisa fazer quando a tela ficar menor que 629 pixels

    try {
      if(ultima_img_analizada != MusicaTocandoAgora.LinkImg) {
        ultima_img_analizada = MusicaTocandoAgora.LinkImg
        Trocar_cor_barra_musica(urlDaImagem)
        console.log('Analizando a img')
      } else {
        document.querySelector('#BarraMusica').style.background = cor_escolhida_background
      }
    } catch{}
  }
}

// Chamada inicial para obter o tamanho da tela quando a página carregar
obterTamanhoDaTela()

// Adicionar um ouvinte de evento 'resize' à janela
window.addEventListener('resize', function() {
  // Chamar a função para obter o tamanho da tela sempre que a janela for redimensionada
  obterTamanhoDaTela()
})

function verificarCor(cor) {
  if (typeof cor !== 'string') {
    console.error('O argumento passado para verificarCor não é uma string.')
    return ["#373737cc", "#000", "#00000059"]
  }
  // Converte a cor para o formato hexadecimal sem o '#'
  cor = cor.replace("#", "")

  // Divide a cor em seus componentes RGB
  var r = parseInt(cor.substring(0, 2), 16)
  var g = parseInt(cor.substring(2, 4), 16)
  var b = parseInt(cor.substring(4, 6), 16)

  // Calcula o valor da luminosidade
  var luminosidade = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

  // Define os limiares para luminosidade
  var limiarClaro = 0.7
  var limiarEscuro = 0.3

  // Verifica se a cor é muito clara ou muito escura e retorna a cor apropriada
  if (luminosidade >= limiarClaro) {
    document.getElementById('fecharPagMusicaTocandoAgora').style.filter = 'grayscale(100%) brightness(0%) contrast(100%)'
    return ["#373737cc", "#000", "#00000059"]// Cor muito clara
  } else if (luminosidade <= limiarEscuro) {
    document.getElementById('fecharPagMusicaTocandoAgora').style.filter = 'none'
    return ["#cfcfcfa6", "#fff", "#7f7e7e7a"] // Cor muito escura
  } else {
    document.getElementById('fecharPagMusicaTocandoAgora').style.filter = 'grayscale(100%) brightness(0%) contrast(100%)'
    return ["#373737cc", "#000", "#00000059"]
  }
}

function scrollParaSpanNoCentro(preId, spanId) {
  // Obtém o elemento span
  var span = document.getElementById(spanId);
  // Obtém o elemento <pre> pai do span
  var pre = document.getElementById(preId);
  
  // Verifica se os elementos foram encontrados
  if (span && pre) {
      // Calcula a posição do span em relação ao topo do <pre>
      var posicaoSpan = span.offsetTop - pre.offsetTop;
      
      // Calcula a metade da altura do <pre>
      var metadeAlturaPre = pre.offsetHeight / 2;
      
      // Calcula a posição de rolagem para centralizar o span
      var posicaoScroll = posicaoSpan - metadeAlturaPre + (span.offsetHeight / 2);
      
      // Rola o <pre> para a posição calculada
      pre.scrollTop = posicaoScroll;
  } else {
      console.error("Elemento não encontrado. Verifique os IDs fornecidos.");
  }
}

//? Gerador de cores escuras
function gerarCorAleatoria() {
  // Gerar valores aleatórios para os componentes RGB
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  // Calcular a luminosidade da cor (média dos valores RGB)
  const luminosidade = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Se a luminosidade for muito baixa, ajustar os valores de cor
  if (luminosidade < 0.5) {
      // Tornar a cor mais clara
      return `rgb(${r + 50}, ${g + 50}, ${b + 50})`
  } else {
      return `rgb(${r}, ${g}, ${b})`
  }
}

function rolarAteOTopoDoElemento(elemento) {
  // Verifica se o elemento foi passado corretamente
  if (!elemento) return

  // Faz o site rolar até o topo do elemento
  elemento.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

//* View Port cell
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`)

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})

function arrumar_responsividade() {
  document.querySelector('#container_amigos').style.height = 'calc(100% - 240px)'
  document.querySelector('#container_input_add_amigos').style.bottom = '100px'
}

//? Vai colocar a img de perfil do user pesquisado
function carregarImagem(src, callback) {
  var img = new Image()
  img.onload = function() {
      callback(img)
  }
  img.onerror = function() {
      callback(null)
  }
  img.src = src
}

//? Controlar inputs
let cor_input_agora = '#fff'
function atualizar_cor_progresso_input(inputElement) {
    var value = (inputElement.value-inputElement.min)/(inputElement.max-inputElement.min)*100;
    inputElement.style.background = `linear-gradient(to right, ${cor_input_agora} 0%, ${cor_input_agora} ${value}%, #4d4d4d ${value}%, #4d4d4d 100%)`
}

function removerParteInicial(url, parteInicial) {
  return url.replace(parteInicial, '');
}
