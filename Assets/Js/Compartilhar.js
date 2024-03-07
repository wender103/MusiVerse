let gerenciarPresencaChamada = false
//? Vai pegar a ID na url da pag
function obterValoresDaURL(Comando = 'Tocar Música') {
    // Obtém a URL atual
    var urlAtual = window.location.href

    // Cria um novo objeto URL com a URL atual
    var url = new URL(urlAtual)

    // Obtém os parâmetros de pesquisa da URL
    var parametros = url.searchParams

    // Obtém o valor da chave 'music' da URL
    var music = parametros.get('music')

    // Obtém o valor da chave 'artist', 'playlist', 'profile' ou 'page' da URL
    var artist = parametros.get('artist')
    var playlist = parametros.get('playlist')
    var profile = parametros.get('profile')
    var page = parametros.get('page')

    // Verifica se 'artist', 'playlist', 'profile' ou 'page' está definido na URL
    if (artist !== null) {
        InfosUrl.Page.Name = 'artist'
        InfosUrl.Page.ID = artist
    } else if (playlist !== null) {
        InfosUrl.Page.Name = 'playlist'
        InfosUrl.Page.ID = playlist
    } else if (profile !== null) {
        InfosUrl.Page.Name = 'profile'
        InfosUrl.Page.ID = profile
    } else if (page !== null) {
        if(page == undefined || page == '') {
            InfosUrl.Page.Name = 'Home'
        } else {
            InfosUrl.Page.Name = page
        }
        InfosUrl.Page.ID = undefined
    }

    // Define o valor da chave 'Music'
    InfosUrl.Music = music || ''

    // Verifica o comando e executa a função correspondente
    if (Comando === 'Tocar Música') {
        tocarMusicaDaUrl(InfosUrl.Music, InfosUrl.Page)
    } else if (Comando === 'Abrir Página') {
        AbrirPaginas(InfosUrl.Page)
    } else {
        tocarMusicaDaUrl(InfosUrl.Music, InfosUrl.Page)
        if(InfosUrl.Name != '' && InfosUrl.Page.ID != '') {
            AbrirPaginas(InfosUrl.Page.Name, InfosUrl.Page.ID, true, true)
        }
    }

    // Chamada da função para gerenciar a presença do usuário
    if(!gerenciarPresencaChamada) {
        gerenciarPresencaChamada = true
        gerenciarPresencaUsuario()
        Atualizar_Presenca(true, currentUser.InfoEmail.email, MusicaTocandoAgora.ID);
    }
}
function tocarMusicaDaUrl(ID, Page) {
    let MusicaDaUrl
    let passou = false

    //? Vai dar play na música
    try {
        for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
            if(TodasMusicas.Musicas[c].ID == ID) {
                MusicaDaUrl = TodasMusicas.Musicas[c]

                if(Page.Name == 'artist' && !passou) {
                    passou = true
                    try {
                        AbrirPerfilArtista(MusicaDaUrl)
                    } catch{}

                    for(let b = 0; b < arrayMusicasArtista.length; b++) {

                        if(arrayMusicasArtista[b].ID == ID) {
                            ListaProxMusica = {
                                Musicas: arrayMusicasArtista,
                                Numero: b,
                            }
                            DarPlayMusica(arrayMusicasArtista[b], b, true)
                            AbrirTelaTocandoAgora('OpenViaBtn')
                        }
                    }
                } else {
                    ListaProxMusica = {
                        Musicas: TodasMusicas.Musicas[c],
                        Numero: c,
                    }
                    DarPlayMusica(TodasMusicas.Musicas[c], c, true)
                    AbrirTelaTocandoAgora('OpenViaBtn')
                }
            }
        }
    } catch{}

    if(Page.Name == 'artist' && !passou) {
        passou = true
        for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
            if(TodasMusicas.Musicas[c].ID == Page.ID) {
                try {
                    AbrirPerfilArtista(TodasMusicas.Musicas[c], 'PegarLista')
                    for(let i = 0; i < ListaProxMusica.Musicas.length; i++) {
                        if(ListaProxMusica.Musicas[i].ID == ID) {
                            ListaProxMusica.Numero = i
                        }
                    }
                } catch{}
            }
        }

        //? Arrumar isso
    } else if(Page.Name == 'playlist') {
        try {
            for(let c = 0; c < TodasMusicas.Playlists.length; c++) {
                if(TodasMusicas.Playlists[c].ID == Page.ID) {
                    const arrayMusicasPlaylist = []
                    let numMusicaPlaylist = 0

                    for(let i = TodasMusicas.Playlists[c].Musicas.length - 1; i >= 0; i--) {
                        arrayMusicasPlaylist.push(TodasMusicas.Playlists[c].Musicas[i])

                        if(TodasMusicas.Playlists[c].Musicas[i].ID == ID) {
                            numMusicaPlaylist = i
                        }
                    }

                    ListaProxMusica = {
                        Musicas: arrayMusicasPlaylist,
                        Numero: numMusicaPlaylist,
                    }

                    AbrirPlaylist(TodasMusicas.Playlists[c])
                }
            }
        } catch{}
        
    } else if(Page.Name == 'profile') {
        try {
            for(let c = 0; c < TodosOsUsers.length; c++) {
                if(TodosOsUsers[c].User.Id == Page.ID) {
                    AbrirPerfilOutroUser(TodosOsUsers[c].User)
                }
            }
        } catch{}
    }
}

