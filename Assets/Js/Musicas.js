//? Vai formatar os textos
function formatarTexto(texto) {
    return texto.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '') //? Vai remover os acentos e espaços
}

const audioPlayer = document.querySelector('#audioPlayer')
const inputVolume = document.getElementById('inputVolume')
let audioNoMudo = false
let volumeAudioAtual = 0
let ListaProxMusica = {}
let musicaSelecionadaBtnDireito //? Vai guardar a música que o user clicou com btn Direito
let autorSelecionadoBtnDireito //? Vai guardar o autor que o user clicou com btn Direito
let userSelecionadoBtnDireito //? Vai guardar o autor que o user clicou com btn Direito
let playlistSelecionadaBtnDireito //? Vai guardar o autor que o user clicou com btn Direito

const liAddRemoveFavoritosClickMusic = document.querySelector('#liAddRemoveFavoritosClickMusic')
const liIrParaArtistaClickMusic = document.querySelector('#liIrParaArtistaClickMusic')
const liMostrarCretidos = document.querySelector('#liMostrarCretidos')

//? Vai alterar o volume para o ultimo salvo
const ultimoVolumeSalvo = localStorage.getItem('VolumeMusiVerse')
if(ultimoVolumeSalvo) {
    volumeAudioAtual = parseInt(ultimoVolumeSalvo)
    inputVolume.value = parseInt(ultimoVolumeSalvo)
    volumeMusica(parseInt(ultimoVolumeSalvo))
}

function volumeMusica(volume = 0) {
    //? Vai mudar o volume de acordo com o input
    audioPlayer.volume = volume / 100

    if(volume > 0) {
        audioNoMudo = false
    }

    //? Vai salvar o volume do local Storage
    localStorage.setItem('VolumeMusiVerse', volume)
}

function mutarMusica() {
    //? Vai colocar/tirar o audio do mudo caso aperte o icone de volume
    if(audioNoMudo == false && inputVolume.value > 0) {
        audioNoMudo = true
        volumeAudioAtual = inputVolume.value
        inputVolume.value = 0
    } else {
        audioNoMudo = false
        
        if(volumeAudioAtual <= 0) {
            volumeAudioAtual = 100
        }
        inputVolume.value = volumeAudioAtual
    }

    volumeMusica(inputVolume.value)
}

let TodasMusicas = []
let arraymusicasAleatorias = []
function carregarMusicas() {
    return new Promise((resolve, reject) => {
        db.collection('InfoMusicas').limit(1).get().then((snapshot) => {
            snapshot.docs.forEach(Musicas => {
                TodasMusicas = Musicas.data()
                resolve()
            })
    
        }).catch((e) => {
            console.warn(e)
            location.href = `Error.html`
        })
    })
} carregarMusicas().then(() => {
    //# Vai execultar apenas depois que o banco for carregado
    //? Vai carregar as músicas na tela Home
    async function MostrarMusicas() {
        try {
            const containerMain = document.getElementById('containerMain')

            await RetornarMusicas('Aleatórias', containerMain)
            // try {
            //     obterValoresDaURL()
            // } catch{}

            // for(let c = 0; c < arraymusicasAleatorias.length; c++) {
            //     try {
            //         document.getElementsByClassName('imgMusicasAleatoriasBanner')[c].src = arraymusicasAleatorias[c + 7].LinkImg
            //     } catch(e){console.warn(e)}
            // }

            // await RetornarMusicas('Gospel', containerMain)
            // await RetornarMusicas('Rock', containerMain)
            // await RetornarMusicas('Country', containerMain)
            // await RetornarMusicas('Phonk', containerMain)
        } catch (error) {
            console.error('Ocorreu um erro:', error)
        }
    } MostrarMusicas() 

    //? Vai fechar a tela de carregamento
    try {
        document.getElementById('CarregamentoTela1').style.display = 'none'
    } catch{}

}).catch((e) => {
    console.warn(e)
})

//? Tirar dps
setTimeout(() => {
    document.getElementById('CarregamentoTela1').style.display = 'none'
}, 5000)

async function RetornarMusicas(Pesquisa, Local, maxMusicas = 10, Estilo = 'Caixa', PesquisarEmail = false, Artista = false, ClassArticle, Comando) {
    if(maxMusicas == 'Indeterminado') {
        maxMusicas = TodasMusicas.Musicas.length
    }
    
    const article = document.createElement('article')
    
    if(ClassArticle) {
        article.classList.add('containerMusicaCaixa', 'SemScroll')

    } else {
      article.className = 'containerMusicaCaixa'
    }

    let contadorMusicasPorSection = 0
    
    if(Pesquisa == 'Aleatórias') {
        arraymusicasAleatorias = [...TodasMusicas.Musicas]
        arraymusicasAleatorias.sort(() => Math.random() - 0.5)
    }
    
    let PesquisaFormatada = formatarTexto(Pesquisa)
    
    let contadorMusicasLinha = 0
    let arrayMusicasRetornadas = []
    for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
        let NomeMusica = formatarTexto(TodasMusicas.Musicas[c].NomeMusica)
        let Autor = formatarTexto(TodasMusicas.Musicas[c].Autor)
        let Genero = formatarTexto(TodasMusicas.Musicas[c].Genero)
        let EmailUser = '&&&&&&&&&&&'
        let musicaPassou = false
        
        if(Artista) {
            if(PesquisaFormatada.includes(Autor) || Autor.includes(PesquisaFormatada)) {
                musicaPassou = true
            }
        } else if (
            PesquisaFormatada.includes(NomeMusica) ||
            PesquisaFormatada.includes(Autor) ||
            PesquisaFormatada.includes(Genero) ||
            PesquisaFormatada.includes(EmailUser) ||
            NomeMusica.includes(PesquisaFormatada) ||
            Autor.includes(PesquisaFormatada) ||
            Genero.includes(PesquisaFormatada) ||
            EmailUser.includes(PesquisaFormatada) ||
            TodasMusicas.Musicas[c].ID == Pesquisa
            ) {
            musicaPassou = true
        } else if(Pesquisa == 'Aleatórias') {
            musicaPassou = true
        }
    
        if (musicaPassou && contadorMusicasPorSection < maxMusicas) {
            if(Pesquisa == 'Aleatórias') {
                arrayMusicasRetornadas = arraymusicasAleatorias.slice(0, maxMusicas)
            } else {
                arrayMusicasRetornadas.push(TodasMusicas.Musicas[c])
            }
        }
    }
  
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
    
    shuffleArray(arrayMusicasRetornadas)
  
    for(let c = 0; c < arrayMusicasRetornadas.length && c < maxMusicas; c++) {
      contadorMusicasPorSection++
  
      if(Estilo == 'Caixa') {
        const div = document.createElement('div')
        const containerImg = document.createElement('div')
        const img = document.createElement('img')
        const divTexto = document.createElement('div')
        const darPlay = document.createElement('div')
        const p = document.createElement('p')
        const span = document.createElement('span')
        const divBlurTexto = document.createElement('div')
  
        div.className = 'MusicasCaixa'
        darPlay.className = 'BtnDarPlay'
        darPlay.style.backgroundImage = `url(./Assets/Imgs/Icons/DarPlay.png)`
        img.src = arrayMusicasRetornadas[c].LinkImg
        if(img.src.includes('treefy')) {
          containerImg.classList.add('ContainerImgMusicaCaixa', 'ContainerImgMusicaCaixaTreeFy')
          divBlurTexto.className = 'divBlurTextoTreeFy'
        } else {
          containerImg.classList.add('ContainerImgMusicaCaixa')
          divBlurTexto.className = 'divBlurTexto'
        }
  
        divTexto.className = 'TextoMusicaCaixa'
        p.innerText = arrayMusicasRetornadas[c].NomeMusica
        p.title = arrayMusicasRetornadas[c].NomeMusica
        span.innerText = arrayMusicasRetornadas[c].Autor
        span.title = arrayMusicasRetornadas[c].Autor
        divBlurTexto.innerHTML = `<img src="${arrayMusicasRetornadas[c].LinkImg}">`
  
        divTexto.appendChild(p)
        divTexto.appendChild(span)
        div.appendChild(darPlay)
        containerImg.appendChild(img)
        div.appendChild(containerImg)
        div.appendChild(divBlurTexto)
        div.appendChild(divTexto)
        article.appendChild(div)
  
        div.addEventListener('click', (event) => {
            
            if (event.target != span && event.target.className != 'BtnsEditarMusicaLinha') {
                AbrirTelaTocandoAgora(Pesquisa)

                ListaProxMusica = {
                    Musicas: arrayMusicasRetornadas,
                    Numero: c,
                }

                DarPlayMusica(arrayMusicasRetornadas[c], c)

                if(Comando == 'Salvar pesquisa') {
                    //? Vai salvar a pesquisa
                    const pesquisa = {TipoPesquisa: 'music', ID: arrayMusicasRetornadas[c].ID}
                    SalvarUltimasPesquisas(pesquisa)
                }
            }
        })

        div.addEventListener('contextmenu', function (e) {
            e.preventDefault()

            musicaSelecionadaBtnDireito = arrayMusicasRetornadas[c]
            const containerOptionsClickMusic = document.getElementById('containerOptionsClickMusic')
            const containerOptionsClickArtista = document.getElementById('containerOptionsClickArtista')
            autorSelecionadoBtnDireito = arrayMusicasRetornadas[c]

            if(e.target.innerText == span.innerText) {
                hideMenu()
                // Position the custom menu at the mouse coordinates
                containerOptionsClickArtista.style.left = e.clientX+ 'px'
                containerOptionsClickArtista.style.top = e.clientY + 'px'
                containerOptionsClickArtista.style.display = 'block'

            } else {
                hideMenu()
                // Position the custom menu at the mouse coordinates
                containerOptionsClickMusic.style.left = e.clientX+ 'px'
                containerOptionsClickMusic.style.top = e.clientY + 'px'
                containerOptionsClickMusic.style.display = 'block'
            }

            // Close the menu when clicking outside of it
            document.addEventListener('click', hideMenu)
            document.addEventListener('scroll', hideMenu)

            //? Vai curtir, descurtir usando a função btn direito
            FavoritarDesfavoritarMusica(arrayMusicasRetornadas[c].ID, 'Checar').then((resolve) => {
                const spanLi = document.createElement('span')

                if(resolve == './Assets/Imgs/Icons/icon _heart_.png') {
                    spanLi.innerText = 'Remover dos Favotitos'
                } else {
                    spanLi.innerText = 'Adicionar aos Favotitos'
                }

                //? Btn Add | Remover dos favoritos btn direito
                spanLi.addEventListener('click', () => {
                    FavoritarDesfavoritarMusica(musicaSelecionadaBtnDireito.ID)
                })
                liAddRemoveFavoritosClickMusic.innerHTML = ''
                liAddRemoveFavoritosClickMusic.appendChild(spanLi)
            })


            //? Vai direcionar o user a página com as músicas do artista
            const irParaArtista = document.createElement('span')
            irParaArtista.innerText = 'Ir para o artista'

            irParaArtista.addEventListener('click', () => {
                AbrirPaginas('artist', arrayMusicasRetornadas[c].ID)

                if(Comando == 'Salvar pesquisa') {
                    //? Vai salvar a pesquisa
                    const pesquisa = {TipoPesquisa: 'artist', ID: arrayMusicasRetornadas[c].ID}
                    SalvarUltimasPesquisas(pesquisa)
                }
            })

            liIrParaArtistaClickMusic.innerHTML = ''
            liIrParaArtistaClickMusic.appendChild(irParaArtista)

            //? Vai mostrar os créditos da música
            const spanCreditos = document.createElement('span')
            spanCreditos.innerText = 'Mostrar créditos'
            spanCreditos.addEventListener('click', () => {
                const nomeMusicaMostrarCreditos = document.createElement('span')
                nomeMusicaMostrarCreditos.innerText = p.innerText
                document.querySelector('#menuCreditosNomeMusica').innerHTML = ''
                document.querySelector('#menuCreditosNomeMusica').appendChild(nomeMusicaMostrarCreditos)

                

                const autorCreditos = document.createElement('span')
                autorCreditos.innerText = span.innerText
                document.querySelector('#menuCreditosAutor').innerHTML = ''
                document.querySelector('#menuCreditosAutor').appendChild(autorCreditos)

                autorCreditos.addEventListener('click', () => {
                    document.querySelector('#containerMenuCreditos').style.display = 'none'
                    AbrirPaginas('artist', arrayMusicasRetornadas[c].ID)

                    if(Comando == 'Salvar pesquisa') {
                        //? Vai salvar a pesquisa
                        const pesquisa = {TipoPesquisa: 'artist', ID: arrayMusicasRetornadas[c].ID}
                        SalvarUltimasPesquisas(pesquisa)
                    }
                })

                const NomeUserCreditos = document.createElement('span')

                for(let con = 0; con < TodosOsUsers.length; con++) {
                    if(TodosOsUsers[con].User.Email == arrayMusicasRetornadas[c].EmailUser) {
                        if(TodosOsUsers[con].User.Nome != '' && TodosOsUsers[con].User.Nome != undefined) {
                            NomeUserCreditos.innerText = TodosOsUsers[con].User.Nome
                            document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'underline'
                            document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'pointer'
                        } else {
                            document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                            NomeUserCreditos.innerText = arrayMusicasRetornadas[c].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                        }

                        NomeUserCreditos.addEventListener('click', () => {
                            AbrirPaginas('artist', TodosOsUsers[con].User)
                            closeMenuCreditos()

                            if(Comando == 'Salvar pesquisa') {
                                //? Vai salvar a pesquisa
                                const pesquisa = {TipoPesquisa: 'profile', ID: TodosOsUsers[con].User}
                                SalvarUltimasPesquisas(pesquisa)
                            }
                        })
                    }
                }

                if(NomeUserCreditos.innerText == '') {
                    document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                    document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'default'
                    NomeUserCreditos.innerText = arrayMusicasRetornadas[c].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                }

                document.querySelector('#menuCreditosNoneQuemPostou').innerHTML = ''
                document.querySelector('#menuCreditosNoneQuemPostou').appendChild(NomeUserCreditos)


                openMenuCreditos()
            })

            liMostrarCretidos.innerHTML = ''
            liMostrarCretidos.appendChild(spanCreditos)
        })
  
        span.addEventListener('click', () => {
            AbrirPaginas('artist', arrayMusicasRetornadas[c].ID)

            if(Comando == 'Salvar pesquisa') {
                //? Vai salvar a pesquisa
                const pesquisa = {TipoPesquisa: 'artist', ID: arrayMusicasRetornadas[c].ID}
                SalvarUltimasPesquisas(pesquisa)
            }
        })
  
      } else if(Estilo == 'Linha') {
        contadorMusicasLinha++
        article.className = 'containerMusicaLinha'
  
        const div = document.createElement('div')
        const divPrimeiraParte = document.createElement('div')
        const contador = document.createElement('p')
        const divImg = document.createElement('div')
        const img = document.createElement('img')
        const divTexto = document.createElement('div')
        const Nome = document.createElement('p')
        const AutorDaMusica = document.createElement('span')
        const Genero = document.createElement('p')
        const Heart = document.createElement('img')
  
        div.className = 'MusicasLinha'
        divTexto.className = 'TextoMusicaCaixa'
        Heart.className = 'btnCurtirMeuPerfil'
        divImg.className = 'DivImgMusicaMeuPerfil'
        img.className = 'ImgMusicaMeuPerfil'
        Genero.className = 'GeneroMeuPerfil'
  
        contador.innerText = contadorMusicasLinha
        img.src = arrayMusicasRetornadas[c].LinkImg
        if(img.src.includes('treefy')) {
          divImg.classList.add('DivImgMusicaMeuPerfil', 'DivImgMusicaMeuPerfilTreeFy')
        } else {
          divImg.classList.add('DivImgMusicaMeuPerfil')
        }
  
        Nome.innerText = arrayMusicasRetornadas[c].NomeMusica
        Nome.title = arrayMusicasRetornadas[c].NomeMusica
        AutorDaMusica.innerText = arrayMusicasRetornadas[c].Autor
        AutorDaMusica.title = arrayMusicasRetornadas[c].Autor
        Genero.innerText = arrayMusicasRetornadas[c].Genero
        Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'
        
        divTexto.appendChild(Nome)
        divTexto.appendChild(AutorDaMusica)
        divPrimeiraParte.appendChild(contador)
        divImg.appendChild(img)
        divPrimeiraParte.appendChild(divImg)
        divPrimeiraParte.appendChild(divTexto)
        div.appendChild(divPrimeiraParte)
        div.appendChild(Genero)
        div.appendChild(Heart)
        article.appendChild(div)
  
        div.addEventListener('click', (event) => {
            AbrirTelaTocandoAgora(Pesquisa)

          if (event.target != AutorDaMusica && event.target != Heart) {
            ListaProxMusica = {
              Musicas: arrayMusicasRetornadas,
              Numero: c,
            }
            DarPlayMusica(arrayMusicasRetornadas[c], c)
          }
        })
  
        FavoritarDesfavoritarMusica(arrayMusicasRetornadas.ID, 'Checar').then((resolve) => {
          Heart.src = resolve
        })
  
        Heart.addEventListener('click', () => {
          FavoritarDesfavoritarMusica(arrayMusicasRetornadas.ID, 'Editar').then((resolve) => {
            Heart.src = resolve
          })
        })
  
        AutorDaMusica.addEventListener('click', () => {
            AbrirPaginas('artist', arrayMusicasRetornadas[c].ID)
        })
      }
    }
  
    const h1 = document.createElement('h1')
    const section = document.createElement('section')
    const articleContainer = document.createElement('article')
    articleContainer.className = 'articleContainer'
  
    if(article.innerHTML != '') {
      h1.innerText = Pesquisa === 'Aleatórias' ? 'Procurando algo novo...' : Pesquisa
      section.className = 'containerMusica'
  
        if(Estilo != 'Linha') {
            section.appendChild(h1)
        } else {
            articleContainer.style.width = '100%'
            articleContainer.style.padding = '0'
        }
  
        articleContainer.appendChild(article)
        section.appendChild(articleContainer)
        Local.appendChild(section)
    }
  
    if(ClassArticle != 'SemScroll') {
        const divBtnsScrollHorizontal = document.createElement('div')
        divBtnsScrollHorizontal.className = 'divBtnsScrollHorizontal'
    
        const btnBackScrollHorizontal = document.createElement('button')
        const imgBack = document.createElement('img')
        imgBack.src = 'Assets/Imgs/Icons/BackPag.png'
    
        const btnNextScrollHorizontal = document.createElement('button')
        const imgNext = document.createElement('img')
        imgNext.src = 'Assets/Imgs/Icons/NextPag.png'
    
        btnBackScrollHorizontal.appendChild(imgBack)
        btnNextScrollHorizontal.appendChild(imgNext)
        divBtnsScrollHorizontal.appendChild(btnBackScrollHorizontal)
        divBtnsScrollHorizontal.appendChild(btnNextScrollHorizontal)
        section.appendChild(divBtnsScrollHorizontal)
    
        let scrollStep = section.scrollWidth
        let contadorScroll = 0
        function handleResize() {
            scrollStep = section.scrollWidth
            checkScrollLimit()
        
            if (articleContainer.scrollWidth > section.scrollWidth) {
                divBtnsScrollHorizontal.style.display = 'flex'
            } else {
                divBtnsScrollHorizontal.style.display = 'none'
            }
        }
        window.addEventListener('resize', handleResize)
        handleResize()
    
        btnBackScrollHorizontal.addEventListener('click', () => {
            articleContainer.scrollLeft -= scrollStep
            contadorScroll--
            checkScrollLimit()
        })
    
        btnNextScrollHorizontal.addEventListener('click', () => {
            articleContainer.scrollLeft += scrollStep
            contadorScroll++
            checkScrollLimit()
        })
    
        function checkScrollLimit() {
            if(contadorScroll <= 0) {
                btnBackScrollHorizontal.style.opacity = 0.3
            } else {
                btnBackScrollHorizontal.style.opacity = 1
            }
        
            if(contadorScroll < (articleContainer.scrollWidth / section.scrollWidth) - 1) {
                btnNextScrollHorizontal.style.opacity = 1
            } else {
                btnNextScrollHorizontal.style.opacity = 0.3
            }
        }
        checkScrollLimit()
    }
  }
  

