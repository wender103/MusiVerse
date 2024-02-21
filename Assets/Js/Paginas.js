const linkPagina = document.getElementsByClassName('linkPagina')
const Paginas = document.getElementsByClassName('Paginas')
const Open = document.getElementsByClassName('Open')
let EventoNasPagsAdd = false


for (let c = 0; c < linkPagina.length; c++) {
    linkPagina[c].addEventListener('click', () => {
        let New_name = removerEspacosEAcentos(linkPagina[c].innerText)
        AbrirPaginas(New_name)
    })
    
}

function FecharPaginas() {
    document.querySelector('body').style.overflow = 'auto'
    // document.getElementById('inputPesquisa').value = ''

    for(let c = 0; c < Paginas.length; c++) {
        try {
            document.getElementsByClassName('Open')[c].classList.remove('Open')
        } catch{}
        
        document.getElementsByClassName('Paginas')[c].style.display = 'none'
    }

    for(let i = 0; i < linkPagina.length; i++) {
        document.getElementsByClassName('linkPagina')[i].style.color = '#fff'
        
        try {
            let img = document.getElementsByClassName('linkPagina')[i].querySelector('img')
            img.src = img.src.replace('Selected.png', '.png')
        } catch{}
    }
}

//? Vai dar um display none para o containerOptionsClickMusic ao scrollar as sections Paginas
const sectionPaginas = document.querySelectorAll('.Paginas')
sectionPaginas.forEach(pagians => {
    pagians.addEventListener('scroll', hideMenu)
})

//? Vai salvar o históco das páginas que foram abertas para o user poder voltar
let historiacoDasPaginas = {
    Paginas: [{Name: 'Home', ID: undefined}],
    PaginaAtual: {Name: 'Home', ID: undefined}
}

const btnBackPag = document.getElementsByClassName('btnBackPag')
const btnNextPag = document.getElementsByClassName('btnNextPag')
function HistoricoPaginasAbertas(PaginaAberta) {
    //? --------------
    const index = historiacoDasPaginas.Paginas.indexOf(PaginaAberta)

    if (index !== -1) {
      // Se o valor já estiver presente, remova-o do array
      historiacoDasPaginas.Paginas.splice(index, 1)
    }

    let valorAntigo = historiacoDasPaginas.Paginas[historiacoDasPaginas.PaginaAtual]
      historiacoDasPaginas.Paginas.splice(historiacoDasPaginas.PaginaAtual, 1)
      historiacoDasPaginas.Paginas.push(valorAntigo)
  
    // Adicione o valor novamente ao final do array
    historiacoDasPaginas.Paginas.push(PaginaAberta)
    historiacoDasPaginas.PaginaAtual =  historiacoDasPaginas.Paginas.length -1
    //? -------------

    remover_class_btnBackPag()
    add_class_btnNextPag()
}

function add_class_btnBackPag() {
    for (let c = 0; c < btnBackPag.length; c++) {
        btnBackPag[c].classList.add('btnBloqueado')
    }
}

function remover_class_btnBackPag() {
    for (let c = 0; c < btnBackPag.length; c++) {
        btnBackPag[c].classList.remove('btnBloqueado')
    }
}

let contador_pag_atual = 1
function VolatarPaginaAnterior(Comando = 'Checar') {
    if(Comando == 'Checar') {
        if(contador_pag_atual < 2) {
            add_class_btnBackPag()
            
        } else if(contador_pag_atual > 1) {
            remover_class_btnBackPag()
        }

    } else {
        if(historiacoDasPaginas.Paginas[contador_pag_atual - 2] == undefined) {
            AbrirPaginas('Home')
            contador_pag_atual = 1

        } else {
            if(contador_pag_atual >= 1) {
                AbrirPaginas(historiacoDasPaginas.Paginas[contador_pag_atual - 2].Name, historiacoDasPaginas.Paginas[contador_pag_atual - 2].ID, false) //? -2 pq ele está com o valor do length, logo -1 ele fica na ultima casa e -2 na penultima
                updateURLParameter(historiacoDasPaginas.Paginas[contador_pag_atual - 2].Name,  historiacoDasPaginas.Paginas[contador_pag_atual - 2].ID)
                contador_pag_atual = contador_pag_atual - 1
            }
        }
        ProxmaPagina()
        VolatarPaginaAnterior()
    }

}

