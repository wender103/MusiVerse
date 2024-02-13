const PagEditarLetraMusica = document.querySelector('#PagEditarLetraMusica')
let cores_fonte_add_letra
function Abrir_add_music() {
    PagEditarLetraMusica.style.display = 'block'
    obterCoresDaImagem(Musica_Editanto_Agora.LinkImg).then((resolve) => {
        const random_number = Math.floor(Math.random() * resolve.length -1)
        PagEditarLetraMusica.style.background = resolve[random_number]

        cores_fonte_add_letra = verificarCor(resolve[random_number])
        document.getElementById('textarea_add_letra').style.color = cores_fonte_add_letra[1]
        if(cores_fonte_add_letra[1] == '#fff') {
            textarea_add_letra.classList.add('Placeholder_claro')
        } else {
            textarea_add_letra.classList.remove('Placeholder_claro')
        }
        document.getElementById('contaienr_sincronizar_musica').style.color = cores_fonte_add_letra[2]
        document.querySelector('#BarraMusica').classList.remove('BarraMusicaOpen')
    })
}

let letra_da_musica
const btn_ir_para_sincronizar = document.querySelector('#btn_ir_para_sincronizar')
function Checar_pode_ir_para_sincronizar(valor) {
    if(valor) {
        btn_ir_para_sincronizar.style.display = 'block'
        letra_da_musica = valor
    }
}

function Ir_para_sincronizar() {
    btn_ir_para_sincronizar.style.display = 'none'
    document.querySelector('#primeira_parte_adicionar_letra').style.display = 'none'
    document.querySelector('#contaienr_sincronizar_musica').style.display = 'block'
    document.querySelector('#local_letra_musica_sincronizar').innerHTML = letra_da_musica
    document.querySelector('#BarraMusica').classList.remove('BarraMusicaOpen')
}

let marcacoes = []

function Voltar_Marcar_Letra() {
    Zerar_marcacoes()
    btn_ir_para_sincronizar.style.display = 'block'
    document.querySelector('#primeira_parte_adicionar_letra').style.display = 'block'
    document.querySelector('#contaienr_sincronizar_musica').style.display = 'none'
}

let comecar_sincronizar = false
const btn_marcar_letra = document.querySelector('#btn_marcar_letra')
let marcar = true
function Marcar_letra() {
    if(!comecar_sincronizar && marcar == true) {
        comecar_sincronizar = true
        btn_marcar_letra.innerHTML = 'Marcar'
        DarPlayMusica(Musica_Editanto_Agora)
        document.querySelector('#BarraMusica').classList.remove('BarraMusicaOpen')

    } else if(comecar_sincronizar && marcar == true) {
        Destacar_linhas()
        //? Vai pegar o sedundo atual do audio
        var audioPlayer = document.getElementById('audioPlayer')
        var tempoAtual = audioPlayer.currentTime
        marcacoes.push(tempoAtual)

    } else if(comecar_sincronizar && marcar != true) {
        let feito = false
        let musicaEncontrada = false
        //? Vai salvar a letra
        db.collection('InfoMusicas').limit(1).get().then((snapshot) => {
            snapshot.docs.forEach(Musicas => {
                let TodasMusicasAtuais = Musicas.data()

                if(feito == false) {
                    feito = true

                    // Encontre o objeto com o ID desejado
                    for(let c = 0; c < TodasMusicasAtuais.Musicas.length; c++) {
                        if(TodasMusicasAtuais.Musicas[c].ID == Musica_Editanto_Agora.ID && musicaEncontrada == false) {
                            musicaEncontrada = true
                            TodasMusicasAtuais.Musicas[c].Letra = {
                                LetraDaMusica: letra_da_musica,
                                Tempo: marcacoes
                            }

                            db.collection('InfoMusicas').doc(Musicas.id).update({Musicas: TodasMusicasAtuais.Musicas}).then(() => {
                                TodasMusicas = TodasMusicasAtuais
                                FecharEditarMusica()
                                abrirMeuPerfil()
                                alert('Letra salva com sucesso!')
                                Limpar_letra()
                            })
                        }
                    }
                }
            })
        })
    }

    //? Vai controlar as cores da pag add letra
    document.querySelector('#contaienr_sincronizar_musica').style.color = cores_fonte_add_letra[2]
    var linhasAnteriores = document.querySelectorAll('.linha_pre_anterior_add_letra')
    linhasAnteriores.forEach(function(elemento) {
        try {
            elemento.style.color = cores_fonte_add_letra[0]
        } catch{}
    })

    try {
        document.querySelector('#linha_atual_editar_letra').style.color = cores_fonte_add_letra[1]
    } catch{}
}