async function RetornarPerfil(Pesquisa, Local, PerfilDe = 'User', Comando) {
    let feito = false

    //? ------------------------------------

    const PesquisaFormatada = formatarTexto(Pesquisa)
    const divContainer = document.createElement('div')
    const Perfil = document.createElement('div')
    Perfil.className = 'partePerfilPesquisa'
    const DarkOverlay = document.createElement('div')
    DarkOverlay.className = 'DarkOverlayPerfilPesquisar'
    const FotoPerfil = document.createElement('img')
    const NomeUserPesquisado = document.createElement('h1')
    const ContainerMusicas = document.createElement('div')
    ContainerMusicas.className = 'containermusicaPerfilPesquisa'

    //? ------------------------------------
    
    if(PerfilDe == 'User') {
        for(let c = 0; c < TodosOsUsers.length; c++) {
            const Nome = formatarTexto(TodosOsUsers[c].User.Nome)

            if(PesquisaFormatada.includes(Nome) || Nome.includes(PesquisaFormatada) && !feito) {
                feito = true

                Perfil.addEventListener('click', () => {
                    AbrirPaginas('profile', TodosOsUsers[c].User.Id)

                    if(Comando == 'Salvar pesquisa') {
                        //? Vai salvar a pesquisa
                        const pesquisa = {TipoPesquisa: 'profile', ID: TodosOsUsers[c].User.Id}
                        SalvarUltimasPesquisas(pesquisa)
                    }
                })

                Perfil.addEventListener('contextmenu', function (e) {
                    e.preventDefault()

                    const containerOptionsClickMusic = document.getElementById('containerOptionsClickMusic')
                    const containerOptionsClickArtista = document.getElementById('containerOptionsClickArtista')
                    const containerOptionsClickUser = document.getElementById('containerOptionsClickUser')
                    userSelecionadoBtnDireito = TodosOsUsers[c].User

                    hideMenu()
                    // Position the custom menu at the mouse coordinates
                    containerOptionsClickUser.style.left = e.clientX+ 'px'
                    containerOptionsClickUser.style.top = e.clientY + 'px'
                    containerOptionsClickUser.style.display = 'block'

                    // Close the menu when clicking outside of it
                    document.addEventListener('click', hideMenu)
                    document.addEventListener('scroll', hideMenu)
                })
                
                //? Vai checar se está tudo certo com a img de background caso n esteja vai substituila
                var imgTeste = new Image()
                imgTeste.src = TodosOsUsers[c].User.Personalizar.Background
                imgTeste.onload = function() {
                    Perfil.style.backgroundImage = `url(${TodosOsUsers[c].User.Personalizar.Background})`
                }
                imgTeste.onerror = function() {
                    Perfil.style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
                }
                
                var imgTeste2 = new Image()
                imgTeste2.src = TodosOsUsers[c].User.Personalizar.FotoPerfil
                imgTeste2.onload = function() {
                    FotoPerfil.src = TodosOsUsers[c].User.Personalizar.FotoPerfil
                    FotoPerfil.style.display = 'block'
                }
                imgTeste2.onerror = function() {
                    FotoPerfil.style.display = 'none'
                }

                NomeUserPesquisado.innerText = TodosOsUsers[c].User.Nome
                Perfil.appendChild(DarkOverlay)
                Perfil.appendChild(FotoPerfil)
                Perfil.appendChild(NomeUserPesquisado)
                divContainer.appendChild(Perfil)

                //? ---------------------------------------------------------------------------------

                for(let i = TodasMusicas.Musicas.length -1; i > 0; i--) {

                    for(let contadorMusicasPostadas = 0; contadorMusicasPostadas < TodosOsUsers[c].User.MusicasPostadas.length && contadorMusicasPostadas < 4; contadorMusicasPostadas++) {
                        if(TodasMusicas.Musicas[i].ID == TodosOsUsers[c].User.MusicasPostadas[contadorMusicasPostadas]) {

                            const musica = document.createElement('div')
                            const divInfosMusica = document.createElement('div')
                            const img = document.createElement('img')
                            const NomeMusica = document.createElement('p')
                            const Autor = document.createElement('span')
                            const Heart = document.createElement('img')
                            const divTexto = document.createElement('div')

                            divContainer.className = 'containerPerfilPesquisa'
                            musica.className = 'musicasPerfilPesquisa'
                            divInfosMusica.className = 'divInfosMusicaPerfilPesquisa'
                            Heart.className = 'heartPerfilPesquisa'
                            divTexto.className = 'containerTextoPerfilPesquisa'

                            img.src = TodasMusicas.Musicas[i].LinkImg
                            NomeMusica.innerText = TodasMusicas.Musicas[i].NomeMusica
                            NomeMusica.title = TodasMusicas.Musicas[i].NomeMusica
                            Autor.innerText = TodasMusicas.Musicas[i].Autor
                            Autor.title = TodasMusicas.Musicas[i].Autor
                            Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'

                            divInfosMusica.appendChild(img)
                            divTexto.appendChild(NomeMusica)
                            divTexto.appendChild(Autor)
                            divInfosMusica.appendChild(divTexto)
                            musica.appendChild(divInfosMusica)
                            musica.appendChild(Heart)
                            ContainerMusicas.appendChild(musica)

                            divInfosMusica.addEventListener('click', (event) => {
                                if (event.target != Autor && event.target != Heart) {
                                    DarPlayMusica(TodasMusicas.Musicas[i], i)
                                }
                            })

                            musica.addEventListener('contextmenu', function (e) {
                                e.preventDefault()

                                musicaSelecionadaBtnDireito = TodasMusicas.Musicas[i]
                                const containerOptionsClickMusic = document.getElementById('containerOptionsClickMusic')
                                const containerOptionsClickArtista = document.getElementById('containerOptionsClickArtista')
                                autorSelecionadoBtnDireito = TodasMusicas.Musicas[i]

                                if(e.target.innerText == Autor.innerText) {
                                    hideMenu()
                                    // Position the custom menu at the mouse coordinates
                                    containerOptionsClickArtista.style.left = e.clientX+ 'px'
                                    containerOptionsClickArtista.style.top = e.clientY + 'px'
                                    containerOptionsClickArtista.style.display = 'block'

                                } else {
                                    hideMenu()
                                    // Position the custom menu at the mouse coordinates
                                    containerOptionsClickMusic.style.left = e.clientX+ 'px'
                                    containerOptionsClickMusic.style.top = e.clientY + 'px'
                                    containerOptionsClickMusic.style.display = 'block'
                                }

                                // Close the menu when clicking outside of it
                                document.addEventListener('click', hideMenu)
                                document.addEventListener('scroll', hideMenu)

                                //? Vai curtir, descurtir usando a função btn direito
                                FavoritarDesfavoritarMusica(TodasMusicas.Musicas[i].ID, 'Checar').then((resolve) => {
                                    const spanLi = document.createElement('span')

                                    if(resolve == './Assets/Imgs/Icons/icon _heart_.png') {
                                        spanLi.innerText = 'Remover dos Favotitos'
                                    } else {
                                        spanLi.innerText = 'Adicionar aos Favotitos'
                                    }

                                    //? Btn Add | Remover dos favoritos btn direito
                                    spanLi.addEventListener('click', () => {
                                        FavoritarDesfavoritarMusica(musicaSelecionadaBtnDireito.ID).then((resolveSrc) => {
                                            Heart.src = resolveSrc
                                        })
                                    })
                                    liAddRemoveFavoritosClickMusic.innerHTML = ''
                                    liAddRemoveFavoritosClickMusic.appendChild(spanLi)
                                })

                                const irParaArtista = document.createElement('span')
                                irParaArtista.innerText = 'Ir para o artista'

                                irParaArtista.addEventListener('click', () => {
                                    AbrirPaginas('artist', TodasMusicas.Musicas[i].ID)
                                })

                                liIrParaArtistaClickMusic.innerHTML = ''
                                liIrParaArtistaClickMusic.appendChild(irParaArtista)

                                //? Vai mostrar os créditos da música
                                const spanCreditos = document.createElement('span')
                                spanCreditos.innerText = 'Mostrar créditos'
                                spanCreditos.addEventListener('click', () => {
                                    const nomeMusicaMostrarCreditos = document.createElement('span')
                                    nomeMusicaMostrarCreditos.innerText = NomeMusica.innerText
                                    document.querySelector('#menuCreditosNomeMusica').innerHTML = ''
                                    document.querySelector('#menuCreditosNomeMusica').appendChild(nomeMusicaMostrarCreditos)

                                    const autorCreditos = document.createElement('span')
                                    autorCreditos.innerText = Autor.innerText
                                    document.querySelector('#menuCreditosAutor').innerHTML = ''
                                    document.querySelector('#menuCreditosAutor').appendChild(autorCreditos)

                                    autorCreditos.addEventListener('click', () => {
                                        document.querySelector('#containerMenuCreditos').style.display = 'none'         
                                        AbrirPaginas('artist', TodasMusicas.Musicas[i].ID)
                                    })

                                    const NomeUserCreditos = document.createElement('span')

                                    for(let con = 0; con < TodosOsUsers.length; con++) {
                                        if(TodosOsUsers[con].User.Email == TodasMusicas.Musicas[i].EmailUser) {
                                            if(TodosOsUsers[con].User.Nome != '' && TodosOsUsers[con].User.Nome != undefined) {
                                                NomeUserCreditos.innerText = TodosOsUsers[con].User.Nome
                                                document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'underline'
                                                document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'pointer'
                                            } else {
                                                document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                                                NomeUserCreditos.innerText = TodasMusicas.Musicas[i].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                                            }

                                            NomeUserCreditos.addEventListener('click', () => {
                                                AbrirPaginas('profile', TodosOsUsers[con].User.Id)
                                                closeMenuCreditos()
                                            })
                                        }
                                    }

                                    if(NomeUserCreditos.innerText == '') {
                                        document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                                        document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'default'
                                        NomeUserCreditos.innerText = TodasMusicas.Musicas[i].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                                    }

                                    document.querySelector('#menuCreditosNoneQuemPostou').innerHTML = ''
                                    document.querySelector('#menuCreditosNoneQuemPostou').appendChild(NomeUserCreditos)


                                    openMenuCreditos()
                                })

                                liMostrarCretidos.innerHTML = ''
                                liMostrarCretidos.appendChild(spanCreditos)
                            })

                            //? Vai checar se as músicas foram curtidas pelo user
                            FavoritarDesfavoritarMusica(TodasMusicas.Musicas[i].ID, 'Checar').then((resolve) => {
                                Heart.src = resolve
                            })

                            //? Vai curtir / descurtir a música
                            Heart.addEventListener('click', () => {
                                FavoritarDesfavoritarMusica(TodasMusicas.Musicas[i].ID, 'Editar').then((resolve) => {
                                    Heart.src = resolve
                                })
                            })

                            //? Ao clicar no nome do Autor
                            Autor.addEventListener('click', () => {
                                AbrirPaginas('artist', TodasMusicas.Musicas[i].ID)
                            })
                        }
                    }
                }
            }
        }
    }
    const h1 = document.createElement('h1')

    //? Vai adicionar o article no html apenas se houver algunma música
    h1.innerText = 'Melhor resultado'
    divContainer.appendChild(ContainerMusicas)

    if(ContainerMusicas.innerHTML != '') {
        Local.appendChild(h1)
        Local.appendChild(divContainer)
    }
}

