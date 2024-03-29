const container_escolher_img_playlist = document.getElementById('container_escolher_img_playlist')
const containerImgPlaylist = document.getElementById('containerImgPlaylist')

//* Inputs
const input_link_thumb = document.getElementById('input_link_thumb')
const nomePlaylistCriarPlaylist = document.getElementById('nomePlaylistCriarPlaylist')
const descPlaylistCriarPlaylist = document.getElementById('descPlaylistCriarPlaylist')

container_escolher_img_playlist.addEventListener('click', (e) => {
    Abrir_Escolher_Thumb_Playlist(e.target)
})

let Abrir_Add_thumb = false
let usando_thumb_personalizada = false
function Abrir_Escolher_Thumb_Playlist(e) {
    if(!Abrir_Add_thumb) {
        Abrir_Add_thumb = true

        setTimeout(() => {
            Abrir_Add_thumb = false
        }, 100)

        try {
            if(e.id == 'container_escolher_img_playlist' || e.id == 'containerImgPlaylist' || e.id == 'btn_cancel_add_thumb' || e.id == 'btn_adicionar_thumb') {
    
                if(container_escolher_img_playlist.style.display == 'flex') {
                    if(e.id == 'btn_cancel_add_thumb') {
                        input_link_thumb.value = ''
                        Adicionar_Thumb_Playlist()
                    }
                    
                    container_escolher_img_playlist.style.display = 'none'
                    Adicionar_Thumb_Playlist()
            
                } else {
                    container_escolher_img_playlist.style.display = 'flex'
                }
            }
        } catch{}
    }
}

let aviso_thumb = false
function Adicionar_Thumb_Playlist() {
    if(input_link_thumb.value.trim() != '') {
        const imgCriarPlaylist = document.getElementById('imgCriarPlaylist')
        
        carregarImagem(input_link_thumb.value, function(imgPerfil) {
            if (imgPerfil) {
                imgCriarPlaylist.classList.remove('Thumb_Playlist_MusiVerse')
                imgCriarPlaylist.classList.remove('Thumb_Playlist_TreeFy')
                imgCriarPlaylist.classList.add('PlaylistTemImg')
                imgCriarPlaylist.src = input_link_thumb.value
                usando_thumb_personalizada = true
            } else {
                imgCriarPlaylist.classList.remove('Thumb_Playlist_MusiVerse')
                imgCriarPlaylist.classList.remove('Thumb_Playlist_TreeFy')
                imgCriarPlaylist.classList.remove('PlaylistTemImg')
                imgCriarPlaylist.src = 'Assets/Imgs/Icons/Faixas200.png'
                usando_thumb_personalizada = false
                input_link_thumb.value = ''
                Adicionar_Thumb_Playlist()
                
                if(!aviso_thumb) {
                    aviso_thumb = true
                    setTimeout(() => {
                        aviso_thumb = false
                    }, 100)
                    
                    alert('Não conseguimos acessar a thumb da playlist')
                }
            }
        })

        
    } else {
        if(arrayMusicasNovaPlaylist.length > 0 && !usando_thumb_personalizada) {
            for(let b = 0; b < TodasMusicas.Musicas.length; b++) {
                if(arrayMusicasNovaPlaylist[0] == TodasMusicas.Musicas[b].ID) {
                    if(TodasMusicas.Musicas[b].LinkImg.includes('musiverse')) {
                        imgCriarPlaylist.classList.add('Thumb_Playlist_MusiVerse')

                    } else if(TodasMusicas.Musicas[b].LinkImg.includes('treefy')) {
                        imgCriarPlaylist.classList.add('Thumb_Playlist_TreeFy')
                    }

                    imgCriarPlaylist.src = TodasMusicas.Musicas[b].LinkImg
                }
            }

        } else {
            imgCriarPlaylist.classList.remove('Thumb_Playlist_MusiVerse')
            imgCriarPlaylist.classList.remove('Thumb_Playlist_TreeFy')
            imgCriarPlaylist.classList.remove('PlaylistTemImg')
            imgCriarPlaylist.src = 'Assets/Imgs/Icons/Faixas200.png'
            usando_thumb_personalizada = false
        }

    }
}