function Limpar_letra() {
    Zerar_marcacoes()
    document.querySelector('#local_letra_musica_sincronizar').innerHTML = ''
    document.querySelector('#containerEditrarMusica').style.display = 'none'
    PagEditarLetraMusica.style.display = 'none'
    
}

function Zerar_marcacoes() {
    PausaDespausarMusica()
    marcacoes = []
    btn_marcar_letra.innerHTML = 'Começar'
    comecar_sincronizar = false
    document.querySelector('#local_letra_musica_sincronizar').innerHTML = letra_da_musica
    linha_atual = 0
}

var linha_atual = 0
function Destacar_linhas() {
    var preElemento = document.getElementById('local_letra_musica_sincronizar')
    var linhas = preElemento.innerText.split('\n')
    console.log(linhas.length);
    
    if (linha_atual < linhas.length) {
        // Atualiza a linha atual com a classe 'linha_pre_em_destaque'
        var linhasAtualizadas = linhas.map(function(linha, index) {

        if(index < linha_atual) {
            return '<span class="linha_pre_anterior_add_letra">' + linha + '</span>'
        } else if (index === linha_atual) {
                return '<span class="linha_pre_em_destaque_add_letra" id="linha_atual_editar_letra">' + linha + '</span>'
            } else {
                return linha
            }
        })
        
        // Atualiza o conteúdo do <pre> com as linhas modificadas
        preElemento.innerHTML = linhasAtualizadas.join('\n')

        //? Faz o scroll para a linha atual
        document.getElementById('linha_atual_editar_letra').scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        linha_atual++
        if (linha_atual >= linhas.length) {
            btn_marcar_letra.innerHTML = 'Salvar'
            marcar = false
        }
    }
}

//? Vai abrir a aba para mostrar a música que esta tocando agora
const btn_abrir_letra = document.querySelector('#btn_abrir_letra')
const letra_musica_tocando_agora = document.querySelector('#letra_musica_tocando_agora')
btn_abrir_letra.addEventListener('click', () => {
    Abrir_Pagina_Letra_Musica_Tocando()
})

function Abrir_Pagina_Letra_Musica_Tocando() {
    const PagVerLetraMusicaTocando = document.querySelector('#PagVerLetraMusicaTocando')
    if(PagVerLetraMusicaTocando.style.display != 'block') {
        PagVerLetraMusicaTocando.style.display = 'block'
        document.querySelector('body').style.overflow = 'hidden'
        FecharTelaTocandoAgora()

        Trocar_Letra()

    } else {
        PagVerLetraMusicaTocando.style.display = 'none'
        document.querySelector('body').style.overflow = 'auto'
    }
}

function Trocar_Letra() {
    Trocar_Letra_cell()
    document.getElementById('start_letra').scrollIntoView({ behavior: 'smooth', block: 'center' })

    if(MusicaTocandoAgora.Letra.LetraDaMusica) {
        // letra_musica_tocando_agora.innerHTML = MusicaTocandoAgora.Letra.LetraDaMusica

        var linhas = MusicaTocandoAgora.Letra.LetraDaMusica.split('\n')
        
        for (let c = 0; c < linhas.length; c++) {
            if (c < linhas.length) {
                // Atualiza a linha atual com a classe 'linha_pre_em_destaque'
                var linhasAtualizadas = linhas.map(function(linha, index) {
                    return `<span class="linha_letra_tocando_agora" onclick="voltar_musica_por_letra(${index})">${linha}</span>`
                })

                // Atualiza o conteúdo do <pre> com as linhas modificadas
                letra_musica_tocando_agora.innerHTML = linhasAtualizadas.join('\n')
            }
        }

        letra_musica_tocando_agora.classList.remove('sem_musica')

    } else {
        letra_musica_tocando_agora.innerHTML = 'Ainda não aprendemos essa :('
        letra_musica_tocando_agora.classList.add('sem_musica')
    }
}