function add_class_btnNextPag() {
    for (let c = 0; c < btnNextPag.length; c++) {
        btnNextPag[c].classList.add('btnBloqueado')
    }
}

function remover_class_btnNextPag() {
    for (let c = 0; c < btnNextPag.length; c++) {
        btnNextPag[c].classList.remove('btnBloqueado')
    }
}

function ProxmaPagina(Comando = 'Checar') {
    if(Comando == 'Checar') {
        if(contador_pag_atual < historiacoDasPaginas.Paginas.length) {
            remover_class_btnNextPag()
            
        } else if(contador_pag_atual >= historiacoDasPaginas.Paginas.length) {
            add_class_btnNextPag()
        }

    } else {
        if(contador_pag_atual < historiacoDasPaginas.Paginas.length) {
            AbrirPaginas(historiacoDasPaginas.Paginas[contador_pag_atual].Name, historiacoDasPaginas.Paginas[contador_pag_atual].ID, false)
            contador_pag_atual = contador_pag_atual + 1
            updateURLParameter(historiacoDasPaginas.Paginas[contador_pag_atual -1].Name,  historiacoDasPaginas.Paginas[contador_pag_atual -1].ID)
        }
        ProxmaPagina()
        VolatarPaginaAnterior()
    }

}

function SalvarHistoricoDePaginas(Name, ID) {
    if(Name != 'Home') {
        historiacoDasPaginas.PaginaAtual = {Name: Name, ID}

        if (contador_pag_atual < historiacoDasPaginas.Paginas.length) {
            // Remove elementos extras do array

            for (let c = contador_pag_atual; c <= historiacoDasPaginas.Paginas.length; c++) {
                historiacoDasPaginas.Paginas.pop()
            }

            const index = historiacoDasPaginas.Paginas.findIndex(item => item.Name === Name)

            if (index !== -1) {
                // Se o valor já existe, remova-o
                historiacoDasPaginas.Paginas.splice(index, 1)
            }

            // Adiciona historiacoDasPaginas.PaginaAtual ao final do array
            historiacoDasPaginas.Paginas.push(historiacoDasPaginas.PaginaAtual)

        } else {
            const index = historiacoDasPaginas.Paginas.findIndex(item => item.Name === Name)

            if (index !== -1) {
                // Se o valor já existe, remova-o
                historiacoDasPaginas.Paginas.splice(index, 1)
            }

            // Adiciona historiacoDasPaginas.PaginaAtual ao final do array
            historiacoDasPaginas.Paginas.push(historiacoDasPaginas.PaginaAtual)
        }
        
        contador_pag_atual = historiacoDasPaginas.Paginas.length
        
        
        VolatarPaginaAnterior()
        ProxmaPagina()
        // AbrirPaginas(historiacoDasPaginas.PaginaAtual)
    }

    updateURLParameter(Name, ID)
}

let RecarregarHomeFeito = false

function AbrirPaginas(Name, ID, Salavar = true, Open_all = false, info_extra = '') {
    if(Salavar) {
        SalvarHistoricoDePaginas(Name, ID)
    }

    FecharPaginas()
    
    if(Name == 'artist') {
        TodasMusicas.Musicas.forEach(music => {
            if(music.ID == ID) {
                AbrirPerfilArtista(music)
            }
        })
    } else if(Name == 'playlist') {
        TodasMusicas.Playlists.forEach(playlists => {
            if(playlists.ID == ID) {
                AbrirPlaylist(playlists)
            }
        })

    } else if(Name == 'profile') {
        if(info_extra == 'Seguir user') {
            for(let c = 0; c < TodosOsUsers.length; c++) {
                if(ID == TodosOsUsers[c].User.Id) {
                    AbrirPerfilOutroUser(TodosOsUsers[c].User)
                    carregarUserArtistasSeguidos()
                }
            }
        } else {
            for(let c = 0; c < TodosOsUsers.length; c++) {
                if(ID == TodosOsUsers[c].User.Id) {
                    AbrirPerfilOutroUser(TodosOsUsers[c].User)
                }
            }
        }

    } else if(Name == 'Home') {
        document.getElementById('inputPesquisa').value = ''
        FecharPaginas()
        VolatarPaginaAnterior()
        ProxmaPagina()

    } else if(!Open_all) {
        FecharPaginas()

        try {
            document.querySelector(`#Pag${Name}`).style.display = 'block'
        } catch{}

    } else if(Open_all) {
        FecharPaginas()

        try {
            document.querySelector(`#Pag${Name}`).style.display = 'block'
        } catch{}

        if(Name == 'Pesquisar') {
            if(info_extra == '') {
                Pesquisar('Historico')

            } else {
                Pesquisar(info_extra)
            }
        
        } else if(Name == 'MeuPerfil') {
            abrirMeuPerfil()
            
        } else if(Name == 'Playlists') {
            
        } else if(Name == 'Favoritas') {
            document.getElementById('localMusicasCurtidas').innerHTML = ''
            RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
            
        } else if(Name == 'Amigos') {
            
            
        }
    }
}