let arrayMusicasNovaPlaylist = []
function PesquisarMusicaCriarPlaylist() {
    const pesquisarMuiscaCriarPlaylist = document.getElementById('pesquisarMuiscaCriarPlaylist')
    const PesquisaFormatada = formatarTexto(pesquisarMuiscaCriarPlaylist.value)
    const Local = document.getElementById('containerMusicasPesquisadasCriarPlaylist')
    Local.innerHTML = ''
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let contadorMusicas = 0
    let musica_encontrada = false

    if(pesquisarMuiscaCriarPlaylist.value.trim() != '') {
        Local.style.display = 'block'
        document.getElementById('btnPesquisaMusicaPlaylist').src = 'Assets/Imgs/Icons/x.png'
        document.getElementById('btnPesquisaMusicaPlaylist').style.width = '17px'
        document.getElementById('btnPesquisaMusicaPlaylist').style.height = '17px'

        for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
            const NomeMusica = formatarTexto(TodasMusicas.Musicas[c].NomeMusica)
            const Autor = formatarTexto(TodasMusicas.Musicas[c].Autor)
            const Genero = formatarTexto(TodasMusicas.Musicas[c].Genero)
    
            if(contadorMusicas < 12 && TodasMusicas.Musicas[c].Estado == 'Ativo') {
                if (PesquisaFormatada.includes(NomeMusica) || PesquisaFormatada.includes(Autor) || PesquisaFormatada.includes(Genero) || NomeMusica.includes(PesquisaFormatada) || Autor.includes(PesquisaFormatada) || Genero.includes(PesquisaFormatada)
                ) {
                    musica_encontrada = true
                    contadorMusicas++
                    article.className = 'containerMusicaLinha'
        
                    const div = document.createElement('div')
                    const divPrimeiraParte = document.createElement('div')
                    const divImg = document.createElement('div')
                    const img = document.createElement('img')
                    const divTexto = document.createElement('div')
                    const Nome = document.createElement('p')
                    const AutorDaMusica = document.createElement('span')
                    const Genero = document.createElement('p')
                    const btnAdicionar = document.createElement('button')
        
                    div.className = 'MusicasLinha'
                    divTexto.className = 'TextoMusicaCaixa'
                    btnAdicionar.className = 'btnAdicionar'
                    divImg.className = 'DivImgMusicaMeuPerfil'
                    img.className = 'ImgMusicaMeuPerfil'
                    Genero.className = 'GeneroMeuPerfil'
                    img.src = TodasMusicas.Musicas[c].LinkImg
                    Nome.innerText = TodasMusicas.Musicas[c].NomeMusica
                    AutorDaMusica.innerText = TodasMusicas.Musicas[c].Autor
                    Genero.innerText = TodasMusicas.Musicas[c].Genero
                    btnAdicionar.innerText = 'Adicionar'
                    
                    divTexto.appendChild(Nome)
                    divTexto.appendChild(AutorDaMusica)
                    divImg.appendChild(img)
                    divPrimeiraParte.appendChild(divImg)
                    divPrimeiraParte.appendChild(divTexto)
                    div.appendChild(divPrimeiraParte)
                    div.appendChild(Genero)
                    div.appendChild(btnAdicionar)
                    article.appendChild(div)
        
                    div.addEventListener('click', (event) => {
                        if (event.target != AutorDaMusica && event.target != btnAdicionar) {
                            ListaProxMusica = {
                                Musicas: TodasMusicas.Musicas[c],
                                Numero: c,
                            }
        
                            DarPlayMusica(TodasMusicas.Musicas[c], c)
                        }
                    })
        
                    //? Vai adicionar a música na playlist
                    let clicouAdd = false
                    const btnPostarPlaylist = document.getElementById('btnPostarPlaylist')
                    btnAdicionar.addEventListener('click', () => {
                        const imgCriarPlaylist = document.getElementById('imgCriarPlaylist')
    
                        if(clicouAdd == false) {
                            arrayMusicasNovaPlaylist.push(TodasMusicas.Musicas[c].ID)
                            // Local.style.display = 'none'
                            clicouAdd = true
                            articleContainerMusicasAdded.appendChild(div)
                            btnAdicionar.innerText = 'Remover'
                        } else {
                            for(let b = 0; b < arrayMusicasNovaPlaylist.length; b++) {
                                if(arrayMusicasNovaPlaylist[b] == TodasMusicas.Musicas[c].ID) {
                                    arrayMusicasNovaPlaylist.splice(b, 1)
                                }
                            }
    
                            clicouAdd = false
                            articleContainerMusicasAdded.removeChild(div)
                        }
    
                        //? Vai mudar a foto da playlist
                        if(arrayMusicasNovaPlaylist.length > 0 && !usando_thumb_personalizada) {
                            for(let b = 0; b < TodasMusicas.Musicas.length; b++) {
                                if(arrayMusicasNovaPlaylist[0] == TodasMusicas.Musicas[b].ID) {
                                    if(TodasMusicas.Musicas[b].LinkImg.includes('musiverse')) {
                                        imgCriarPlaylist.classList.add('Thumb_Playlist_MusiVerse')
                
                                    } else if(TodasMusicas.Musicas[b].LinkImg.includes('treefy')) {
                                        imgCriarPlaylist.classList.add('Thumb_Playlist_TreeFy')
                                    }

                                    imgCriarPlaylist.src = TodasMusicas.Musicas[b].LinkImg
                                    btnPostarPlaylist.style.display = 'flex'
                                }
                            }
    
                        } else if(!usando_thumb_personalizada) {
                            imgCriarPlaylist.classList.remove('Thumb_Playlist_MusiVerse')
                            imgCriarPlaylist.classList.remove('Thumb_Playlist_TreeFy')
                            imgCriarPlaylist.classList.remove('PlaylistTemImg')
                            imgCriarPlaylist.src = 'Assets/Imgs/Icons/Faixas200.png'
                            btnPostarPlaylist.style.display = 'none'
                        }
                    })
                }
            }
        }

        if(!musica_encontrada) {
            Local.innerHTML = `
            <div id="container_n_encontrado">
                <h1 id="h1_nehum_resultado_encontrado">Nehum resultado encontrado para: "${pesquisarMuiscaCriarPlaylist.value}"</h1>
                <span id="span_infos_n_encontrado">Tente escrevendo o termo da busca de outra forma ou usando outra palavra-chave</span>
            </div>
            `
        }
    
        const section = document.createElement('section')
        const articleContainer = document.createElement('article')
        articleContainer.className = 'articleContainer'
    
        //? Vai adicionar o article no html apenas se houver algunma música
        if(article.innerHTML != '') {
            section.className = 'containerMusica'
            section.appendChild(articleContainer)
            articleContainer.appendChild(article)
            Local.appendChild(section)
        }
    } else {
        Local.style.display = 'none'
        document.getElementById('btnPesquisaMusicaPlaylist').src = 'Assets/Imgs/Icons/search.png'
        document.getElementById('btnPesquisaMusicaPlaylist').style.width = '20px'
        document.getElementById('btnPesquisaMusicaPlaylist').style.height = '20px'
    }

    document.getElementById('btnPesquisaMusicaPlaylist').addEventListener('click', () => {
        pesquisarMuiscaCriarPlaylist.value = ''
        PesquisarMusicaCriarPlaylist()
    })
}