//? Vai mandar o link da música para a área de tranferencia
const liCompartilharMusica = document.querySelector('#liCompartilharMusica')
liCompartilharMusica.addEventListener('click', () => {
    const urlSemQuery = window.location.origin + window.location.pathname
    const link = `${urlSemQuery}?music=${musicaSelecionadaBtnDireito.ID}`
    navigator.clipboard.writeText(link).then(function() {
        Notificar('Link copiado para a área de transferência!', 'Link Copiado')
    }, function(err) {
        Notificar('Erro ao copiar o link: ')
    })
})

function Notificar(text, notification) {
    const containerNotification = document.querySelector('#containerNotification')
    const msgNotification = document.querySelector('#msgNotification')
    const imgNotification = document.querySelector('#imgNotification')

    msgNotification.innerText = text

    if(notification == 'Link Copiado') {
        imgNotification.src = 'Assets/Imgs/Icons/checkmark.png'
    } else if('Error Link Copiado') {
        imgNotification.src = 'Assets/Imgs/Icons/cross.png'
    }

    containerNotification.classList.add('containerNotificationActive')

    setTimeout(() => {
        containerNotification.classList.remove('containerNotificationActive')
    }, 5000)
}

//? Vai mandar o link do perfil do Artista para área de transferencia
document.querySelector('#bntCompartilharArtista').addEventListener('click', () => {
    salvarNaAreaDeTransferencia('artist', autorSelecionadoBtnDireito.ID)
})

//? Vai mandar o link do perfil do usuario para área de transferencia
document.querySelector('#bntCompartilharUser').addEventListener('click', () => {
    salvarNaAreaDeTransferencia('profile', userSelecionadoBtnDireito.Id)
})

//? Vai mandar o link do Playlist do usuario para área de transferencia
document.querySelector('#bntCompartilharPlaylist').addEventListener('click', () => {
    salvarNaAreaDeTransferencia('playlist', playlistSelecionadaBtnDireito.ID)
})

function salvarNaAreaDeTransferencia(Tipo, Link) {
    const urlSemQuery = window.location.origin + window.location.pathname
    const link = `${urlSemQuery}?${Tipo}=${Link}`
    navigator.clipboard.writeText(link).then(function() {
        Notificar('Link copiado para a área de transferência!', 'Link Copiado')
    }, function(err) {
        Notificar('Erro ao copiar o link: ')
    })
}