let recarregarPaginaFeito = false
function RecarregarHome() {
    if(!recarregarPaginaFeito) {
        recarregarPaginaFeito = true
        setTimeout(() => {
            recarregarPaginaFeito = false
        }, 1000)

        const containerMain = document.getElementById('containerMain')
        containerMain.innerHTML = ''
        RetornarMusicas('Aleatórias', containerMain)
        carregarHistorico()
    }
}

// * ----------------------
function removerEspacosEAcentos(texto) {
    texto = texto.replace(/\s/g, '')
    const acentos = 'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÕÖØòóôõöøÙÚÛÜùúûüÝýÿÑñÇç'
    const naoAcentuados = 'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOOooooooUUUUuuuuyyNnCc'
    const regExpAcentos = new RegExp(`[${acentos}]`, 'g')
    texto = texto.replace(regExpAcentos, (letra) => naoAcentuados.charAt(acentos.indexOf(letra)))
    return texto
}

//? Vai voltar para o Home do celular
const homeCellPhone = document.getElementById('homeCellPhone')
homeCellPhone.addEventListener('click', () => {
    AbrirPaginas('Home')
})

const BarraMusica = document.getElementById('BarraMusica')
BarraMusica.addEventListener('click', (e) => {
    let el = e.target
    if(window.visualViewport.width <= 628 && el.id != 'ConfigsBarraMusicaCell' && el.id != 'PlayCellBarraMusica' && el.id != 'HeartBarraMusica2' && el.id != 'AutorMusicaBarraMusica') {
        document.querySelector('body').style.overflow = 'hidden'
        document.getElementById('PagMusicaTocandoAgora').classList.add('Open')
    }
})

const fecharPagMusicaTocandoAgora = document.getElementById('fecharPagMusicaTocandoAgora')
fecharPagMusicaTocandoAgora.addEventListener('click', () => {
    if(window.visualViewport.width <= 628) {
        document.getElementById('PagMusicaTocandoAgora').classList.remove('Open')
        document.querySelector('body').style.overflow = 'auto'
    }
})

//? Ao abrir a pág criar playlist
const btnCriarPlaylist = document.getElementById('btnCriarPlaylist')
btnCriarPlaylist.addEventListener('click', () => {
})

const container_popUp_aviso = document.getElementById('container_popUp_aviso')
const container_entar_contato = document.getElementById('container_entar_contato')
const btn_entrar_contato = document.getElementById('btn_entrar_contato')
function Abrir_PopUp_Aviso() {
    container_popUp_aviso.style.display = 'flex'
    btn_entrar_contato.style.display = 'flex'
}

setTimeout(() => {
    // Abrir_PopUp_Aviso()
}, 50000)

function Abrir_Entrar_Contato(btn = false) {
    fechar_popUp_aviso(btn)
    container_entar_contato.style.display = 'flex'
}

function fechar_popUp_aviso(btn) {
    container_popUp_aviso.style.display = 'none'
    if(!btn) {
        btn_entrar_contato.classList.add('sairAnimacao')
    }
}

function fechar_popUp_contato() {
    container_entar_contato.style.display = 'none'
    btn_entrar_contato.classList.add('sairAnimacao')
}