//* Postar Playlist
let playlist_editando = {}
function Postar_Playlist() {
    let feito = false
    let nome_playlist = nomePlaylistCriarPlaylist.value
    let desc_playlist = descPlaylistCriarPlaylist.value

    if(desc_playlist.trim() == '') {
        desc_playlist.value = null
    }

    if(arrayMusicasNovaPlaylist.length > 0 && nome_playlist.trim() != '') {
        let new_playlist = {}

        if(!Editando_Playlist) {
            new_playlist = {
                Estado: 'Pública',
                ID: IDsUncios(),
                Thumb: document.getElementById('imgCriarPlaylist').src,
                EmailUser: currentUser.User.Email,
                Musicas: arrayMusicasNovaPlaylist,
                Nome: nome_playlist,
                Descricao: desc_playlist,
                Colaboradores: [],
            }
        } else {
            new_playlist = {
                Estado: playlist_editando.Estado,
                ID: playlist_editando.ID,
                Thumb: document.getElementById('imgCriarPlaylist').src,
                EmailUser: playlist_editando.EmailUser,
                Musicas: arrayMusicasNovaPlaylist,
                Nome: nome_playlist,
                Descricao: desc_playlist,
                Colaboradores: playlist_editando.Colaboradores,
            }
        }

        db.collection('InfoMusicas').limit(1).get().then((snapshot) => {
            snapshot.docs.forEach(TodasAsMusicas => {
                if(feito == false) {
                    feito = true

                    const InfoPlaylystsObj = TodasAsMusicas.data()
                    let msg = Editando_Playlist ? 'Playlist atualizada com sucesso!' : 'Playlist postada com sucesso!'
                    if(Editando_Playlist) {
                        for (let c = 0; c <  InfoPlaylystsObj.Playlists.length; c++) {
                            if(InfoPlaylystsObj.Playlists[c].ID == new_playlist.ID) {
                                InfoPlaylystsObj.Playlists[c] = new_playlist                     
                            }
                        }

                    } else {
                        InfoPlaylystsObj.Playlists.push(new_playlist)
                    }

                    db.collection('InfoMusicas').doc(TodasAsMusicas.id).update({Playlists: InfoPlaylystsObj.Playlists}).then(() => {
                        alert(msg)
                        TodasMusicas.Playlists = InfoPlaylystsObj.Playlists
                        Cancelar_Playlist()
                    })
                }
            })
        })

    } else {
        alert('Termine de configurar a playlist antes de tentar postar.')
    }
}

