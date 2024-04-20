const inputLinkYT = document.getElementById('inputLinkYT')
const input_salvar_clip = document.getElementById('input_salvar_clip')
let salvar_clip_video = false

//* Vai mudar o estado do btn salvar clip da música
input_salvar_clip.addEventListener('click', () => {
    if (salvar_clip_video) {
        salvar_clip_video = false

    } else {
        salvar_clip_video = true
    }
})

function abrirAviso(OqFazer) {
    if(OqFazer == 'Abrir') {
        if(inputLinkYT.value.trim() != '') {
            document.getElementById('AletarPostarMusicaViaLinck').style.display = 'flex'
        }
    } else {
        document.getElementById('AletarPostarMusicaViaLinck').style.display = 'none'
    }
}

//? --------------------------

let DadosNovaMusica
async function prosseguirMusicaYT() {
    abrirAviso('Fechar')
    const inputLinkYT = document.getElementById('inputLinkYT')
    const containerInputLinkMusicaYT = document.getElementById('containerInputLinkMusicaYT')
    const carregando = document.getElementById('carregando')
    const input_salvar_clip = document.getElementById('input_salvar_clip')
    carregando.style.display = 'flex'

    if (!inputLinkYT.value) {
        inputLinkYT.className = 'inputAnimation'
        containerInputLinkMusicaYT.className = 'inputAnimation2'

        setTimeout(() => {
            inputLinkYT.classList.remove('inputAnimation')
            containerInputLinkMusicaYT.classList.remove('inputAnimation2')
        }, 1000)

    } else {
        //? Vai baixar música via link do yt -------------------

        try {
            const videoURL = inputLinkYT.value // URL do vídeo
            // const response = await fetch('https://apibaixarmusicayt.onrender.com', {
            const response = await fetch('http://localhost:3000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify({ 
                        videoURL: videoURL,
                        userEmail: currentUser.User.Email,
                        baixarVideo: salvar_clip_video,
                })
            })

            if (response.ok) {
                const data = await response.json()
            
                // Vai mostrar a página de editar as informações da música
                document.getElementById('FinalizarAddYT').style.display = 'block'
                document.getElementById('PrimeirosPassosYT').style.display = 'none'
                carregando.style.display = 'none'
              
                // Vai pegar os inputs e a img para colocar as infos da música para o usuário poder editá-las
                const ImgMusicaLinkYT = document.getElementById('ImgMusicaLinkYT')
                const inputNomeMusicaLinkYT = document.getElementById('inputNomeMusicaLinkYT')
                const inputAutorMusicaLinkYT = document.getElementById('inputAutorMusicaLinkYT')
                const inputGeneroMusicaLinkYT = document.getElementById('inputGeneroMusicaLinkYT')
              
                // Função para carregar a imagem
                function carregarImagem() {
                  setTimeout(() => {
                    if (data.thumbnailUrl) {
                      ImgMusicaLinkYT.src = data.thumbnailUrl
                    } else {
                      // Tente novamente após 1 segundo
                      carregarImagem()
                    }
                  }, 1000)
                }
              
                // Iniciar a tentativa de carregar a imagem
                carregarImagem()

                setTimeout(() => {
                    carregarImagem()
                }, 500)
              
                inputNomeMusicaLinkYT.value = data.videoTitle
                inputAutorMusicaLinkYT.value = data.channelName.replace('- Topic', '')
              
                // Vai postar a nova música na parte "MusicasPostadas" do Firebase

                const novaMusica = {
                    Autor: data.channelName,
                    EmailUser: currentUser.User.Email,
                    Genero: "",
                    Letra: [],
                    LinkAudio: data.audioUrl,
                    LinkImg: data.thumbnailUrl,
                    NomeMusica: data.videoTitle,
                    Clip: data.clip,
                    VideoURL: data.videoURL,
                    ID: data.uid,
                    Estado: 'Pendente'
                }

                TodasMusicas.Musicas.push(novaMusica)
                DadosNovaMusica = novaMusica

              } else {
                console.warn("Erro na requisição: ")
                console.warn(response)
                alert('Erro: ' + response.statusText)
                document.getElementById('carregando').style.display = 'none'
              }
              
        } catch (error) {
            console.warn("Erro na requisição: ")
            console.warn(response)
            document.getElementById('carregando').style.display = 'none'
            alert('Erro: ' + error.status )
        }
    }
}

