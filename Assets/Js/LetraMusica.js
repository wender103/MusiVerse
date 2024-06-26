const PagEditarLetraMusica = document.querySelector('#PagEditarLetraMusica')
let cores_fonte_add_letra
function Abrir_add_music() {
    PagEditarLetraMusica.style.display = 'block'
    if(Musica_Editanto_Agora.Cores != undefined) {

        PagEditarLetraMusica.style.background = Musica_Editanto_Agora.Cores[2]
    
        cores_fonte_add_letra = verificarCor(Musica_Editanto_Agora.Cores[2])
        document.getElementById('textarea_add_letra').style.color = cores_fonte_add_letra[1]
        if(cores_fonte_add_letra[1] == '#fff') {
            textarea_add_letra.classList.add('Placeholder_claro')
        } else {
            textarea_add_letra.classList.remove('Placeholder_claro')
        }
        document.getElementById('contaienr_sincronizar_musica').style.color = cores_fonte_add_letra[2]
        document.querySelector('#BarraMusica').classList.remove('BarraMusicaOpen')

    } else {

        obterCoresDaImagem(Musica_Editanto_Agora.LinkImg).then((resolve) => {
            PagEditarLetraMusica.style.background = resolve[2]
    
            cores_fonte_add_letra = verificarCor(resolve[2])
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
        //? Vai pegar o segundo atual do audio
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

let aviso_letra = JSON.parse(localStorage.getItem('Aviso_Letra'))

const aviso_letra_contaier = document.getElementById('aviso_letra_contaier')
function Abrir_Aviso_Letra() {
    aviso_letra_contaier.style.display = 'flex'
}

function Fechar_Aviso_Letra() {
    Salvar_Escolha_Aviso_Letra()
    aviso_letra_contaier.style.display = 'none'
    Timer_Comecar_Letra()
}

function Zerar_Mesmo_Assim() {
    Fechar_Aviso_Letra()
    
    PausaDespausarMusica()
    marcacoes = []
    btn_marcar_letra.innerHTML = 'Começar'
    comecar_sincronizar = false
    document.querySelector('#local_letra_musica_sincronizar').innerHTML = letra_da_musica
    linha_atual = 0
}

let escolha_aviso_letra = false
function Trocar_Valor_Salvar_Escolha_Aviso() {
    if(escolha_aviso_letra) {
        escolha_aviso_letra = false

    } else {
        escolha_aviso_letra = true
    }
}

function Salvar_Escolha_Aviso_Letra() {
    if(!aviso_letra && escolha_aviso_letra) {
        localStorage.setItem('Aviso_Letra', JSON.stringify('Visto'))
    }
}

function Zerar_marcacoes() {
    if(!aviso_letra) {
        Abrir_Aviso_Letra()
        setTimeout(() => {
            PausaDespausarMusica()
        }, 100)

    } else {
        PausaDespausarMusica()
        marcacoes = []
        btn_marcar_letra.innerHTML = 'Começar'
        comecar_sincronizar = false
        document.querySelector('#local_letra_musica_sincronizar').innerHTML = letra_da_musica
        linha_atual = 0
    }
}

var linha_atual = 0
function Voltar_Sincronizar_Musica(index) {
    linha_atual = index
    Destacar_linhas()
    marcacoes.splice(index + 1)
    audioPlayer.currentTime = marcacoes[index]
    
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

    setTimeout(() => {
        PausaDespausarMusica()
        Timer_Comecar_Letra()
    }, 100)
}

const timer_aviso_cmc_letra = document.getElementById('timer_aviso_cmc_letra')
const h1_timer_aviso_cmc_letra = document.getElementById('h1_timer_aviso_cmc_letra')
let contador_timer_aviso_cmc_letra = 3
function Timer_Comecar_Letra() {
    timer_aviso_cmc_letra.style.display = 'flex'
    h1_timer_aviso_cmc_letra.innerText = contador_timer_aviso_cmc_letra

    if(contador_timer_aviso_cmc_letra > 0) {
        setTimeout(() => {
            contador_timer_aviso_cmc_letra--
            Timer_Comecar_Letra()
        }, 1000)

    } else {
        setTimeout(() => {
            contador_timer_aviso_cmc_letra = 3
            timer_aviso_cmc_letra.style.display = 'none'
            PausaDespausarMusica()
        }, 100)
    }
}

function Destacar_linhas() {
    var preElemento = document.getElementById('local_letra_musica_sincronizar')
    var linhas = preElemento.innerText.split('\n')
    
    if (linha_atual < linhas.length) {
        // Atualiza a linha atual com a classe 'linha_pre_em_destaque'
        var linhasAtualizadas = linhas.map(function(linha, index) {

        if(index < linha_atual) {
            return `<span class="linha_pre_anterior_add_letra" onclick="Voltar_Sincronizar_Musica(${index})">` + linha + '</span>'
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

        if(document.documentElement.clientWidth > 629) {
            Destacar_linhas_Musica_Tocando_Agora(tempoAtual)
        } else {
            Destacar_linhas_Musica_Tocando_Agora_cell(tempoAtual)
        }
        
        Trocar_cores_letra()


    } else if(letra_musica_tocando_agora.innerHTML != 'Ainda não aprendemos essa :(') {
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
    
    if(document.getElementById('PagVerLetraMusicaTocando').style.display == 'block') {
        
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
}

let contador_letra = 0
const PagMusicaTocandoAgora = document.getElementById('PagMusicaTocandoAgora')
function Destacar_linhas_Musica_Tocando_Agora_cell(tempoAtual) {
    const preElemento = document.getElementById('pre_musica_tocando_agora_cell')
    const linhas = preElemento.innerText.split('\n')

    //* Vai passar a letra apenas se o user estiver vendo a letra
    if(temClasse(PagMusicaTocandoAgora, 'Open') && distanciaRolagem(PagMusicaTocandoAgora) > 60) {
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
}

let cores_fonte
let cor_escolhida_background
function Trocar_cor_barra_musica(musica) {
    if(musica.Cores != undefined) {
        ultima_img_analizada = musica.LinkImg
        cores_da_img_musica_tocando_agora = musica.Cores
        const BarraMusica = document.getElementById('BarraMusica')
        cor_escolhida_background = musica.Cores[2]
        document.getElementById('PagVerLetraMusicaTocando').style.background = cor_escolhida_background
        cores_fonte = verificarCor(cor_escolhida_background)
        document.getElementById('headerPagMusicaTocandoAgora').style.background = cor_escolhida_background
        document.getElementById('container_letra_musica_tocando_agora_cell').style.background = cor_escolhida_background
            
        if(document.documentElement.clientWidth < 629) {
            BarraMusica.style.background = cor_escolhida_background
            document.querySelector('#NomeMusicaBarraMusica').style.color = cores_fonte[1]
            document.querySelector('#AutorMusicaBarraMusica').style.color = cores_fonte[1]
            document.getElementById('p_info_tocando_agora').style.color = cores_fonte[1]

        } else {
            BarraMusica.style.background = '#1a1a1d'
            document.querySelector('#NomeMusicaBarraMusica').style.color = '#fff'
            document.querySelector('#AutorMusicaBarraMusica').style.color = 'rgba(255, 255, 255, 0.4196078431)'
        }

        Trocar_cores_letra()
        Atualizar_Presenca(true, currentUser.InfoEmail.email, MusicaTocandoAgora.ID)

    } else {
        obterCoresDaImagem(musica.LinkImg).then((resolve) => {
            ultima_img_analizada = musica.LinkImg
            cores_da_img_musica_tocando_agora = resolve
            const BarraMusica = document.getElementById('BarraMusica')
            cor_escolhida_background = resolve[2]
            document.getElementById('PagVerLetraMusicaTocando').style.background = cor_escolhida_background
            cores_fonte = verificarCor(cor_escolhida_background)
            document.getElementById('headerPagMusicaTocandoAgora').style.background = cor_escolhida_background
            document.getElementById('container_letra_musica_tocando_agora_cell').style.background = cor_escolhida_background
                
            if(document.documentElement.clientWidth < 629) {
                BarraMusica.style.background = cor_escolhida_background
                document.querySelector('#NomeMusicaBarraMusica').style.color = cores_fonte[1]
                document.querySelector('#AutorMusicaBarraMusica').style.color = cores_fonte[1]
                document.getElementById('p_info_tocando_agora').style.color = cores_fonte[1]
    
            } else {
                BarraMusica.style.background = '#1a1a1d'
                document.querySelector('#NomeMusicaBarraMusica').style.color = '#fff'
                document.querySelector('#AutorMusicaBarraMusica').style.color = 'rgba(255, 255, 255, 0.4196078431)'
            }
    
            Trocar_cores_letra()
            Atualizar_Presenca(true, currentUser.InfoEmail.email, MusicaTocandoAgora.ID)
            
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

}