//? Vai preparar para editar a playlist
function EditarPlaylist(Playlist, MusicasPlaylist) {
    arrayMusicasNovaPlaylist = []
    if(Playlist.Thumb) {
        input_link_thumb.value = Playlist.Thumb
        Adicionar_Thumb_Playlist()
    }

    nomePlaylistCriarPlaylist.value = Playlist.Nome
    descPlaylistCriarPlaylist.value = Playlist.Descricao

    for (let c = 0; c < MusicasPlaylist.length; c++) {
        arrayMusicasNovaPlaylist.push(MusicasPlaylist[c].ID)
    }

    playlist_editando = Playlist
    Criar_Musicas_Editar(MusicasPlaylist)

    AbrirPaginas('CriarPlaylist')
}

function Criar_Musicas_Editar(Musicas) {
    const Local = document.getElementById('articleContainerMusicasAdded')
    Local.innerHTML = ''
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let contadorMusicas = 0
    let musica_encontrada = false
    Local.style.display = 'block'
    document.getElementById('btnPesquisaMusicaPlaylist').src = 'Assets/Imgs/Icons/search.png'
    document.getElementById('btnPesquisaMusicaPlaylist').style.width = '20px'
    document.getElementById('btnPesquisaMusicaPlaylist').style.height = '20px'

    for(let c =  0; c < Musicas.length; c++) {
        musica_encontrada = true
        contadorMusicas++
        article.className = 'containerMusicaLinha'

        const div = document.createElement('div')
        const divPrimeiraParte = document.createElement('div')
        const divImg = document.createElement('div')
        const img = document.createElement('img')
        const divTexto = document.createElement('div')
        const Nome = document.createElement('p')
        const AutorDaMusica = document.createElement('span')
        const Genero = document.createElement('p')
        const btnRemover = document.createElement('button')

        div.className = 'MusicasLinha'
        divTexto.className = 'TextoMusicaCaixa'
        btnRemover.className = 'btnAdicionar'
        divImg.className = 'DivImgMusicaMeuPerfil'
        img.className = 'ImgMusicaMeuPerfil'
        Genero.className = 'GeneroMeuPerfil'
        img.src = Musicas[c].LinkImg
        Nome.innerText = Musicas[c].NomeMusica
        AutorDaMusica.innerText = Musicas[c].Autor
        Genero.innerText = Musicas[c].Genero
        btnRemover.innerText = 'Remover'
        
        divTexto.appendChild(Nome)
        divTexto.appendChild(AutorDaMusica)
        divImg.appendChild(img)
        divPrimeiraParte.appendChild(divImg)
        divPrimeiraParte.appendChild(divTexto)
        div.appendChild(divPrimeiraParte)
        div.appendChild(Genero)
        div.appendChild(btnRemover)
        article.appendChild(div)

        div.addEventListener('click', (event) => {
            if (event.target != AutorDaMusica && event.target != btnRemover) {
                ListaProxMusica = {
                    Musicas: Musicas[c],
                    Numero: c,
                }

                DarPlayMusica(Musicas[c], c)
            }
        })

        //? Vai adicionar a música na playlist
        const btnPostarPlaylist = document.getElementById('btnPostarPlaylist')
        btnRemover.addEventListener('click', () => {
            for(let a = 0; a < arrayMusicasNovaPlaylist.length; a++) {
                if(arrayMusicasNovaPlaylist[a] == Musicas[c].ID) {
                    arrayMusicasNovaPlaylist.splice(a, 1)
                    article.removeChild(div)
                }
            }
        })
    }

    if(!musica_encontrada) {
        Local.innerHTML = `
        <div id="container_n_encontrado">
            <h1 id="h1_nehum_resultado_encontrado">Nehum resultado encontrado para: "${pesquisarMuiscaCriarPlaylist.value}"</h1>
            <span id="span_infos_n_encontrado">Tente escrevendo o termo da busca de outra forma ou usando outra palavra-chave</span>
        </div>
        `
    }

    const section = document.createElement('section')
    const articleContainer = document.createElement('article')
    articleContainer.className = 'articleContainer'

    //? Vai adicionar o article no html apenas se houver algunma música
    if(article.innerHTML != '') {
        section.className = 'containerMusica'
        section.appendChild(articleContainer)
        articleContainer.appendChild(article)
        Local.appendChild(section)
    }
}

