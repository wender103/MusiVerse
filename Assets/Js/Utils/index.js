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
    // Crie a URL para o endpoint da sua API
    // const endpoint = 'http://localhost:3001/getColors'; // Substitua pelo seu endpoint real
    const endpoint = 'https://apicoresimg.onrender.com/getColors'; // Substitua pelo seu endpoint real

    // Crie a URL completa com o parâmetro da imagem
    const urlCompleta = `${endpoint}?imageUrl=${encodeURIComponent(urlDaImagem)}`;

    // Faça uma requisição GET para o endpoint da API
    fetch(urlCompleta)
      .then(response => {
        // Verifique se a resposta da requisição foi bem-sucedida
        if (!response.ok) {
          throw new Error('Não foi possível obter as cores da imagem');
        }
        // Parse a resposta JSON
        return response.json(); // Corrigido: adicionar 'return' aqui
      })
      .then(data => {
        // Manipule os dados recebidos
        // console.log('Cores principais da imagem:', data);
        resolve(data);
        //? Faça o que precisar com as cores, como atualizar a interface do seu site
      })
      .catch(error => {
        console.error('Erro ao obter as cores da imagem:', error);
        reject(error);
      });
  });
}

//? Vai pegar a alteração do tamanho da tela
// Variáveis de estado para controlar o comportamento
var tela_maior_629 = false
var tela_menor_629 = false
// Função para obter e exibir o tamanho da tela
function obterTamanhoDaTela() {
  // Obter a largura da janela de visualização do navegador
  var larguraDaPagina = document.documentElement.clientWidth

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
        document.querySelector('#BarraMusica').style.background = cores_da_img_musica_tocando_agora[0]
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