function Trocar_Letra_cell() {
    // document.getElementById('start_letra').scrollIntoView({ behavior: 'smooth', block: 'center' })
    const pre_musica_tocando_agora_cell = document.querySelector('#pre_musica_tocando_agora_cell')

    if(MusicaTocandoAgora.Letra.LetraDaMusica) {
        // pre_musica_tocando_agora_cell.innerHTML = MusicaTocandoAgora.Letra.LetraDaMusica

        var linhas = MusicaTocandoAgora.Letra.LetraDaMusica.split('\n')
        
        for (let c = 0; c < linhas.length; c++) {
            if (c < linhas.length) {
                // Atualiza a linha atual com a classe 'linha_pre_em_destaque'
                var linhasAtualizadas = linhas.map(function(linha, index) {
                    return `<span class="linha_letra_tocando_agora" onclick="voltar_musica_por_letra(${index})">${linha}</span>`
                })

                // Atualiza o conteúdo do <pre> com as linhas modificadas
                pre_musica_tocando_agora_cell.innerHTML = linhasAtualizadas.join('\n')
            }
        }

        pre_musica_tocando_agora_cell.classList.remove('sem_musica_cell')

    } else {
        pre_musica_tocando_agora_cell.innerHTML = 'Ainda não aprendemos essa :('
        pre_musica_tocando_agora_cell.classList.add('sem_musica_cell')
    }
}

function voltar_musica_por_letra(num) {
    audioPlayer.currentTime = MusicaTocandoAgora.Letra.Tempo[num]
    setTimeout(() => {
        // PausaDespausarMusica()
    }, 100)
}

//? Vai seguir a letra da música
let musica_trocada_trocar_cor_letra = false
audioPlayer.addEventListener('timeupdate', function() {
    // Chamar a função desejada aqui
    if(MusicaTocandoAgora.Letra.LetraDaMusica) {
        var tempoAtual = audioPlayer.currentTime
        Destacar_linhas_Musica_Tocando_Agora(tempoAtual)
        Destacar_linhas_Musica_Tocando_Agora_cell(tempoAtual)
        Trocar_cores_letra()


    } else {
        try {
            letra_musica_tocando_agora.style.color = cores_fonte[1]
            letra_musica_tocando_agora.innerHTML = 'Ainda não aprendemos essa :('
            letra_musica_tocando_agora.classList.add('sem_musica')
        } catch{}
    }
})

function Trocar_cores_letra() {
    //? Vai controlar as cores da letra da música tocando agora
    try {
        letra_musica_tocando_agora.style.color = cores_fonte[2]
        document.querySelector('#pre_musica_tocando_agora_cell').style.color = cores_fonte[2]
    } catch {}

    var linhasAnteriores = document.querySelectorAll('.linha_pre_anterior')
    linhasAnteriores.forEach(function(elemento) {
        try {
            elemento.style.color = cores_fonte[0]
        } catch{}
    })
    
    try {
        document.querySelector('#linha_atual').style.color = cores_fonte[1]
        document.querySelector('#linha_atual_cell').style.color = cores_fonte[1]
    } catch{}

    //? Cell --------------
    try {
        document.querySelector('#pre_musica_tocando_agora_cell').style.color = cores_fonte[2]
    } catch {}

    var linhas_anteriores_cell = document.querySelectorAll('.linha_pre_anterior_cell')
    linhas_anteriores_cell.forEach(function(elemento) {
        try {
            elemento.style.color = cores_fonte[0]
        } catch{}
    })
    
    try {
        document.querySelector('#linha_atual_cell').style.color = cores_fonte[1]
    } catch{}
}

function Destacar_linhas_Musica_Tocando_Agora(tempoAtual) {
    var preElemento = document.getElementById('letra_musica_tocando_agora')
    var linhas = preElemento.innerText.split('\n')
    
    for (let c = 0; c < MusicaTocandoAgora.Letra.Tempo.length; c++) {
        if (tempoAtual + 0.3 >= MusicaTocandoAgora.Letra.Tempo[c]) {
            if (c < linhas.length) {
                // Atualiza a linha atual com a classe 'linha_pre_em_destaque'
                var linhasAtualizadas = linhas.map(function(linha, index) {

                    if(index < c) {
                        // Linhas anteriores
                        return `<span class="linha_letra_tocando_agora linha_pre_anterior" onclick="voltar_musica_por_letra(${index})">${linha}</span>`

                    } else if (index === c) {
                        // Adiciona a classe 'linha_pre_em_destaque' apenas à linha atual
                        return `<span class="linha_letra_tocando_agora linha_pre_em_destaque" id="linha_atual" onclick="voltar_musica_por_letra(${index})">${linha}</span>`
                    } else {
                        return `<span class="linha_letra_tocando_agora" onclick="voltar_musica_por_letra(${index})">${linha}</span>`
                    }
                })

                // Atualiza o conteúdo do <pre> com as linhas modificadas
                preElemento.innerHTML = linhasAtualizadas.join('\n')

                // Faz o scroll para a linha atual
                document.getElementById('linha_atual').scrollIntoView({ block: 'center' })
            } else {
                // Finaliza o intervalo após percorrer todas as linhas
            }
        }
    }
}