function Cancelar_Playlist() {
    arrayMusicasNovaPlaylist = []
    nomePlaylistCriarPlaylist.value = ''
    descPlaylistCriarPlaylist.value = ''
    document.getElementById('containerMusicasPesquisadasCriarPlaylist').innerHTML = ''
    document.getElementById('containerMusicasAddCriarPlaylist').querySelector('section').querySelector('article').querySelector('article').innerHTML = ''
    document.getElementById('pesquisarMuiscaCriarPlaylist').value = ''
    const imgCriarPlaylist = document.getElementById('imgCriarPlaylist')
    imgCriarPlaylist.classList.remove('Thumb_Playlist_MusiVerse')
    imgCriarPlaylist.classList.remove('Thumb_Playlist_TreeFy')
    imgCriarPlaylist.classList.remove('PlaylistTemImg')
    imgCriarPlaylist.src = 'Assets/Imgs/Icons/Faixas200.png'
    document.getElementById('containerMusicasPesquisadasCriarPlaylist').style.display = 'none'
    document.getElementById('btnPesquisaMusicaPlaylist').src = 'Assets/Imgs/Icons/search.png'
    document.getElementById('btnPesquisaMusicaPlaylist').style.width = '20px'
    document.getElementById('btnPesquisaMusicaPlaylist').style.height = '20px'
    Editando_Playlist = false
}