function RetornarUltimasPesquisas(Local) {

    const ultimasPesquisas = currentUser.User.GostoMusical.Historico.UltimasPesquisas
    const section = document.createElement('section')
    const h1 = document.createElement('h1')
    const article = document.createElement('article')

    section.classList.add('containerMusica')
    article.classList.add('containerMusicaCaixa')
    article.id = 'article_ultimas_pesquisas'
    h1.innerText = 'Buscas recentes'

    for(a = ultimasPesquisas.length -1; a >= 0; a--) {
        if(ultimasPesquisas[a].TipoPesquisa == 'music') {
            for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
                if(TodasMusicas.Musicas[c].ID == ultimasPesquisas[a].ID) {
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
                    img.src = TodasMusicas.Musicas[c].LinkImg
                    if(img.src.includes('treefy')) {
                        containerImg.classList.add('ContainerImgMusicaCaixa', 'ContainerImgMusicaCaixaTreeFy')
                        divBlurTexto.className = 'divBlurTextoTreeFy'
                    } else {
                        containerImg.classList.add('ContainerImgMusicaCaixa')
                        divBlurTexto.className = 'divBlurTexto'
                    }
            
                    divTexto.className = 'TextoMusicaCaixa'
                    p.innerText = TodasMusicas.Musicas[c].NomeMusica
                    p.title = TodasMusicas.Musicas[c].NomeMusica
                    span.innerText = TodasMusicas.Musicas[c].Autor
                    span.title = TodasMusicas.Musicas[c].Autor
                    divBlurTexto.innerHTML = `<img src="${TodasMusicas.Musicas[c].LinkImg}">`
            
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
                                Musicas: TodasMusicas.Musicas,
                                Numero: c,
                            }

                            DarPlayMusica(TodasMusicas.Musicas[c], c)
                        }
                    })

                    div.addEventListener('contextmenu', function (e) {
                        e.preventDefault()

                        musicaSelecionadaBtnDireito = TodasMusicas.Musicas[c]
                        const containerOptionsClickMusic = document.getElementById('containerOptionsClickMusic')
                        const containerOptionsClickArtista = document.getElementById('containerOptionsClickArtista')
                        autorSelecionadoBtnDireito = TodasMusicas.Musicas[c]

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
                        FavoritarDesfavoritarMusica(TodasMusicas.Musicas[c].ID, 'Checar').then((resolve) => {
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
                            AbrirPaginas('artist', TodasMusicas.Musicas[c].ID)
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
                                        AbrirPaginas('artist', TodosOsUsers[con].User)
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
            
                    span.addEventListener('click', () => {
                        AbrirPaginas('artist', TodasMusicas.Musicas[c].ID)
                    })
                }
            }
            
        } else if(ultimasPesquisas[a].TipoPesquisa == 'artist') {
            for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
                if(TodasMusicas.Musicas[c].ID == ultimasPesquisas[a].ID) {
                    const div = document.createElement('div')
                    const containerImg = document.createElement('div')
                    const img = document.createElement('img')
                    const divTexto = document.createElement('div')
                    const darPlay = document.createElement('div')
                    const p = document.createElement('p')
                    const span = document.createElement('span')
                    const divBlurTexto = document.createElement('div')

                    article.className = 'containerMusicaCaixa'
                    div.classList.add('MusicasCaixa', 'ArtistaHistorico')
                    div.title = TodasMusicas.Musicas[c].NomeMusica

                    darPlay.className = 'BtnDarPlay'
                    darPlay.style.backgroundImage = `url(./Assets/Imgs/Icons/DarPlay.png)`

                    img.src = TodasMusicas.Musicas[c].LinkImg
                    if(img.src.includes('treefy')) {
                    containerImg.classList.add('ContainerImgMusicaCaixa', 'ContainerImgArtistaHistoricoTreeFy')
                    } else {
                    containerImg.classList.add('ContainerImgMusicaCaixa')
                    }

                    divTexto.className = 'TextoMusicaCaixa'
                    p.innerText = TodasMusicas.Musicas[c].Autor
                    span.innerText = 'Artista'
                    divBlurTexto.className = 'divBlurTexto2'
                    divBlurTexto.innerHTML = `<img src="${TodasMusicas.Musicas[c].LinkImg}">`

                    divTexto.appendChild(p)
                    divTexto.appendChild(span)

                    const corAleatoria = `#${((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0')}`
                    // let corSVG = corAleatoria
                    let corSVG = 'rgba(0, 255, 255, 0.726)'
                    containerImg.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="194" height="71" viewBox="0 0 194 71" fill="none" class="svgTop">
                        <path d="M0 0H194C194 0 179.737 13.3146 165.471 18.9076C126.202 34.3024 77.7427 8.48913 42.7941 8.48913C0.738899 8.48913 0 71 0 71V0Z" fill="${corSVG}"/>
                    </svg>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="255" height="24" viewBox="0 0 255 24" fill="none" class="svgBottom">
                        <path d="M0 0.499948C0 0.499948 16.1348 0.345708 27 0.499946C74.7217 1.17738 102.147 8.89486 149.5 12.548C190.645 15.7221 247.392 -12.2381 254.443 12.548C255.697 16.9552 254.443 24 254.443 24H0V0.499948Z" fill="${corSVG}"/>
                    </svg>`

                    div.appendChild(darPlay)
                    containerImg.appendChild(img)
                    div.appendChild(containerImg)
                    div.appendChild(divBlurTexto)
                    div.appendChild(divTexto)
                    article.appendChild(div)

                    //? Ao clicar no nome do Autor
                    div.addEventListener('click', () => {
                        AbrirPaginas('artist', TodasMusicas.Musicas[c].ID)
                    })
                }
            }

        } else if(ultimasPesquisas[a].TipoPesquisa == 'playlist') {
            for(let c = 0; c < TodasMusicas.Playlists.length; c++) {
                if(TodasMusicas.Playlists[c].ID == ultimasPesquisas[a].ID) {
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
                }
            }

        } else if(ultimasPesquisas[a].TipoPesquisa == 'profile') {

        }
    }

    const articleContainer = document.createElement('article')
    articleContainer.classList.add('articleContainer')
    section.appendChild(h1)
    articleContainer.appendChild(article)
    section.appendChild(articleContainer)
    Local.appendChild(section)
}

const musicasPorGeneroPesquisa = {}
let todosGenerosSeparadosPesquisa = []
let generosUnicosPesquisa = []

//? Retornar generos ------------------------------
function RetornarGeneros(Local) {
    const section = document.createElement('section')
    const h1_titulo = document.createElement('h1')
    const article2 = document.createElement('article')
    const article = document.createElement('article')

    section.classList.add('containerPlaylistsCaixa')
    article2.classList.add('articleContainer')
    article.id = 'article_genero'
    h1_titulo.id = 'h1_genero'
    h1_titulo.innerText = 'Navegue por todas as seções'

    TodasMusicas.Musicas.forEach(Musica => {
        const generosSeparados = Musica.Genero.split(',')

        generosSeparados.forEach(genero => {
            todosGenerosSeparadosPesquisa.push(genero)
            const generoFormatado = formatarTexto(genero.trim())

            if (!generosUnicosPesquisa.includes(generoFormatado)) {
            generosUnicosPesquisa.push(generoFormatado)
            musicasPorGeneroPesquisa[generoFormatado] = []
            }

            musicasPorGeneroPesquisa[generoFormatado].push(Musica)
        })
    })

    // Também é possível iterar sobre os gêneros e fazer o que for necessário
    let generoEncontrado = false
    generosUnicosPesquisa = embaralharArray(generosUnicosPesquisa) //? Vai embaralhar o array
    generosUnicosPesquisa = embaralharArray(generosUnicosPesquisa) //? Vai embaralhar o array
    generosUnicosPesquisa = embaralharArray(generosUnicosPesquisa) //? Vai embaralhar o array

    generosUnicosPesquisa.forEach(genero => {
        generoEncontrado = false

        const randomNumber = Math.floor(Math.random() *  musicasPorGeneroPesquisa[genero].length)
        todosGenerosSeparadosPesquisa.forEach(generosSeparados => {
            if(formatarTexto(generosSeparados) == genero && !generoEncontrado) {
                generoEncontrado = true

                const container_genero = document.createElement('div')
                const conatiner_img = document.createElement('div')
                const img = document.createElement('img')
                const p = document.createElement('p')
            
                container_genero.style.backgroundColor = gerarCorAleatoria()
                img.src = musicasPorGeneroPesquisa[genero][randomNumber].LinkImg
                p.innerText = generosSeparados
                
                if(musicasPorGeneroPesquisa[genero][randomNumber].LinkImg.includes('treefy')) {
                    img.className = 'treefy_img_genero'
                }
                conatiner_img.className = 'conatiner_img_genero'
                container_genero.className = 'container_genero'
            
                conatiner_img.appendChild(img)
                container_genero.appendChild(conatiner_img)
                container_genero.appendChild(p)
                article.appendChild(container_genero)

                container_genero.addEventListener('click', () => {
                    inputPesquisa.value = generosSeparados
                    Checar_pesquisar()
                    rolarAteOTopoDoElemento(document.querySelector('#PagPesquisar'))
                })
            }
        })
    })

    section.appendChild(h1_titulo)
    article2.appendChild(article)
    section.appendChild(article2)
    Local.appendChild(section)
}