let musicasFavoritasUser = []
let numMusicasFavoritas = 0
async function RetornarMusicasFavoritas(Email, Local, MusicaFavoritaOuPostada) {
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let contadorMusicasLinha = 0
    musicasFavoritasUser = []

    if(MusicaFavoritaOuPostada == 'Favoritas') {
        for(let contadorMusicasCurtidas = currentUser.User.MusicasCurtidas.length; contadorMusicasCurtidas >= 0; contadorMusicasCurtidas--) {

            for(let contadorTodasAsMusicas = 0; contadorTodasAsMusicas < TodasMusicas.Musicas.length; contadorTodasAsMusicas++) {

                if(TodasMusicas.Musicas[contadorTodasAsMusicas].ID == currentUser.User.MusicasCurtidas[contadorMusicasCurtidas]) {
                    musicasFavoritasUser.push(TodasMusicas.Musicas[contadorTodasAsMusicas])
                    contadorMusicasLinha++
                    article.className = 'containerMusicaLinha'

                    const div = document.createElement('div')
                    const divPrimeiraParte = document.createElement('div')
                    const contador = document.createElement('p')
                    const divImg = document.createElement('div')
                    const img = document.createElement('img')
                    const divTexto = document.createElement('div')
                    const Nome = document.createElement('p')
                    const AutorDaMusica = document.createElement('span')
                    const Genero = document.createElement('p')
                    const Heart = document.createElement('img')

                    div.className = 'MusicasLinha'
                    divTexto.className = 'TextoMusicaCaixa'
                    Heart.className = 'btnCurtirMeuPerfil'
                    divImg.className = 'DivImgMusicaMeuPerfil'
                    img.className = 'ImgMusicaMeuPerfil'
                    Genero.className = 'GeneroMeuPerfil'

                    
                    if(contadorMusicasLinha < 10) {
                        contador.innerText = `0${contadorMusicasLinha}`

                    } else {
                        contador.innerText = contadorMusicasLinha
                    }

                    img.src = TodasMusicas.Musicas[contadorTodasAsMusicas].LinkImg
                    Nome.innerText = TodasMusicas.Musicas[contadorTodasAsMusicas].NomeMusica
                    Nome.title = TodasMusicas.Musicas[contadorTodasAsMusicas].NomeMusica
                    AutorDaMusica.innerText = TodasMusicas.Musicas[contadorTodasAsMusicas].Autor
                    AutorDaMusica.title = TodasMusicas.Musicas[contadorTodasAsMusicas].Autor
                    Genero.innerText = TodasMusicas.Musicas[contadorTodasAsMusicas].Genero
                    Heart.src = './Assets/Imgs/Icons/icon _heart_.png'
                    
                    divTexto.appendChild(Nome)
                    divTexto.appendChild(AutorDaMusica)
                    divPrimeiraParte.appendChild(contador)
                    divImg.appendChild(img)
                    divPrimeiraParte.appendChild(divImg)
                    divPrimeiraParte.appendChild(divTexto)
                    div.appendChild(divPrimeiraParte)
                    div.appendChild(Genero)
                    div.appendChild(Heart)
                    article.appendChild(div)

                    let numMusicasFavoritas = contadorMusicasLinha - 1
                    div.addEventListener('click', (event) => {
                        
                        if (event.target != AutorDaMusica && event.target != Heart) {
                            ListaProxMusica = {
                                Musicas: musicasFavoritasUser,
                                Numero: numMusicasFavoritas,
                            }

                            console.log(ListaProxMusica)
                            
                            DarPlayMusica(musicasFavoritasUser[numMusicasFavoritas], numMusicasFavoritas)
                            AbrirTelaTocandoAgora(musicasFavoritasUser[numMusicasFavoritas])
                            RetornarMusicasASeguir()
                        }
                    })

                    div.addEventListener('contextmenu', function (e) {
                        e.preventDefault()

                        musicaSelecionadaBtnDireito = musicasFavoritasUser[numMusicasFavoritas]
                        const containerOptionsClickMusic = document.getElementById('containerOptionsClickMusic')
                        const containerOptionsClickArtista = document.getElementById('containerOptionsClickArtista')
                        autorSelecionadoBtnDireito = TodasMusicas.Musicas[contadorTodasAsMusicas]

                        if(e.target.innerText == AutorDaMusica.innerText) {
                            hideMenu()
                            // Position the custom menu at the mouse coordinates
                            containerOptionsClickArtista.style.left = e.clientX+ 'px'
                            containerOptionsClickArtista.style.top = e.clientY + 'px'
                            containerOptionsClickArtista.style.display = 'block'

                        } else {
                            hideMenu()
                            // Position the custom menu at the mouse coordinates
                            containerOptionsClickMusic.style.left = e.clientX+ 'px'
                            containerOptionsClickMusic.style.top = e.clientY + 'px'
                            containerOptionsClickMusic.style.display = 'block'
                        }

                        // Close the menu when clicking outside of it
                        document.addEventListener('click', hideMenu)
                        document.addEventListener('scroll', hideMenu)

                        //? Vai curtir, descurtir usando a função btn direito
                        FavoritarDesfavoritarMusica(musicasFavoritasUser[numMusicasFavoritas].ID, 'Checar').then((resolve) => {
                            const spanLi = document.createElement('span')

                            if(resolve == './Assets/Imgs/Icons/icon _heart_.png') {
                                spanLi.innerText = 'Remover dos Favotitos'
                            } else {
                                spanLi.innerText = 'Adicionar aos Favotitos'
                            }

                            //? Btn Add | Remover dos favoritos btn direito
                            spanLi.addEventListener('click', () => {
                                FavoritarDesfavoritarMusica(musicaSelecionadaBtnDireito.ID).then((resolveSrc) => {
                                    Heart.src = resolveSrc
                                })
                            })
                            liAddRemoveFavoritosClickMusic.innerHTML = ''
                            liAddRemoveFavoritosClickMusic.appendChild(spanLi)
                        })

                        const irParaArtista = document.createElement('span')
                        irParaArtista.innerText = 'Ir para o artista'

                        irParaArtista.addEventListener('click', () => {
                            AbrirPaginas('artist', musicasFavoritasUser[numMusicasFavoritas].ID)

                        })

                        liIrParaArtistaClickMusic.innerHTML = ''
                        liIrParaArtistaClickMusic.appendChild(irParaArtista)

                        //? Vai mostrar os créditos da música
                        const spanCreditos = document.createElement('span')
                        spanCreditos.innerText = 'Mostrar créditos'
                        spanCreditos.addEventListener('click', () => {
                            const nomeMusicaMostrarCreditos = document.createElement('span')
                            nomeMusicaMostrarCreditos.innerText = Nome.innerText
                            document.querySelector('#menuCreditosNomeMusica').innerHTML = ''
                            document.querySelector('#menuCreditosNomeMusica').appendChild(nomeMusicaMostrarCreditos)

                            const autorCreditos = document.createElement('span')
                            autorCreditos.innerText = AutorDaMusica.innerText
                            document.querySelector('#menuCreditosAutor').innerHTML = ''
                            document.querySelector('#menuCreditosAutor').appendChild(autorCreditos)

                            autorCreditos.addEventListener('click', () => {
                                document.querySelector('#containerMenuCreditos').style.display = 'none'
                                AbrirPaginas('artist', musicasFavoritasUser[numMusicasFavoritas].ID)
                            })

                            const NomeUserCreditos = document.createElement('span')

                            for(let con = 0; con < TodosOsUsers.length; con++) {
                                if(TodosOsUsers[con].User.Email == musicasFavoritasUser[numMusicasFavoritas].EmailUser) {
                                    if(TodosOsUsers[con].User.Nome != '' && TodosOsUsers[con].User.Nome != undefined) {
                                        NomeUserCreditos.innerText = TodosOsUsers[con].User.Nome
                                        document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'underline'
                                        document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'pointer'
                                    } else {
                                        document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                                        NomeUserCreditos.innerText = musicasFavoritasUser[numMusicasFavoritas].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                                    }

                                    NomeUserCreditos.addEventListener('click', () => {
                                        AbrirPaginas('profile', TodosOsUsers[con].User.Id)
                                        closeMenuCreditos()
                                    })
                                }
                            }

                            if(NomeUserCreditos.innerText == '') {
                                document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                                document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'default'
                                NomeUserCreditos.innerText = musicasFavoritasUser[numMusicasFavoritas].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                            }

                            document.querySelector('#menuCreditosNoneQuemPostou').innerHTML = ''
                            document.querySelector('#menuCreditosNoneQuemPostou').appendChild(NomeUserCreditos)


                            openMenuCreditos()
                        })

                        liMostrarCretidos.innerHTML = ''
                        liMostrarCretidos.appendChild(spanCreditos)
                    })

                    Heart.addEventListener('click', () => {
                        FavoritarDesfavoritarMusica(musicasFavoritasUser[numMusicasFavoritas].ID)
                        .then((resolve) => {
                            document.getElementById('localMusicasCurtidas').innerHTML = ''
                            musicasFavoritasUser.splice(numMusicasFavoritas, 1)
                            RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
                        })
                        .catch((error) => {
                            alert(error)
                        })
                    })

                    //? Ao clicar no nome do Autor
                    AutorDaMusica.addEventListener('click', () => {
                        AbrirPaginas('artist', musicasFavoritasUser[numMusicasFavoritas].ID)

                    })
                }
            }
        }
    }

    const section = document.createElement('section')

    //? Vai adicionar o article no html apenas se houver algunma música
    if(article.innerHTML != '') {
        section.className = 'containerMusica'
        const articleContainer = document.createElement('article')
        articleContainer.className = 'articleContainer'
        articleContainer.style.width = '100%'
        articleContainer.style.padding = '0'
        articleContainer.appendChild(article)
        section.appendChild(articleContainer)
        Local.appendChild(section)
    }
}

 //? Ao clicar no btn de play
document.getElementById('imgMusicaFavoritaTocandoAgora').addEventListener('click', () => {
    AbrirTelaTocandoAgora(musicasFavoritasUser[numMusicasFavoritas])

    ListaProxMusica = {
        Musicas: musicasFavoritasUser,
        Numero: 0,
    }

    DarPlayMusica(musicasFavoritasUser[numMusicasFavoritas], numMusicasFavoritas)
})