//? Vai checar se a música está pronta para ser postada ou n
let PodeFinalizarPostarMusicaYT = false //! vai informar se pode finalizar a postagem da música
function AtualizarFinalizar() {
    const inputNomeMusicaLinkYT = document.getElementById('inputNomeMusicaLinkYT')
    const inputAutorMusicaLinkYT = document.getElementById('inputAutorMusicaLinkYT')
    const inputGeneroMusicaLinkYT = document.getElementById('inputGeneroMusicaLinkYT')

    const btnFinalizar = document.getElementById('btnFinalizarMusicaYT')

    //? Caso esteja pronto
    if(inputNomeMusicaLinkYT.value && inputAutorMusicaLinkYT.value && inputGeneroMusicaLinkYT.value) {
        PodeFinalizarPostarMusicaYT = true
        btnFinalizar.style.background = 'rgb(0, 255, 209)'

    } else {
        PodeFinalizarPostarMusicaYT = false
        btnFinalizar.style.background = 'rgba(102, 102, 102, 0.13)'
    }
}

function FinalizarPostarMusicaYT() {
    if(PodeFinalizarPostarMusicaYT) {
        let feito = false
        let musicaPostadaComSucesso = false
        const inputNomeMusicaLinkYT = document.getElementById('inputNomeMusicaLinkYT')
        const inputAutorMusicaLinkYT = document.getElementById('inputAutorMusicaLinkYT')
        const inputGeneroMusicaLinkYT = document.getElementById('inputGeneroMusicaLinkYT')

        NovaMusica = {
            Autor: inputAutorMusicaLinkYT.value,
            EmailUser: currentUser.User.Email,
            Genero: inputGeneroMusicaLinkYT.value,
            Letra: [],
            LinkAudio: DadosNovaMusica.LinkAudio,
            LinkImg: DadosNovaMusica.LinkImg,
            NomeMusica: inputNomeMusicaLinkYT.value,
            VideoURL: DadosNovaMusica.VideoURL,
            Clip: DadosNovaMusica.Clip,
            ID: DadosNovaMusica.ID,
            Estado: 'Ativo'
        }

        //? Vai atualizar as informações da música
        db.collection('InfoMusicas').limit(1).get().then((snapshot) => {
            snapshot.docs.forEach(Musicas => {
                if(feito == false) {
                    feito = true

                    const InfoMusicasObj = Musicas.data().Musicas

                    for (let c = 0; c < InfoMusicasObj.length; c++) {
                        if(InfoMusicasObj[c].ID == NovaMusica.ID) {
                            InfoMusicasObj[c] = NovaMusica

                            db.collection('InfoMusicas').doc(Musicas.id).update({Musicas: InfoMusicasObj}).then(() => {
                                //? Vai fechar a aba postar músicas
                                document.getElementById('FinalizarAddYT').style.display = 'none'
                                document.getElementById('PrimeirosPassosYT').style.display = 'block'
                                document.getElementById('ImgMusicaLinkYT').src = 'Assets/Imgs/Banners/c36fff19b54c90efecc303b86bb9f71a.jpg'
                                FecharPaginas()
                                limparInputAddMusics()
    
                                //? Vai adicionar a música postada no array todas as músicas
                                TodasMusicas.Musicas = InfoMusicasObj
    
                                alert('Música postada com sucesso!')
                            })
                        }
                    }

                }
            })
        })
    }
}

//? Vai limpar todos os inputs 
function limparInputAddMusics() {
    const inputAddMusic = document.getElementsByClassName('inputAddMusic')

    for(let i = 0; i < inputAddMusic.length; i++) {
        inputAddMusic[i].value = ''
    }
}

//* Vai checar se o user tem alguma música pendente
function Checar_Música_Pendente() {
    for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
        if(TodasMusicas.Musicas[c].EmailUser == currentUser.User.Email && TodasMusicas.Musicas[c].Estado == 'Pendente' && TodasMusicas.Musicas[c].Genero == '') {
            AbrirPaginas('AdicionarMusica')
            // Vai mostrar a página de editar as informações da música
            document.getElementById('FinalizarAddYT').style.display = 'block'
            document.getElementById('PrimeirosPassosYT').style.display = 'none'
            carregando.style.display = 'none'
            
            // Vai pegar os inputs e a img para colocar as infos da música para o usuário poder editá-las
            const ImgMusicaLinkYT = document.getElementById('ImgMusicaLinkYT')
            const inputNomeMusicaLinkYT = document.getElementById('inputNomeMusicaLinkYT')
            const inputAutorMusicaLinkYT = document.getElementById('inputAutorMusicaLinkYT')
            const inputGeneroMusicaLinkYT = document.getElementById('inputGeneroMusicaLinkYT')
            
            ImgMusicaLinkYT.src = TodasMusicas.Musicas[c].LinkImg
            inputNomeMusicaLinkYT.value = TodasMusicas.Musicas[c].NomeMusica
            inputAutorMusicaLinkYT.value = TodasMusicas.Musicas[c].Autor.replace('- Topic', '')

            DadosNovaMusica = TodasMusicas.Musicas[c]
        }
    }
}