function Destacar_linhas_Musica_Tocando_Agora_cell(tempoAtual) {
    var preElemento = document.getElementById('pre_musica_tocando_agora_cell')
    var linhas = preElemento.innerText.split('\n')
    
    for (let c = 0; c < MusicaTocandoAgora.Letra.Tempo.length; c++) {
        if (tempoAtual + 0.3 >= MusicaTocandoAgora.Letra.Tempo[c]) {
            if (c < linhas.length) {
                // Atualiza a linha atual com a classe 'linha_pre_em_destaque'
                var linhasAtualizadas = linhas.map(function(linha, index) {

                    if(index < c) {
                        // Linhas anteriores
                        return `<span class="linha_letra_tocando_agora_cell linha_pre_anterior" onclick="voltar_musica_por_letra(${index})">${linha}</span>`

                    } else if (index === c) {
                        // Adiciona a classe 'linha_pre_em_destaque' apenas à linha atual
                        return `<span class="linha_letra_tocando_agora_cell linha_pre_em_destaque" id="linha_atual_cell" onclick="voltar_musica_por_letra(${index})">${linha}</span>`
                    } else {
                        return `<span class="linha_letra_tocando_agora_cell" onclick="voltar_musica_por_letra(${index})">${linha}</span>`
                    }
                })

                // Atualiza o conteúdo do <pre> com as linhas modificadas
                preElemento.innerHTML = linhasAtualizadas.join('\n')

                // Faz o scroll para a linha atual
                try {
                    scrollParaSpanNoCentro('container_letra_musica_tocando_agora_cell', 'linha_atual_cell')
                } catch{}
            } else {
                // Finaliza o intervalo após percorrer todas as linhas
            }
        }
    }
}

let cores_fonte
let cor_escolhida_background
function Trocar_cor_barra_musica(urlDaImagem) {
    obterCoresDaImagem(urlDaImagem).then((resolve) => {
        ultima_img_analizada = urlDaImagem
        cores_da_img_musica_tocando_agora = resolve
        const BarraMusica = document.getElementById('BarraMusica')
        const random_number = Math.floor(Math.random() * resolve.length -1)
        cor_escolhida_background = resolve[random_number]
        document.getElementById('PagVerLetraMusicaTocando').style.background = cor_escolhida_background
        cores_fonte = verificarCor(cor_escolhida_background)
        document.getElementById('background_PagMusicaTocandoAgora').style.backgroundImage = `linear-gradient(to bottom, ${cor_escolhida_background}, #1a1a1dd6, #1a1a1d)`
        document.getElementById('container_letra_musica_tocando_agora_cell').style.background = cor_escolhida_background
            
        if(document.documentElement.clientWidth < 629) {
            BarraMusica.style.background = cor_escolhida_background
            document.querySelector('#NomeMusicaBarraMusica').style.color = cores_fonte[1]
            document.querySelector('#AutorMusicaBarraMusica').style.color = cores_fonte[1]

        } else {
            BarraMusica.style.background = '#1a1a1d'
            document.querySelector('#NomeMusicaBarraMusica').style.color = '#fff'
            document.querySelector('#AutorMusicaBarraMusica').style.color = 'rgba(255, 255, 255, 0.4196078431)'
        }

        Trocar_cores_letra()
        
    //? Mostra as cores da img na tela
    //   const container_cores = document.querySelector('#container_cores')
    //   container_cores.innerHTML = ''
    //   for (let c = 0; c < resolve.length; c++) {
    //     const div = document.createElement('div')
    //     div.style.background = resolve[c]
    //     container_cores.appendChild(div)
    //  }
    })
}