let arrayMusicasPostadasPeloUser = []
let musicaSelecionadaParaEditar
let Musica_Editanto_Agora
async function RetornarMusicasPostadasPeloUser(EmailUser, Local, ProprioUser = false) {
    arrayMusicasPostadasPeloUser = []
    const article = document.createElement('article')
    let contadorMusicasLinha = 0

    for(let c = TodasMusicas.Musicas.length - 1; c > 0; c--) {

        if(EmailUser == TodasMusicas.Musicas[c].EmailUser) {
            arrayMusicasPostadasPeloUser.push(TodasMusicas.Musicas[c])
            contadorMusicasLinha++
            article.className = 'containerMusicaLinha'

            const div = document.createElement('div')
            const divPrimeiraParte = document.createElement('div')
            const contador = document.createElement('p')
            const divImg = document.createElement('div')
            const img = document.createElement('img')
            const divTexto = document.createElement('div')
            const Nome = document.createElement('p')
            const AutorDaMusica = document.createElement('span')
            const Genero = document.createElement('p')
            const Excluir = document.createElement('button')
            const Editar = document.createElement('button')
            const Heart = document.createElement('img')

            div.className = 'MusicasLinha'
            divTexto.className = 'TextoMusicaCaixa'
            Heart.className = 'btnCurtirMeuPerfil'
            divImg.className = 'DivImgMusicaMeuPerfil'
            img.className = 'ImgMusicaMeuPerfil'
            Genero.className = 'GeneroMeuPerfil'
            Editar.className = 'BtnsEditarMusicaLinha'
            Excluir.className = 'BtnsEditarMusicaLinha'

            if(contadorMusicasLinha < 10) {
                contador.innerText = `0${contadorMusicasLinha}`

            } else {
                contador.innerText = contadorMusicasLinha
            }
            
            img.src = TodasMusicas.Musicas[c].LinkImg

            img.src = TodasMusicas.Musicas[c].LinkImg
            if(img.src.includes('treefy')) {
                divImg.classList.add('DivImgMusicaMeuPerfil', 'DivImgMusicaMeuPerfilTreeFy')
            } else {
                divImg.classList.add('DivImgMusicaMeuPerfil')
            }

            Nome.innerText = TodasMusicas.Musicas[c].NomeMusica
            Nome.title = TodasMusicas.Musicas[c].NomeMusica
            AutorDaMusica.innerText = TodasMusicas.Musicas[c].Autor
            AutorDaMusica.title = TodasMusicas.Musicas[c].Autor
            Genero.innerText = TodasMusicas.Musicas[c].Genero
            Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'
            Editar.innerHTML = '<img src="./Assets/Imgs/Icons/edit.png" class="BtnsEditarMusicaLinha"/>'
            Excluir.innerHTML = '<img src="./Assets/Imgs/Icons/icon _trash_.png" class="BtnsEditarMusicaLinha"/>'
            
            divTexto.appendChild(Nome)
            divTexto.appendChild(AutorDaMusica)
            divPrimeiraParte.appendChild(contador)
            divImg.appendChild(img)
            divPrimeiraParte.appendChild(divImg)
            divPrimeiraParte.appendChild(divTexto)
            div.appendChild(divPrimeiraParte)
            div.appendChild(Genero)

            if(ProprioUser == false) {
                div.appendChild(Heart)
            } else {
                const containerBtns = document.createElement('div')
                containerBtns.className = 'containerBtns'
                containerBtns.appendChild(Excluir)
                containerBtns.appendChild(Editar)
                div.appendChild(containerBtns)
            }

            article.appendChild(div)

            div.addEventListener('click', (event) => {
                if (event.target != AutorDaMusica && event.target != Heart && event.target.className != 'BtnsEditarMusicaLinha') {
                    ListaProxMusica = {
                        Musicas: TodasMusicas.Musicas,
                        Numero: c,
                    }
                    DarPlayMusica(TodasMusicas.Musicas[c], c)
                    AbrirTelaTocandoAgora(TodasMusicas.Musicas[c])
                }
            })

            div.addEventListener('contextmenu', function (e) {
                e.preventDefault()

                musicaSelecionadaBtnDireito = TodasMusicas.Musicas[c]
                const containerOptionsClickMusic = document.getElementById('containerOptionsClickMusic')
                const containerOptionsClickArtista = document.getElementById('containerOptionsClickArtista')
                autorSelecionadoBtnDireito = TodasMusicas.Musicas[c]

                if(e.target.innerText == AutorDaMusica.innerText) {
                    hideMenu()
                    // Position the custom menu at the mouse coordinates
                    containerOptionsClickArtista.style.left = e.clientX+ 'px'
                    containerOptionsClickArtista.style.top = e.clientY + 'px'
                    containerOptionsClickArtista.style.display = 'block'

                } else {
                    hideMenu()
                    // Position the custom menu at the mouse coordinates
                    containerOptionsClickMusic.style.left = e.clientX+ 'px'
                    containerOptionsClickMusic.style.top = e.clientY + 'px'
                    containerOptionsClickMusic.style.display = 'block'
                }

                // Close the menu when clicking outside of it
                document.addEventListener('click', hideMenu)
                document.addEventListener('scroll', hideMenu)

                FavoritarDesfavoritarMusica(TodasMusicas.Musicas[c].ID, 'Checar').then((resolve) => {
                    const spanLi = document.createElement('span')

                    if(resolve == './Assets/Imgs/Icons/icon _heart_.png') {
                        spanLi.innerText = 'Remover dos Favotitos'
                    } else {
                        spanLi.innerText = 'Adicionar aos Favotitos'
                    }

                    //? Btn Add | Remover dos favoritos btn direito
                    spanLi.addEventListener('click', () => {
                        FavoritarDesfavoritarMusica(musicaSelecionadaBtnDireito.ID).then((resolveSrc) => {
                            Heart.src = resolveSrc
                        })
                    })
                    liAddRemoveFavoritosClickMusic.innerHTML = ''
                    liAddRemoveFavoritosClickMusic.appendChild(spanLi)
                })

                const irParaArtista = document.createElement('span')
                irParaArtista.innerText = 'Ir para o artista'

                irParaArtista.addEventListener('click', () => {
                    AbrirPaginas('artist', TodasMusicas.Musicas[c].ID)
                })

                liIrParaArtistaClickMusic.innerHTML = ''
                liIrParaArtistaClickMusic.appendChild(irParaArtista)

                //? Vai mostrar os créditos da música
                const spanCreditos = document.createElement('span')
                spanCreditos.innerText = 'Mostrar créditos'
                spanCreditos.addEventListener('click', () => {
                    const nomeMusicaMostrarCreditos = document.createElement('span')
                    nomeMusicaMostrarCreditos.innerText = Nome.innerText
                    document.querySelector('#menuCreditosNomeMusica').innerHTML = ''
                    document.querySelector('#menuCreditosNomeMusica').appendChild(nomeMusicaMostrarCreditos)

                    

                    const autorCreditos = document.createElement('span')
                    autorCreditos.innerText = AutorDaMusica.innerText
                    document.querySelector('#menuCreditosAutor').innerHTML = ''
                    document.querySelector('#menuCreditosAutor').appendChild(autorCreditos)

                    autorCreditos.addEventListener('click', () => {
                        document.querySelector('#containerMenuCreditos').style.display = 'none'
                        AbrirPaginas('artist', TodasMusicas.Musicas[c].ID)
                    })

                    const NomeUserCreditos = document.createElement('span')

                    for(let con = 0; con < TodosOsUsers.length; con++) {
                        if(TodosOsUsers[con].User.Email == TodasMusicas.Musicas[c].EmailUser) {
                            if(TodosOsUsers[con].User.Nome != '' && TodosOsUsers[con].User.Nome != undefined) {
                                NomeUserCreditos.innerText = TodosOsUsers[con].User.Nome
                                document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'underline'
                                document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'pointer'
                            } else {
                                document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                                NomeUserCreditos.innerText = TodasMusicas.Musicas[c].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                            }

                            NomeUserCreditos.addEventListener('click', () => {
                                AbrirPaginas('profile', TodosOsUsers[con].User.Id)
                                closeMenuCreditos()
                            })
                        }
                    }

                    if(NomeUserCreditos.innerText == '') {
                        document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                        document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'default'
                        NomeUserCreditos.innerText = TodasMusicas.Musicas[c].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                    }

                    document.querySelector('#menuCreditosNoneQuemPostou').innerHTML = ''
                    document.querySelector('#menuCreditosNoneQuemPostou').appendChild(NomeUserCreditos)


                    openMenuCreditos()
                })

                liMostrarCretidos.innerHTML = ''
                liMostrarCretidos.appendChild(spanCreditos)
            })

            Editar.addEventListener('click', () => {
                Musica_Editanto_Agora = TodasMusicas.Musicas[c]
            })

            //? Vai checar se as músicas foram curtidas pelo user
            FavoritarDesfavoritarMusica(TodasMusicas.Musicas[c].ID, 'Checar').then((resolve) => {
                Heart.src = resolve
            })

            //? Vai curtir / descurtir a música
            Heart.addEventListener('click', () => {
                FavoritarDesfavoritarMusica(TodasMusicas.Musicas[c].ID, 'Editar').then((resolve) => {
                    Heart.src = resolve
                })
            })

            //? Ao clicar no icone de editar a música
            Editar.addEventListener('click', () => {
                document.getElementById('containerEditrarMusica').style.display = 'flex'
                document.getElementById('novoNomeMusica').value = TodasMusicas.Musicas[c].NomeMusica
                document.getElementById('novoNomeAutor').value = TodasMusicas.Musicas[c].Autor
                document.getElementById('novoGeneroMusica').value = TodasMusicas.Musicas[c].Genero

                checarEdicaoNaMusica('Editar')
                musicaSelecionadaParaEditar = TodasMusicas.Musicas[c].ID
            })

            //? Ao clicar no nome do Autor
            AutorDaMusica.addEventListener('click', () => {
                AbrirPaginas('artist', TodasMusicas.Musicas[c].ID)
            })
        }
    }

    const section = document.createElement('section')
    //? Vai adicionar o article no html apenas se houver algunma música
    if(article.innerHTML != '') {
        section.className = 'containerMusica'
        const articleContainer = document.createElement('article')
        articleContainer.style.width = '100%'
        articleContainer.style.padding = '0'
        articleContainer.className = 'articleContainer'
        articleContainer.appendChild(article)
        section.appendChild(articleContainer)
        Local.appendChild(section)
    }

}

//? Vai pesquisar pelas músicas
const inputPesquisa = document.getElementById('inputPesquisa')
let texto_pesqusia = ''
inputPesquisa.addEventListener('keypress', (e) => {
    if(e.keyCode == 13) {
        Checar_pesquisar()
    }
})

function Checar_pesquisar(Metodo) {
    if(inputPesquisa.value.trim() != "" && inputPesquisa.value != texto_pesqusia && Metodo != 'Btn') {
        texto_pesqusia = inputPesquisa.value
        AbrirPaginas('Pesquisar', undefined, true, true, 'Pesquisar')
    } else {
        if(document.getElementById('PagPesquisar').style.display != 'block' && inputPesquisa.value == '') {
            AbrirPaginas('Pesquisar', undefined, true, true, 'Historico')

        } else {
            AbrirPaginas('Pesquisar', undefined, true, true, 'Abrir')
        }
    }
}

function Pesquisar(Comando) {
    
    if(Comando == 'Pesquisar') {
        document.getElementById('containerResultadoPesquisa').innerHTML = ''
        //? Indo ali ---------------------------------
        if(formatarTexto(texto_pesqusia).includes(formatarTexto('we live, we love, we lie'))) {
            for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
                if(TodasMusicas.Musicas[c].NomeMusica == 'BEAT INDO ALI - MEME VIRAL') {
                    DarPlayMusica(TodasMusicas.Musicas[c], c)

                    document.getElementById('PagPesquisar').style.backgroundImage = `url('https://i.ytimg.com/vi/9LFqwZPlih4/sddefault.jpg')`
                }
            }
        } else {
            document.getElementById('PagPesquisar').style.backgroundImage = ``
        }
        
        //? Vai pesquisar por um perfil
        RetornarPerfil(texto_pesqusia, document.getElementById('containerResultadoPesquisa'), 'User', 'Salvar pesquisa')

        //? Vai pesquisar por Playlists
        RetornarPlayList(texto_pesqusia, document.getElementById('containerResultadoPesquisa'), 'Caixa', null, 'Salvar pesquisa')
        
        //? Vai pesquisar por músicas
        RetornarMusicas(texto_pesqusia, document.getElementById('containerResultadoPesquisa'), 'Indeterminado', 'Caixa', false, false, 'SemScroll', 'Salvar pesquisa')
        
    } else if(Comando == 'Historico') {
        document.getElementById('containerResultadoPesquisa').innerHTML = ''
        RetornarUltimasPesquisas(document.getElementById('containerResultadoPesquisa'))
        RetornarGeneros(document.getElementById('containerResultadoPesquisa'))
    }

    if(Comando == 'Pesquisar' || Comando == 'Abrir') {
        document.querySelector('body').style.overflowY = 'hidden'
        document.getElementById('PagPesquisar').style.display = 'block'
    }
}

//? Vai pegar as músicas postadas pelo user ao abrir o perfil
const btnMeuPerfil = document.getElementById('btnMeuPerfil')
btnMeuPerfil.addEventListener('click', () => {
    abrirMeuPerfil()
})

function abrirMeuPerfil() {
    document.getElementById('NomeUserMeuPerfil').innerText = currentUser.User.Nome

    if(currentUser.User.Personalizar.Background != null && currentUser.User.Personalizar.Background.trim() != '') {
        
        try {
            if(currentUser.User.Personalizar.RepetirBackGround || currentUser.User.Personalizar.RepetirBackGround == undefined) {
                document.getElementById('coainerBackgroundPerfil').classList.add('RepetirBackgroundPerfilUser')
            }
        } catch{}

        //? Vai checar se está tudo certo com a img de background caso n esteja vai substituila
        var img = new Image()
        img.src = currentUser.User.Personalizar.Background
        img.onload = function() {
            document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(${currentUser.User.Personalizar.Background})`
        }
        img.onerror = function() {
            alert('Algo deu errado com img de background. Tente outra.')
            document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
        }

        //? Vai checar se está tudo certo com a img de perfil
        var imgTeste2 = new Image()
        imgTeste2.src = currentUser.User.Personalizar.FotoPerfil
        const FotoPerfil = document.getElementById('imgPerfilUserHeaderUser')
        if(currentUser.User.Personalizar.FotoPerfil != null && currentUser.User.Personalizar.FotoPerfil != '') {
            imgTeste2.onload = function() {
                FotoPerfil.src = currentUser.User.Personalizar.FotoPerfil
                document.getElementById('containerImgPerfilUserHeaderUser').style.display = 'block'
                document.getElementById('coainerBackgroundPerfil').style.alignItems = 'center'
                document.getElementById('coteudoHeaderPerfil').style.height = '80%'
            }
            imgTeste2.onerror = function() {
                document.getElementById('coainerBackgroundPerfil').style.alignItems = 'end'
                document.getElementById('coteudoHeaderPerfil').style.height = '50%'
                document.getElementById('containerImgPerfilUserHeaderUser').style.display = 'none'
            }
        } else {
            document.getElementById('coainerBackgroundPerfil').style.alignItems = 'end'
            document.getElementById('coteudoHeaderPerfil').style.height = '50%'
            document.getElementById('containerImgPerfilUserHeaderUser').style.display = 'none'
        }

    } else {
        document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
        document.getElementById('coainerBackgroundPerfil').classList.add('RepetirBackgroundPerfilUser')
    }

    document.getElementById('containerMusicasPerfilUser').innerHTML = ''
    RetornarMusicasPostadasPeloUser(currentUser.InfoEmail.email, document.getElementById('containerMusicasPerfilUser'), true)
}

//? Vai tocar as músicas do user
//? Ao clicar no btn de play
const  btnPlayHeaderPerfil = document.getElementById('btnPlayHeaderPerfil')
btnPlayHeaderPerfil.addEventListener('click', () => {
    ListaProxMusica = {
        Musicas: arrayMusicasPostadasPeloUser,
        Numero: 0,
    }
    DarPlayMusica(arrayMusicasPostadasPeloUser[0], 0)
})

//? Vai abrir as músicas favoritas do user
const btnMusicasFavoritas = document.getElementById('btnMusicasFavoritas')
btnMusicasFavoritas.addEventListener('click', () => {
    document.getElementById('localMusicasCurtidas').innerHTML = ''
    RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
})

function abrirFavoritosBtnNoHome() {
    FecharPaginas()
    document.getElementById('localMusicasCurtidas').innerHTML = ''
    RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
    AbrirPaginas('Favoritas')
}

let trocouDeMusica = false
let fimMusica = false
let isPlaying = false

let MusicaTocandoAgora = {}

//? Variaveis das informações do user gosto músical 
let MusicaColetarDados = {}
let salvarHistorico = false

let ListaDarPlay = {}
let RepetirMusica = false

//? Vai dar play naas músicas
function DarPlayMusica(Lista, num, Pausar = false) {
    isPlaying = true

    if(Lista != undefined && ListaDarPlay.Lista != Lista) {
        ListaDarPlay = {
            Lista,
            num,
            Pausar,
        }

        if(RepetirMusica) {
            Repetir_musica()
        }
    }

    if(RepetirMusica) {
        audioPlayer.currentTime = 0
        audioPlayer.play()

        setTimeout(() => {
            audioPlayer.play()
        }, 1000)

    } else {
        return new Promise((resolve, reject) => {
            function AtualizarViewSemanal() {
                let userEncontrado = false
        
                for(let c = 0; c < TodosOsUsers.length; c++) {
                    try {
                        if(TodosOsUsers[c].User.Email == Lista.EmailUser && userEncontrado == false) {
                            userEncontrado = true
            
                            db.collection('Users').doc(TodosOsUsers[c].User.Id).get().then((Users) => {
                                    const Usuarios = Users.data()
                                if(Usuarios.Email == Lista.EmailUser) {
                                    let infosUser = Usuarios.InfosPerfil
                
                                    let dataHj = new Date()
                                    const DataAtual = parseInt(`${dataHj.getDate()}${dataHj.getMonth() +1}${dataHj.getFullYear()}`)
                                    //? Caso tenha acabado a semana vai zerar as views do user
                                    try {
                                        if(DataAtual - parseInt(infosUser.ViewsSemanais.Data) >= 7) {
                                            infosUser.ViewsSemanais.Data = DataAtual
                                            infosUser.ViewsSemanais.Views = 1
                                        } else {
                                            infosUser.ViewsSemanais.Views = parseInt(infosUser.ViewsSemanais.Views) + 1
                                        }
                                    } catch {
                                        const newInfoUser = {
                                            Seguidores: infosUser.Seguidores,
                                            Seguindo: infosUser.Seguindo,
                                            Amigos: infosUser.Amigos,
                                            ViewsSemanais: {
                                                Data: DataAtual,
                                                Views: 1
                                            },
                                        }
            
                                        infosUser = newInfoUser
                                    }
                
                                    setTimeout(() => {
                                        db.collection('Users').doc(TodosOsUsers[c].User.Id).update({ InfosPerfil: infosUser })
                                    }, 500)
                                }
                            })
                        }
                    } catch (error) {
                        console.warn('Algo deu errado ao tentar atribuir a view! Error: ',  + error)
                    }
                }
            } AtualizarViewSemanal()
        
            function EnviarDados() {
                if(audioPlayer.currentTime) {
                    try {
                        if(salvarHistorico == false) {
                            salvarHistorico = true
                
                            MusicaColetarDados = {
                                Musica: Lista.ID
                            }
                        } else {
                            MusicaColetarDados = {
                                Musica: MusicaColetarDados.Musica,
                                Tempo: audioPlayer.currentTime
                            }
                
                            coletarHistorico(MusicaColetarDados)
                
                            salvarHistorico = false
                            EnviarDados()
                        }
                    } catch (error) {
                        console.warn(error)
                    }
                }
            } EnviarDados()
        
            AddInfoTelaTocandoAgora(Lista)
    
            Atualizar_Presenca(true, currentUser.InfoEmail.email, Lista.ID);
        
            updateURLParameter('music', Lista.ID)

            Atualizar_Perfil_DC(Lista)
        
            MusicaTocandoAgora = Lista
    
            //? Vai pegar as cores da img da música
            Trocar_Letra()
            Trocar_cor_barra_musica(Lista.LinkImg)
    
            //? Vai checar se a música foi curtida ou n
            FavoritarDesfavoritarMusica(Lista.ID, 'Checar').then((resolve) => {
                document.getElementById('HeartBarraMusica').src = resolve
                document.getElementById('HeartBarraMusica2').src = resolve
            })
        
            if(trocouDeMusica == false) {
                trocouDeMusica = true
                document.title = `${Lista.NomeMusica}`
                
                setTimeout(() => {
                    fimMusica = false
                    trocouDeMusica = false
                }, 500)
        
                //? ----------------------------------------------------------
        
                document.getElementById('BarraMusica').classList.add('BarraMusicaOpen')
                arrumar_responsividade()
                const PlayBtn = document.getElementById('PlayBtn')
                PlayBtn.src = `Assets/Imgs/Icons/Pause.png`
        
                const PlayBtn2 = document.getElementById('PlayBtn2')
                PlayBtn2.src = `Assets/Imgs/Icons/Pause.png`
        
                const PlayCellBarraMusica = document.getElementById('PlayCellBarraMusica')
                PlayCellBarraMusica.src = `Assets/Imgs/Icons/Pause.png`
        
                //! Vai passar a música ou voltar usando os btns do teclado
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: Lista.NomeMusica,
                    artist: Lista.Autor,
                    album: '...',
                    artwork: [
                        { 
                            src: Lista.LinkImg, 
                            sizes: '300x300', 
                            type: 'image/png', 
                            purpose: 'cover', 
                            style: 'object-fit: cover'
                        }
                    ]
                })

                navigator.mediaSession.setActionHandler('nexttrack', function() {
                    RepetirMusica = false
                    NextSong()
                })

                navigator.mediaSession.setActionHandler('previoustrack', function() {
                    BackSong()
                })
        
                audioPlayer.src = Lista.LinkAudio
        
                //* audioPlayer.addEventListener('canplaythrough', function() {
        
                //* audioPlayer.addEventListener('pause', function() {
            
                //* audioPlayer.addEventListener('play', function() {
        
                //* audioPlayer.addEventListener('ended', function() {
                
                resolve('Música iniciada')
            }
        })
    }
}

//* -------------------------
audioPlayer.addEventListener('canplaythrough', function() {
    Audio_Tocando(ListaDarPlay.Lista, ListaDarPlay.num, ListaDarPlay.Pausar)
})

function Audio_Tocando(Lista, num, Pausar = false) {
    try {
        if(!Pausar) {
            audioPlayer.play()
        } else {
            isPlaying = true
            PausaDespausarMusica()
        }
    } catch (error) {
        console.error('Erro ao reproduzir áudio:', error.message)
    }

    //? Vai mudar a informações na barra música para o pc
    const imgMusicaBarraMusica = document.getElementById('imgMusicaBarraMusica')
    const ImgLargaEscalaBarraMusica = document.getElementById('ImgLargaEscalaBarraMusica')
    try {
        if(Lista.LinkImg.includes('treefy')) {
            imgMusicaBarraMusica.classList.add('imgMusicaBarraMusicaTreeFy')
            ImgLargaEscalaBarraMusica.classList.add('imgMusicaBarraMusicaTreeFy')
        } else {
            imgMusicaBarraMusica.classList.remove('imgMusicaBarraMusicaTreeFy')
            ImgLargaEscalaBarraMusica.classList.remove('imgMusicaBarraMusicaTreeFy')
        }
    } catch (error) {
        imgMusicaBarraMusica.classList.remove('imgMusicaBarraMusicaTreeFy')
        ImgLargaEscalaBarraMusica.classList.remove('imgMusicaBarraMusicaTreeFy')
    }
    imgMusicaBarraMusica.src = Lista.LinkImg
    ImgLargaEscalaBarraMusica.src = Lista.LinkImg
    document.getElementById('NomeMusicaBarraMusica').innerText = Lista.NomeMusica
    document.getElementById('AutorMusicaBarraMusica').innerText = Lista.Autor

    //? Vai mudar a informações na barra música para o cell
    // document.getElementById('containerImgMusicaTocandoAgora').style.backgroundImage = `url(${Lista.LinkImg})`
    document.getElementById('imgMusicaTocandoAgoraPagMusicaTocandoAgora').src = Lista.LinkImg
    document.getElementById('nomeMusicaTocandoAgoraPagMusicaTocandoAgora').innerText = Lista.NomeMusica
    document.getElementById('autorMusicaTocandoAgoraPagMusicaTocandoAgora').innerText = Lista.Autor

    //? Vai abir a img em alta escala
    imgMusicaBarraMusica.addEventListener('click', () => {
        if(window.innerWidth > 628) {
            document.getElementById('containerImgLargaEscalaBarraMusica').style.bottom = '90px'
        }
    })
    
    document.getElementById('btnAbrirContainerImgLargaEscalaBarraMusica').addEventListener('click', () => {
        document.getElementById('containerImgLargaEscalaBarraMusica').style.bottom = '90px'
    })
    
    //? Vai fechar a img em alta escala
    document.getElementById('btnFecharContainerImgLargaEscalaBarraMusica').addEventListener('click', () => {
        document.getElementById('containerImgLargaEscalaBarraMusica').style.bottom = '-100vh'
    })

    document.getElementById('containerImgLargaEscalaBarraMusica').addEventListener('click', () => {
        document.getElementById('containerImgLargaEscalaBarraMusica').style.bottom = '-100vh'
    })

    //? Vai atualizar a barra de progresso da música
    let progressoMusicaBarraMusica = document.getElementById('progressoMusicaBarraMusica') //? Progresso barra para pc
    let progressoMusicaTocandoAgora = document.getElementById('progressoMusicaTocandoAgora') //? Progresso barra para cell

    audioPlayer.addEventListener('timeupdate', function() {
        const percentProgress = (audioPlayer.currentTime / audioPlayer.duration) * 100
        progressoMusicaBarraMusica.value = percentProgress
        progressoMusicaTocandoAgora.value = percentProgress
    })

    progressoMusicaBarraMusica.addEventListener('input', function() {
        const newTime = (progressoMusicaBarraMusica.value / 100) * audioPlayer.duration
        audioPlayer.currentTime = newTime
    })

    progressoMusicaTocandoAgora.addEventListener('input', function() {
        const newTime = (progressoMusicaTocandoAgora.value / 100) * audioPlayer.duration
        audioPlayer.currentTime = newTime
    })
}

//* ------------------------
audioPlayer.addEventListener('pause', function() {
    Esta_Pausado()
})

function Esta_Pausado() {
    const PlayBtn = document.getElementById('PlayBtn')
    const PlayBtn2 = document.getElementById('PlayBtn2')
    PlayBtn.src = `Assets/Imgs/Icons/Play.png`
    PlayBtn2.src = `Assets/Imgs/Icons/Play.png`
    PlayCellBarraMusica.src = `Assets/Imgs/Icons/Play.png`
    document.title = `Musi .-. Verse`
}

//* ------------------------

audioPlayer.addEventListener('play', function() {
    Esta_Tocando(ListaDarPlay.Lista)
})

function Esta_Tocando(Lista) {
    const PlayBtn = document.getElementById('PlayBtn')
    const PlayBtn2 = document.getElementById('PlayBtn2')
    PlayBtn.src = `Assets/Imgs/Icons/Pause.png`
    PlayBtn2.src = `Assets/Imgs/Icons/Pause.png`
    PlayCellBarraMusica.src = `Assets/Imgs/Icons/Pause.png`
    document.title = `${Lista.NomeMusica}`
}

//* ------------------------

//? Ao acabar a música
audioPlayer.addEventListener('ended', function() {
    Fim_Audio()
})

function Fim_Audio()  {
    NextSong()
}

//* ------------------------

//? Vai abrir a aba com as músicas do autor ques está ouvindo a música
document.getElementById('AutorMusicaBarraMusica').addEventListener('click', () => {
    AbrirPaginas('artist', ListaDarPlay.Lista.ID)
})

//* ------------------------

//? Vai alterar a URL
const InfosUrl = {
    Music: '',
    Page: {
        Name: '',
        ID: ''
    }
}

function updateURLParameter(Tipo, ID) {
    removerParametros()
    if(Tipo != 'music') {
        InfosUrl.Page.Name = Tipo
        InfosUrl.Page.ID = ID
        
    } else {
        InfosUrl.Music = ID
    }

    let link = ''

    if(InfosUrl.Music != '') {
        link = `music=${InfosUrl.Music}`
    }

    if(InfosUrl.Page.Name != '' && InfosUrl.Music != '' && ID != '' && ID != undefined) {
        link = `${link}&${InfosUrl.Page.Name}=${InfosUrl.Page.ID}`

    } else if(ID == undefined && InfosUrl.Page.Name != undefined) {
        link = `${link}&page=${InfosUrl.Page.Name}`

    } else if(InfosUrl.Music == '') {
        link = `${InfosUrl.Page.Name}=${InfosUrl.Page.ID}`
    }
    
    const newUrl = `${window.location.href}?${link}`
    window.history.pushState({ path: newUrl }, '', newUrl)
}

//? Vai limpar a url
function removerParametros() {
  // Obtém a URL atual
  var urlAtual = window.location.href;

  // Encontra o índice do caractere "?" na URL
  var indiceInterrogacao = urlAtual.indexOf('?');

  // Se houver um "?" na URL, remove tudo após ele
  if (indiceInterrogacao !== -1) {
    var novaUrl = urlAtual.substring(0, indiceInterrogacao);
    
    // Atualiza a URL sem recarregar a página
    window.history.pushState({ path: novaUrl }, '', novaUrl);
  }
}

//? Vai curtir / descurtir a música ao clica no coração
const HeartBarraMusica = document.getElementById('HeartBarraMusica')
HeartBarraMusica.addEventListener('click', () => {
    FavoritarDesfavoritarMusica(MusicaTocandoAgora.ID, 'Editar')
    .then((resolve) => {
        HeartBarraMusica.src = resolve
    })
    .catch((error) => {
        alert(error)
    })
})

//? Vai pausar a música
PlayBtn.addEventListener('click', function() {
    PausaDespausarMusica()
})

document.addEventListener('keydown', function(event) {
    if (event.key === " " && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        event.preventDefault()
        PausaDespausarMusica()
    }
})

PlayBtn2.addEventListener('click', function() {
    PausaDespausarMusica()
})

PlayCellBarraMusica.addEventListener('click', function() {
    PausaDespausarMusica()
})

function PausaDespausarMusica() {
    if(!isPlaying) {
        isPlaying = true
        PlayBtn.src = `Assets/Imgs/Icons/Pause.png`
        PlayBtn2.src = `Assets/Imgs/Icons/Pause.png`
        PlayCellBarraMusica.src = `Assets/Imgs/Icons/Pause.png`
        audioPlayer.play()

        try {
            document.title = `${ListaProxMusica.Musicas[ListaProxMusica.Numero].NomeMusica}`
        } catch{}

    } else {
        document.title = `Musi ._. Verse`
        isPlaying = false
        PlayBtn.src = `Assets/Imgs/Icons/Play.png`
        PlayBtn2.src = `Assets/Imgs/Icons/Play.png`
        PlayCellBarraMusica.src = `Assets/Imgs/Icons/Play.png`
        audioPlayer.pause()
    }
}

function Repetir_musica() {
    if(RepetirMusica == true) {
        RepetirMusica = false
        document.getElementById('CicleBtn').src = 'Assets/Imgs/Icons/Cicle.png'
        document.getElementById('CicleBtn2').src = 'Assets/Imgs/Icons/Cicle.png'
    } else {
        RepetirMusica = true
        document.getElementById('CicleBtn').src = 'Assets/Imgs/Icons/CicleSelected.png'
        document.getElementById('CicleBtn2').src = 'Assets/Imgs/Icons/CicleSelected.png'
    }
}

// //? Vai pular a música
const NextBtn = document.getElementById('NextBtn')
NextBtn.addEventListener("click", () => {
    if(RepetirMusica) {
        Repetir_musica()
    }
    NextSong()
})

const NextBtn2 = document.getElementById('NextBtn2')
NextBtn2.addEventListener("click", () => {
    if(RepetirMusica) {
        Repetir_musica()
    }
    NextSong()
})

//? Vai repetir a música
const CicleBtn = document.getElementById('CicleBtn')
CicleBtn.addEventListener('click', () => {
    Repetir_musica()
})

const CicleBtn2 = document.getElementById('CicleBtn2')
CicleBtn2.addEventListener('click', () => {
    Repetir_musica()
})

//? Proxima música
function NextSong() {
    if(RepetirMusica) {
       if(!Array.isArray(ListaProxMusica.Musicas)) {
            DarPlayMusica(ListaProxMusica.Musicas, 0)

       } else {
            DarPlayMusica(ListaProxMusica.Musicas[ListaProxMusica.Numero], ListaProxMusica.Numero)
       }

    } else {
        if(!Array.isArray(ListaProxMusica.Musicas)) {
            ListaProxMusica.Musicas = TodasMusicas.Musicas
        }

        if(ListaProxMusica.FilaMusicas != undefined && ListaProxMusica.FilaMusicas.Musicas.length > 0) {
            DarPlayMusica(ListaProxMusica.FilaMusicas.Musicas[0], 0)
    
            ListaProxMusica.FilaMusicas.Musicas.splice(0, 1)
            RetornarMusicasASeguir()
    
        } else {
            try {
                if(ListaProxMusica.Numero + 1 < ListaProxMusica.Musicas.length) {
                    ListaProxMusica.Numero =  ListaProxMusica.Numero + 1
                } else {
                    ListaProxMusica.Numero = 0
                }
            } catch (error) {
                console.warn(error)
                ListaProxMusica.Numero = 0
            }
        
            DarPlayMusica(ListaProxMusica.Musicas[ListaProxMusica.Numero], ListaProxMusica.Numero)
        }
    }
}

// //? Vai voltar para a música anterior
const BackBtn = document.getElementById('BackBtn')
BackBtn.addEventListener("click", () => {
    BackSong()
})

const BackBtn2 = document.getElementById('BackBtn2')
BackBtn2.addEventListener("click", () => {
    BackSong()
})

function BackSong() {
    if(ListaProxMusica.Numero > 0) {
        ListaProxMusica.Numero =  ListaProxMusica.Numero - 1
    } else {
        ListaProxMusica.Numero =  ListaProxMusica.Musicas.length
    }

    DarPlayMusica(ListaProxMusica.Musicas[ListaProxMusica.Numero], ListaProxMusica.Numero)
}

//? Vai curtir ou descurtir a música
function FavoritarDesfavoritarMusica(IdMusica, OqFazer = 'Editar') {
    let MusicaEncontrada = false
    return new Promise((resolve, reject) => {
        try {
            for(let c = 0; c <= currentUser.User.MusicasCurtidas.length; c++) {
                try {
                    if(currentUser.User.MusicasCurtidas[c] == IdMusica && MusicaEncontrada == false) {
                        MusicaEncontrada = true
        
                        // Música encontrada nas curtidas, então descurta.
                        if(OqFazer == 'Editar') {
                            currentUser.User.MusicasCurtidas.splice(c, 1)
                            db.collection('Users')
                            .doc(currentUser.User.Id)
                            .update({ MusicasCurtidas: currentUser.User.MusicasCurtidas })
                            .then(() => {
                                resolve('./Assets/Imgs/Icons/icon _heart_ (1).png')
                            })
        
                        } else {
                            resolve('./Assets/Imgs/Icons/icon _heart_.png')
                        }
                    }
        
                    // Música não encontrada nas curtidas, então curta.
                    if(c + 1 >= currentUser.User.MusicasCurtidas.length && MusicaEncontrada == false) {
                        MusicaEncontrada = true
                        
                        if(OqFazer == 'Editar') {
                            currentUser.User.MusicasCurtidas.push(IdMusica)
                            db.collection('Users')
                            .doc(currentUser.User.Id)
                            .update({ MusicasCurtidas: currentUser.User.MusicasCurtidas })
                            .then(() => {
                                resolve('./Assets/Imgs/Icons/icon _heart_.png')
                            })
        
                        } else {
                            resolve('./Assets/Imgs/Icons/icon _heart_ (1).png')
                        }
                    }
                } catch (error) {
                    console.warn(error)
                }
            }
        } catch{}
    })
}

let arrayMusicasArtista = []        
async function RetornarMusicasArtista(Artista, Local, PegarLista) {
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let ArtistaFormadado = formatarTexto(Artista)
    let contadorMusicasLinhaArtista = -1
    arrayMusicasArtista = [] //? Vai salvar as músicas do artista pesquisado para poder colocar como lista de prox músicas
    ListaProxMusica = {}

    for(let c = TodasMusicas.Musicas.length -1; c >= 0; c--) {
        let AutorFormadato  =  formatarTexto(TodasMusicas.Musicas[c].Autor)

        if(ArtistaFormadado.includes(AutorFormadato) || AutorFormadato.includes(ArtistaFormadado)) {
            contadorMusicasLinhaArtista++
            arrayMusicasArtista.push(TodasMusicas.Musicas[c])
            article.className = 'containerMusicaLinha'

            const div = document.createElement('div')
            const divPrimeiraParte = document.createElement('div')
            const contador = document.createElement('p')
            const divImg = document.createElement('div')
            const img = document.createElement('img')
            const divTexto = document.createElement('div')
            const Nome = document.createElement('p')
            const AutorDaMusica = document.createElement('span')
            const Genero = document.createElement('p')
            const Heart = document.createElement('img')

            div.className = 'MusicasLinha'
            divTexto.className = 'TextoMusicaCaixa'
            Heart.className = 'btnCurtirMeuPerfil'
            divImg.className = 'DivImgMusicaMeuPerfil'
            img.className = 'ImgMusicaMeuPerfil'
            Genero.className = 'GeneroMeuPerfil'

            contador.innerText = contadorMusicasLinhaArtista + 1
            img.src = TodasMusicas.Musicas[c].LinkImg
            Nome.innerText = TodasMusicas.Musicas[c].NomeMusica
            Nome.title = TodasMusicas.Musicas[c].NomeMusica
            AutorDaMusica.innerText = TodasMusicas.Musicas[c].Autor
            AutorDaMusica.title = TodasMusicas.Musicas[c].Autor
            Genero.innerText = TodasMusicas.Musicas[c].Genero
            Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'
            
            divTexto.appendChild(Nome)
            divTexto.appendChild(AutorDaMusica)
            divPrimeiraParte.appendChild(contador)
            divImg.appendChild(img)
            divPrimeiraParte.appendChild(divImg)
            divPrimeiraParte.appendChild(divTexto)
            div.appendChild(divPrimeiraParte)
            div.appendChild(Genero)
            div.appendChild(Heart)
            article.appendChild(div)

            if(PegarLista == 'PegarLista') {
                ListaProxMusica = {
                    Musicas: arrayMusicasArtista,
                    Numero: 0,
                }
            }

            
            //? Ao clicar na música
            let numContador = contadorMusicasLinhaArtista
            div.addEventListener('click', (event) => {  
                if (event.target != AutorDaMusica && event.target != Heart) {
                    ListaProxMusica = {
                        Musicas: arrayMusicasArtista,
                        Numero: numContador,
                    }
        
                    AbrirTelaTocandoAgora(Artista)
                    DarPlayMusica(TodasMusicas.Musicas[c], numContador)

                    if(Comando == 'Salvar pesquisa') {
                        //? Vai salvar a pesquisa
                        const pesquisa = {TipoPesquisa: 'music', ID: TodasMusicas.Musicas[c].ID}
                        SalvarUltimasPesquisas(pesquisa)
                    }
                }
            })

            div.addEventListener('contextmenu', function (e) {
                e.preventDefault()

                musicaSelecionadaBtnDireito = TodasMusicas.Musicas[c]
                const containerOptionsClickMusic = document.getElementById('containerOptionsClickMusic')
                const containerOptionsClickArtista = document.getElementById('containerOptionsClickArtista')
                autorSelecionadoBtnDireito = TodasMusicas.Musicas[c]

                if(e.target.innerText == AutorDaMusica.innerText) {
                    hideMenu()
                    // Position the custom menu at the mouse coordinates
                    containerOptionsClickArtista.style.left = e.clientX+ 'px'
                    containerOptionsClickArtista.style.top = e.clientY + 'px'
                    containerOptionsClickArtista.style.display = 'block'

                } else {
                    hideMenu()
                    // Position the custom menu at the mouse coordinates
                    containerOptionsClickMusic.style.left = e.clientX+ 'px'
                    containerOptionsClickMusic.style.top = e.clientY + 'px'
                    containerOptionsClickMusic.style.display = 'block'
                }

                // Close the menu when clicking outside of it
                document.addEventListener('click', hideMenu)
                document.addEventListener('scroll', hideMenu)

                //? Vai curtir, descurtir usando a função btn direito
                FavoritarDesfavoritarMusica(arrayMusicasArtista[numContador].ID, 'Checar').then((resolve) => {
                    const spanLi = document.createElement('span')

                    if(resolve == './Assets/Imgs/Icons/icon _heart_.png') {
                        spanLi.innerText = 'Remover dos Favotitos'
                    } else {
                        spanLi.innerText = 'Adicionar aos Favotitos'
                    }

                    //? Btn Add | Remover dos favoritos btn direito
                    spanLi.addEventListener('click', () => {
                        FavoritarDesfavoritarMusica(musicaSelecionadaBtnDireito.ID).then((resolveSrc) => {
                            Heart.src = resolveSrc
                        })
                    })
                    liAddRemoveFavoritosClickMusic.innerHTML = ''
                    liAddRemoveFavoritosClickMusic.appendChild(spanLi)
                })

                //? Vai mostrar os créditos da música
                const spanCreditos = document.createElement('span')
                spanCreditos.innerText = 'Mostrar créditos'
                spanCreditos.addEventListener('click', () => {
                    const nomeMusicaMostrarCreditos = document.createElement('span')
                    nomeMusicaMostrarCreditos.innerText = Nome.innerText
                    document.querySelector('#menuCreditosNomeMusica').innerHTML = ''
                    document.querySelector('#menuCreditosNomeMusica').appendChild(nomeMusicaMostrarCreditos)

                    

                    const autorCreditos = document.createElement('span')
                    autorCreditos.innerText = AutorDaMusica.innerText
                    document.querySelector('#menuCreditosAutor').innerHTML = ''
                    document.querySelector('#menuCreditosAutor').appendChild(autorCreditos)

                    autorCreditos.addEventListener('click', () => {
                        document.querySelector('#containerMenuCreditos').style.display = 'none'
                        AbrirPaginas('artist', TodasMusicas.Musicas[c].ID)
                    })

                    const NomeUserCreditos = document.createElement('span')

                    for(let con = 0; con < TodosOsUsers.length; con++) {
                        if(TodosOsUsers[con].User.Email == TodasMusicas.Musicas[c].EmailUser) {
                            if(TodosOsUsers[con].User.Nome != '' && TodosOsUsers[con].User.Nome != undefined) {
                                NomeUserCreditos.innerText = TodosOsUsers[con].User.Nome
                                document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'underline'
                                document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'pointer'
                            } else {
                                document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                                NomeUserCreditos.innerText = TodasMusicas.Musicas[c].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                            }

                            NomeUserCreditos.addEventListener('click', () => {
                                AbrirPaginas('profile', TodosOsUsers[con].User.Id)
                                closeMenuCreditos()
                            })
                        }
                    }

                    if(NomeUserCreditos.innerText == '') {
                        document.querySelector('#menuCreditosNoneQuemPostou').style.textDecoration = 'none'
                        document.querySelector('#menuCreditosNoneQuemPostou').style.cursor = 'default'
                        NomeUserCreditos.innerText = TodasMusicas.Musicas[c].EmailUser //? Caso o user não tiver uma conta nesse site ele vai informar o email do user que postou ao invés de mostrar "Desconhecido"
                    }

                    document.querySelector('#menuCreditosNoneQuemPostou').innerHTML = ''
                    document.querySelector('#menuCreditosNoneQuemPostou').appendChild(NomeUserCreditos)


                    openMenuCreditos()
                })

                liMostrarCretidos.innerHTML = ''
                liMostrarCretidos.appendChild(spanCreditos)
            })

            //? Vai checar se as músicas foram curtidas pelo user
            FavoritarDesfavoritarMusica(arrayMusicasArtista[numContador].ID, 'Checar').then((resolve) => {
                Heart.src = resolve
            })

            //? Vai curtir / descurtir a música
            Heart.addEventListener('click', () => {
                FavoritarDesfavoritarMusica(arrayMusicasArtista[numContador].ID, 'Editar').then((resolve) => {
                    Heart.src = resolve
                })
            })
        }
    }

    const section = document.createElement('section')
    section.className = 'containerMusica'
    const articleContainer = document.createElement('article')
    articleContainer.className = 'articleContainer'
    articleContainer.style.width = '100%'
    articleContainer.style.padding = '0'
    articleContainer.appendChild(article)
    section.appendChild(articleContainer)
    Local.appendChild(section)

}

//? Ao clicar no btn de play
const  btnPlayHeaderArtista = document.getElementById('btnPlayHeaderArtista')
btnPlayHeaderArtista.addEventListener('click', () => {
    AbrirTelaTocandoAgora(arrayMusicasArtista[0])

    ListaProxMusica = {
        Musicas: arrayMusicasArtista,
        Numero: 0,
    }
    
    DarPlayMusica(arrayMusicasArtista[0], 0)
})

//? Vai adicionar as informações na tela tocando agora
let infoMusicaTocandoAgora
function AddInfoTelaTocandoAgora(Musica) {
    infoMusicaTocandoAgora = Musica
    document.getElementById('btnAbrirTelaTocandoAgora').style.display = 'block'

    const TituloMusicaTelaTocandoAgora = document.getElementById('TituloMusicaTelaTocandoAgora')
    const imgMusicaTelaTocandoAgora = document.getElementById('imgMusicaTelaTocandoAgora')
    const NomeMusicaTelaTocandoAgora = document.getElementById('NomeMusicaTelaTocandoAgora')
    const AutorMusicaTelaTocandoAgora = document.getElementById('AutorMusicaTelaTocandoAgora')
    const imgUserPostouMusicaTelaTocandoAgora = document.getElementById('imgUserPostouMusicaTelaTocandoAgora')
    const sobre_qm_postou_cell = document.getElementById('sobre_qm_postou_cell')
    const NomeUserPostouMusicaTelaTocandoAgora = document.getElementById('NomeUserPostouMusicaTelaTocandoAgora')
    const NumeroOuvintesTelaTocandoAgora = document.getElementById('NumeroOuvintesTelaTocandoAgora')
    const btnSeguirUserTelaTocandoAgora = document.getElementById('btnSeguirUserTelaTocandoAgora')

    imgMusicaTelaTocandoAgora.src = Musica.LinkImg

    if(imgMusicaTelaTocandoAgora.src.includes('treefy')) {
        imgMusicaTelaTocandoAgora.classList.add('imgMusicaTelaTocandoAgoraTreeFy')
      } else {
        imgMusicaTelaTocandoAgora.classList.remove('imgMusicaTelaTocandoAgoraTreeFy')
      }
    NomeMusicaTelaTocandoAgora.innerText = Musica.NomeMusica
    AutorMusicaTelaTocandoAgora.innerText = Musica.Autor

    //? Vai pegar as informações do user que postou a música
    let seguindoEsseUser = false
    btnSeguirUserTelaTocandoAgora.style.display = ''
    for(let c = 0; c < TodosOsUsers.length; c++) {
        if(TodosOsUsers[c].User.Email == Musica.EmailUser) {
            
            // Pré-carregue as imagens
            carregarImagem(TodosOsUsers[c].User.Personalizar.FotoPerfil, function(imgPerfil) {
                carregarImagem(TodosOsUsers[c].User.Personalizar.Background, function(imgBackground) {
                    if (imgPerfil) {
                        imgUserPostouMusicaTelaTocandoAgora.src = imgPerfil.src
                        sobre_qm_postou_cell.src = imgPerfil.src
                    } else if (imgBackground) {
                        imgUserPostouMusicaTelaTocandoAgora.src = imgBackground.src
                        sobre_qm_postou_cell.src = imgBackground.src
                    } else {
                        imgUserPostouMusicaTelaTocandoAgora.src = 'Assets/Imgs/Banners/fitaCassete.avif'
                        sobre_qm_postou_cell.src = 'Assets/Imgs/Banners/fitaCassete.avif'
                    }
                })
            })
              

            NomeUserPostouMusicaTelaTocandoAgora.innerText = TodosOsUsers[c].User.Nome
            document.querySelector('#nome_qm_postou_cell').innerText = TodosOsUsers[c].User.Nome
            
            try {
                NumeroOuvintesTelaTocandoAgora.innerText = `${TodosOsUsers[c].User.InfosPerfil.ViewsSemanais.Views} Ouvintes semanais`
                document.querySelector('#num_ouvintes_cell').innerText = `${TodosOsUsers[c].User.InfosPerfil.ViewsSemanais.Views} Ouvintes semanais`
            } catch{}

            //? Vai checar se você segue o user ou se o user pesquisado é você
            for(let i = 0; i <= currentUser.User.InfosPerfil.Seguindo.length; i++) {
                
                try {
                    if(currentUser.User.InfosPerfil.Seguindo[i] == TodosOsUsers[c].User.Email) {

                        seguindoEsseUser = true
                        btnSeguirUserTelaTocandoAgora.classList.add('btnSeguindoUser')
                        btnSeguirUserTelaTocandoAgora.innerText = 'Seguindo'
                        
                        
                    } else if(TodosOsUsers[c].User.Email == currentUser.User.Email) {
                        seguindoEsseUser = true
                        btnSeguirUserTelaTocandoAgora.style.display = 'none'
                    }
                } catch (error) {
                    console.warn(error)
                }
            }
            
            if(!seguindoEsseUser) {
                btnSeguirUserTelaTocandoAgora.style.display = ''
                btnSeguirUserTelaTocandoAgora.innerText = 'Seguir'
            }

            //? Vai começar a seguir
            btnSeguirUserTelaTocandoAgora.addEventListener('click', () => {
                let seguindoEsseUserBtn = false
                let feito = false
                let contador = 0
                for(let f = 0; f <= currentUser.User.InfosPerfil.Seguindo.length; f++) {
                    try {
                        if(TodosOsUsers[c].User.Email == currentUser.User.InfosPerfil.Seguindo[f] && TodosOsUsers[c].User.Email != currentUser.User.Email && !feito) {
                            feito = true
                           seguindoEsseUserBtn = true
                           contador = f
                        }
                    } catch (error) {
                        console.warn(error)
                    }
                }
            
                let oqFazerComUser
                 //? Se está seguindo, vai remover da lista
                 if(seguindoEsseUserBtn) {
                    currentUser.User.InfosPerfil.Seguindo.splice(contador, 1)
                    seguindoEsseUserBtn = false
                    btnSeguirUserTelaTocandoAgora.innerText = 'Seguir'
                    oqFazerComUser = 'Remover Dos Seguidores'
            
                } else {
                    currentUser.User.InfosPerfil.Seguindo.push(TodosOsUsers[c].User.Email)
                    seguindoEsseUserBtn = true
                    btnSeguirUserTelaTocandoAgora.innerText = 'Seguindo'
                    oqFazerComUser = 'Adicionar Nos Seguidores'
                }
                db.collection('Users').doc(currentUser.User.Id).update({ InfosPerfil: currentUser.User.InfosPerfil }).then(() => {
                    //? Vai salvar no perfil do user pequisado o novo seguidor
                    let NovoSeguidorSalvo = false
                    db.collection('Users').get().then((snapshot) => {
                        snapshot.docs.forEach(Users => {
            
                            if(Users.data().Email == TodosOsUsers[c].User.Email && !NovoSeguidorSalvo) {
                                NovoSeguidorSalvo= true
                                const InfosPerfilUserPesquisado = Users.data().InfosPerfil
                    
                                if(oqFazerComUser == 'Remover Dos Seguidores') {
                                    for(let c = 0; c < InfosPerfilUserPesquisado.Seguidores.length; c++) {
                                        if(InfosPerfilUserPesquisado.Seguidores[f] == currentUser.User.Email) {
                                            InfosPerfilUserPesquisado.Seguidores.splice(f, 1)
                                        }
                                    }
                                    
                                } else if(oqFazerComUser == 'Adicionar Nos Seguidores') {
                                    InfosPerfilUserPesquisado.Seguidores.push(currentUser.User.Email)
                                }
                                
                                setTimeout(() => {
                                    db.collection('Users').doc(Users.id).update({ InfosPerfil: InfosPerfilUserPesquisado })
                                }, 500)
                            }
                        })
                    })
                })
            })
        }
    }
    
    //? Vai retonar a fila de músicas
    RetornarMusicasASeguir()
}

//? Vai retonar a fila de músicas
function RetornarMusicasASeguir() {
    let RetornarProximasMusicasFeito = false

    //* para o pc
    const containerMusicaslistaTelaTocandoAgora = document.getElementById('containerMusicaslistaTelaTocandoAgora')
    containerMusicaslistaTelaTocandoAgora.innerHTML = ''

    //* para o mobile
    const container_musicas_a_seguir = document.getElementById('container_musicas_a_seguir')
    container_musicas_a_seguir.innerHTML = ''

    const infoLista = document.getElementById('infoLista');
    
    try {
        if (ListaProxMusica.Musicas.length - parseInt(ListaProxMusica.Numero) > 0 && !RetornarProximasMusicasFeito) {
            RetornarProximasMusicasFeito = true;
            let max = 4;

            if (ListaProxMusica.Musicas.length - parseInt(ListaProxMusica.Numero) < 4) {
                max = ListaProxMusica.Musicas.length - parseInt(ListaProxMusica.Numero);
            }

            infoLista.innerText = 'A seguir';

            function getNextFourElements(arr, startIndex) {
                let maxContador = 4;
                if (arr.length < 4) {
                    maxContador = arr.length;
                }

                const result = [];
                let i = startIndex + 1;

                // Se houver elementos em FilaMusicas.Musicas, adiciona-os primeiro
                if (ListaProxMusica.FilaMusicas && ListaProxMusica.FilaMusicas.Musicas) {
                    const filaMusicas = ListaProxMusica.FilaMusicas.Musicas;
                    for (let j = 0; j < filaMusicas.length && result.length < maxContador; j++) {
                        result.push(filaMusicas[j]);
                    }
                }

                // Adiciona os elementos restantes de Musicas
                while (result.length < maxContador) {
                    result.push(arr[i % arr.length]);
                    i++;
                }

                return result;
            }

            // Exemplo de uso:
            const minhaArray = ListaProxMusica.Musicas;
            const startIndex = parseInt(ListaProxMusica.Numero); // Pode ser qualquer índice da sua escolha
            const proximasQuatroCasas = getNextFourElements(minhaArray, startIndex);

            for (let c = 0; c < proximasQuatroCasas.length; c++) {
                RetornarMusicas(proximasQuatroCasas[c].ID, containerMusicaslistaTelaTocandoAgora, 'Indeterminado', 'Linha', false, false, 'SemScroll');

                RetornarMusicas(proximasQuatroCasas[c].ID, container_musicas_a_seguir, 'Indeterminado', 'Linha', false, false, 'SemScroll');
            }
        } else {
            infoLista.innerText = 'Sua lista está vazia';
        }
    } catch (error) {
        infoLista.innerText = 'Sua lista está vazia';
    }
}


//? Ao clicar na música tocando agora na barra tela música tocando agora, vai abir a aba mostrando todas as músicas do autor
document.getElementById('containerMusicaTelaTocanAgora').addEventListener('click',() => {
    AbrirPaginas('artist', infoMusicaTocandoAgora.ID)

    document.querySelector('#PagMusicaTocandoAgora').classList.remove('Open')
})

//* Ao clicar na música tocando agora cell na barra tela música tocando agora, vai abir a aba mostrando todas as músicas do autor
document.getElementById('autorMusicaTocandoAgoraPagMusicaTocandoAgora').addEventListener('click',() => {
    AbrirPaginas('artist', infoMusicaTocandoAgora.ID)
})

//? Vai abrir a página do user que postou a música ao clicar no perfil dele da tela música tocando agora
document.getElementById('SobreQuemPostou').addEventListener('click', (e) => {
    let el = e.target
    if(el.id == 'btnSeguirUserTelaTocandoAgora') {
        for(let c = 0; c < TodosOsUsers.length; c++) {
            if(infoMusicaTocandoAgora.EmailUser == TodosOsUsers[c].User.Email) {
                AbrirPaginas('profile', TodosOsUsers[c].User.Id, true, false,'Seguir User')
            }
        }
    } else if(document.getElementById('PagPerfilOutroUser').style.display != 'block'){
        for(let c = 0; c < TodosOsUsers.length; c++) {
            if(infoMusicaTocandoAgora.EmailUser == TodosOsUsers[c].User.Email) {
                AbrirPaginas('profile', TodosOsUsers[c].User.Id)
            }
        }
    }
})

//* Vai abrir a página do user que postou a música ao clicar no perfil dele da tela música tocando agora
document.getElementById('container_sobre_qm_postou_cell').addEventListener('click', () => {
    for(let c = 0; c < TodosOsUsers.length; c++) {
        if(infoMusicaTocandoAgora.EmailUser == TodosOsUsers[c].User.Email) {
            AbrirPaginas('profile', TodosOsUsers[c].User.Id, true, false,'Seguir User')
            document.querySelector('#PagMusicaTocandoAgora').classList.remove('Open')
        }
    }
})

let ultimoNomeAbirTelaTocandoAgora
function AbrirTelaTocandoAgora(Nome) {
    Fehcar_Aba_Amigos()
    const TelaTocandoAgora = document.getElementById('TelaTocandoAgora')

    if(Nome == 'OpenViaBtn') {
        if(TelaTocandoAgora.classList == 'TelaTocandoAgoraOpen') {
            TelaTocandoAgora.classList.remove('TelaTocandoAgoraOpen')

        } else {
            TelaTocandoAgora.classList.add('TelaTocandoAgoraOpen')
            ultimoNomeAbirTelaTocandoAgora = Nome
        }
    } else if(ultimoNomeAbirTelaTocandoAgora != Nome) {
        TelaTocandoAgora.classList.add('TelaTocandoAgoraOpen')
        ultimoNomeAbirTelaTocandoAgora = Nome
    }
} 

function FecharTelaTocandoAgora() {
    const TelaTocandoAgora = document.getElementById('TelaTocandoAgora')
    TelaTocandoAgora.classList.remove('TelaTocandoAgoraOpen')
}

//? Vai retornar as playlists
let arrayMusicasPlaylist = []
function RetornarPlayList(Pesquisa, Local, Formato = 'Caixa', ID = null, Comando) {
    let PesquisaFormatada = formatarTexto(Pesquisa)
    let contadorMusicasLinha = 0
    
    const section = document.createElement('section')
    section.className = 'containerPlaylistsCaixa'
    const TituloPlaylist = document.createElement('h1')
    TituloPlaylist.innerText = 'PlayLists'
    const articleContainer = document.createElement('article')
    articleContainer.className = 'articleContainer'
    const article = document.createElement('article')

    for(let c = 0; c < TodasMusicas.Playlists.length; c++) {
        let NomePlaylist = formatarTexto(TodasMusicas.Playlists[c].Nome)
        let PesquisaPassou = false //? Caso a playlist cumpra os requisitos da pesquisa

        if(ID == null) {
            if(PesquisaFormatada.includes(NomePlaylist) || NomePlaylist.includes(PesquisaFormatada)) {
                PesquisaPassou = true
            }
        } else {
            if(TodasMusicas.Playlists[c].ID == ID && !PesquisaPassou) {
                PesquisaPassou = true
            }
        }

        if(PesquisaPassou) {
            if(TodasMusicas.Playlists[c].Estado == 'Pública') {
                if(Formato == 'Caixa') {
                    const container = document.createElement('div')
                    const containerImg = document.createElement('div')
                    const img = document.createElement('img')
                    const TextoMusicaCaixa = document.createElement('div')
                    const p = document.createElement('p')
                    const span = document.createElement('span')

                    container.className = 'containerPlaylists'
                    containerImg.className = 'containerImgPlaylist'
                    TextoMusicaCaixa.className = 'TextoMusicaCaixa'

                    img.src = TodasMusicas.Playlists[c].Musicas[0].LinkImg
                    p.innerText = TodasMusicas.Playlists[c].Nome

                    let userDonoDaPlaylist
                    for(let i = 0; i < TodosOsUsers.length; i++) {
                        if(TodosOsUsers[i].User.Email == TodasMusicas.Playlists[c].EmailUser) {
                            span.innerText = `De ${TodosOsUsers[i].User.Nome}`
                            userDonoDaPlaylist = TodosOsUsers[i]
                        }
                    }

                    containerImg.appendChild(img)
                    container.appendChild(containerImg)
                    TextoMusicaCaixa.appendChild(p)
                    TextoMusicaCaixa.appendChild(span)
                    container.appendChild(TextoMusicaCaixa)

                    article.appendChild(container)

                    //? Ao clicar no nome do user
                    span.addEventListener('click', () => {
                        AbrirPerfilOutroUser(userDonoDaPlaylist.User)

                        if(Comando == 'Salvar pesquisa') {
                            //? Vai salvar a pesquisa
                            const pesquisa = {TipoPesquisa: 'profile', ID: userDonoDaPlaylist.User.Id}
                            SalvarUltimasPesquisas(pesquisa)
                        }
                    })

                    //? Vai abrir a playlist
                    container.addEventListener('click', (e) => {
                        let el = e.target

                        if(el != span) {
                            AbrirPlaylist(TodasMusicas.Playlists[c])

                            if(Comando == 'Salvar pesquisa') {
                                //? Vai salvar a pesquisa
                                const pesquisa = {TipoPesquisa: 'playlist', ID: TodasMusicas.Playlists[c].ID}
                                SalvarUltimasPesquisas(pesquisa)
                            }
                        }

                    })

                    container.addEventListener('contextmenu', function (e) {
                        e.preventDefault()

                        playlistSelecionadaBtnDireito = TodasMusicas.Playlists[c]
                        const containerOptionsClickPlaylist = document.getElementById('containerOptionsClickPlaylist')

                        hideMenu()
                        // Position the custom menu at the mouse coordinates
                        containerOptionsClickPlaylist.style.left = e.clientX+ 'px'
                        containerOptionsClickPlaylist.style.top = e.clientY + 'px'
                        containerOptionsClickPlaylist.style.display = 'block'
                    })

                } else if(Formato == 'Linha') {
                    arrayMusicasPlaylist = []

                    for(let i = TodasMusicas.Playlists[c].Musicas.length -1; i >= 0; i--) {
                        arrayMusicasPlaylist.push(TodasMusicas.Playlists[c].Musicas[i])
                        contadorMusicasLinha++
                        article.className = 'containerMusicaLinha'
                
                        const div = document.createElement('div')
                        const divPrimeiraParte = document.createElement('div')
                        const contador = document.createElement('p')
                        const divImg = document.createElement('div')
                        const img = document.createElement('img')
                        const divTexto = document.createElement('div')
                        const Nome = document.createElement('p')
                        const AutorDaMusica = document.createElement('span')
                        const Genero = document.createElement('p')
                        const Heart = document.createElement('img')
                
                        div.className = 'MusicasLinha'
                        divTexto.className = 'TextoMusicaCaixa'
                        Heart.className = 'btnCurtirMeuPerfil'
                        divImg.className = 'DivImgMusicaMeuPerfil'
                        img.className = 'ImgMusicaMeuPerfil'
                        Genero.className = 'GeneroMeuPerfil'
                
                        if(contadorMusicasLinha < 10) {
                            contador.innerText = `0${contadorMusicasLinha}`

                        } else {
                            contador.innerText = contadorMusicasLinha
                        }
                        img.src = TodasMusicas.Playlists[c].Musicas[i].LinkImg
                        if(img.src.includes('treefy')) {
                            divImg.classList.add('DivImgMusicaMeuPerfil', 'DivImgMusicaMeuPerfilTreeFy')
                        } else {
                            divImg.classList.add('DivImgMusicaMeuPerfil')
                        }
                
                        Nome.innerText = TodasMusicas.Playlists[c].Musicas[i].NomeMusica
                        Nome.title = TodasMusicas.Playlists[c].Musicas[i].NomeMusica
                        AutorDaMusica.innerText = TodasMusicas.Playlists[c].Musicas[i].Autor
                        AutorDaMusica.title = TodasMusicas.Playlists[c].Musicas[i].Autor
                        Genero.innerText = TodasMusicas.Playlists[c].Musicas[i].Genero
                        Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'
                        
                        divTexto.appendChild(Nome)
                        divTexto.appendChild(AutorDaMusica)
                        divPrimeiraParte.appendChild(contador)
                        divImg.appendChild(img)
                        divPrimeiraParte.appendChild(divImg)
                        divPrimeiraParte.appendChild(divTexto)
                        div.appendChild(divPrimeiraParte)
                        div.appendChild(Genero)
                        div.appendChild(Heart)
                        article.appendChild(div)
                
                        div.addEventListener('click', (event) => {
                            
                            if (event.target != AutorDaMusica && event.target != Heart) {
                                AbrirTelaTocandoAgora(Pesquisa)

                                ListaProxMusica = {
                                    Musicas: arrayMusicasPlaylist,
                                    Numero: i,
                                }
                                DarPlayMusica(TodasMusicas.Playlists[c].Musicas[i], i)
                            }
                        })
                
                        FavoritarDesfavoritarMusica(TodasMusicas.Playlists[c].Musicas[i].ID, 'Checar').then((resolve) => {
                            Heart.src = resolve
                        })
                
                        Heart.addEventListener('click', () => {
                            FavoritarDesfavoritarMusica(TodasMusicas.Playlists[c].Musicas[i].ID, 'Editar').then((resolve) => {
                                Heart.src = resolve
                            })
                        })
                
                        AutorDaMusica.addEventListener('click', () => {
                            AbrirPaginas('artist', TodasMusicas.Playlists[c].Musicas[i].ID)
                        })
                    }
                }
            }
        }
    }

    if(article.innerHTML != '') {
        if(Formato == 'Caixa') {
            section.appendChild(TituloPlaylist)
        } else {
            section.className = 'containerMusica'
        }
        articleContainer.appendChild(article)
        section.appendChild(articleContainer)
        Local.appendChild(section)
    }

}

//? Vai abrir a playlist selecionada
function AbrirPlaylist(Playlist) {
    updateURLParameter('playlist', Playlist.ID)

    FecharPaginas()
    const imgPerfilPagPlaylist = document.getElementById('imgPerfilPagPlaylist')
    if(Playlist.Musicas[0].LinkImg.includes ('treefy')) {
        imgPerfilPagPlaylist.classList.add('imgPerfilPagPlaylistTreeFy')
    } else {
        imgPerfilPagPlaylist.classList.remove('imgPerfilPagPlaylistTreeFy')
    }

    imgPerfilPagPlaylist.src = Playlist.Musicas[0].LinkImg
    document.getElementById('NomePagPlaylist').innerText = Playlist.Nome
    
    if(Playlist.Descricao.trim() != '') {
        document.getElementById('descPlaylist').innerText = Playlist.Descricao
    } else {
        document.getElementById('descPlaylist').innerText = ''
    }

    document.getElementById('containerMusicasPagPlaylist').innerHTML = ''
    document.querySelector('body').style.overflow = 'hidden'

    // RetornarMusicasPagPlaylist(span.innerText, document.getElementById('containerMusicasPagPlaylist'))
    RetornarPlayList('', document.getElementById('containerMusicasPagPlaylist'), 'Linha', Playlist.ID)
    
    // SalvarHistoricoDePaginas(document.getElementById('PagPagPlaylist'))
    // coletarHistorico(span.innerText, 'Autor')

    const PagPlaylist = document.getElementById('PagPlaylist')
    PagPlaylist.style.display = 'block'
}

//? Vai dar play na playlist ao clicar no btn start
document.getElementById('btnPlayHeaderPagPlaylist').addEventListener('click', () => {
    AbrirTelaTocandoAgora(arrayMusicasPlaylist[0])

    ListaProxMusica = {
        Musicas: arrayMusicasPlaylist,
        Numero: 0,
    }
    
    DarPlayMusica(arrayMusicasPlaylist[0], 0)
})

//? Vai Adicionar a música a fila ao clicar em adiconar a fila
function AddMusicaFila() {
    if(ListaProxMusica.FilaMusicas == undefined) {
        ListaProxMusica.FilaMusicas = {
            Musicas: [],
            NumFila: ListaProxMusica.Numero
        }
    }

    for(let i = 0; i < ListaProxMusica.FilaMusicas.length; i++) {
        if(ListaProxMusica.FilaMusicas[i].ID == musicaSelecionadaBtnDireito.ID) {
            ListaProxMusica.FilaMusicas.Musicas.splice(i, 1)
            ListaProxMusica.FilaMusicas.Musicas.unshift(musicaSelecionadaBtnDireito)
        }
    }
    ListaProxMusica.FilaMusicas.Musicas.push(musicaSelecionadaBtnDireito)
    RetornarMusicasASeguir()
}

//? Vai abrir o menu créditos
function openMenuCreditos() {
    document.querySelector('#containerMenuCreditos').style.display = 'flex'
}

//? Vai fechar o menu créditos
function closeMenuCreditos() {
    document.querySelector('#containerMenuCreditos').style.display = 'none'
}

document.querySelector('#containerMenuCreditos').addEventListener('click', (e) => {
    if(e.target.id == 'containerMenuCreditos') closeMenuCreditos()
})

let pagCarregada = false
function AbrirPerfilArtista(arrayArtista, PegarLista) {
    FecharPaginas()
    const imgPerfilArtista = document.getElementById('imgPerfilArtista')
    try {
        if(arrayArtista.LinkImg.includes ('treefy')) {
            imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
        } else {
            imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
        }
    } catch (error) {
        imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
    }
    imgPerfilArtista.src = arrayArtista.LinkImg
    document.getElementById('NomeArtista').innerText = arrayArtista.Autor
    document.getElementById('containerMusicasArtista').innerHTML = ''
    document.querySelector('body').style.overflow = 'hidden'
    RetornarMusicasArtista(arrayArtista.Autor, document.getElementById('containerMusicasArtista'), PegarLista)

    setTimeout(() => {
        pagCarregada = true
    }, 2000)
    
    if(pagCarregada == true) {
        coletarHistorico(arrayArtista.Autor, 'Autor')
    }

    // updateURLParameter('artist', arrayArtista.ID)
    document.querySelector('#PagArtistas').style.display = 'block'
}

function hideMenu() {
    const manusClickDireito = document.querySelectorAll('.manusClickDireito')
    for(let c = 0; c < manusClickDireito.length; c++) {
        manusClickDireito[c].style.display = 'none'
    }
}

//? Vai tocar a música sem abrir a pág
function Tocar_Artista_Sem_Abrir(Artista) {
    let arrayMusicasArtista2 = []

    for (let a = TodasMusicas.Musicas.length - 1; a >= 0; a--) {
        let ArtistaFormadado = formatarTexto(TodasMusicas.Musicas[a].Autor)
        let AutorFormadato  =  formatarTexto(Artista)

          if(ArtistaFormadado.includes(AutorFormadato) || AutorFormadato.includes(ArtistaFormadado)) {
            arrayMusicasArtista2.push(TodasMusicas.Musicas[a])
        }
      }

      AbrirTelaTocandoAgora(arrayMusicasArtista2[0])

      ListaProxMusica = {
          Musicas: arrayMusicasArtista2,
          Numero: 0,
      }
      
      DarPlayMusica(arrayMusicasArtista2[0], 0)
}