const pop_up_excluir_musica = document.getElementById('pop_up_excluir_musica')
function AbrirExcluirMusica(Acao) {
    if(pop_up_excluir_musica.style.display == 'flex') {

        pop_up_excluir_musica.style.display = 'none'
    } else {
        document.getElementById('img_excluir_musica').src = musica_selecionada_excluir.LinkImg
        pop_up_excluir_musica.style.display = 'flex'
    }

    if(Acao == 'Excluir') {
        ExcluirMusica(musica_selecionada_excluir)
    }
}

async function ExcluirMusica(Musica) {
    const musicaID = Musica.ID

    try {
        if(!Musica.LinkImg.includes('treefy')) {
            let LinkImg = removerParteInicial(Musica.LinkImg, 'https://storage.googleapis.com/musiverse-e89c0.appspot.com/')
            let LinkAudio = removerParteInicial(Musica.LinkAudio, 'https://storage.googleapis.com/musiverse-e89c0.appspot.com/')

            // Excluir a pasta
            storage.ref().child(LinkImg).delete().then(() => {
                storage.ref().child(LinkAudio).delete().then(() => {
                    //* Vai remover a música do local
                    for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
                        if(TodasMusicas.Musicas[c].ID == Musica.ID) {
                            TodasMusicas.Musicas.splice(c, 1)
                        }
                    }

                    //* Vai remover a música do firebase firestore
                    let feito = false
                    db.collection('InfoMusicas').limit(1).get().then((snapshot) => {
                        snapshot.docs.forEach(Musicas => {
                            let InfoMusicas = Musicas.data()

                            if(!feito) {
                                feito = true
                                for (let c = 0; c < InfoMusicas.Musicas.length; c++) {
                                    if(InfoMusicas.Musicas[c].ID == Musica.ID) {
                                        InfoMusicas.Musicas.splice(c, 1)
                                        db.collection('InfoMusicas').doc(Musicas.id).update({Musicas: InfoMusicas.Musicas}).then(() => {
                                            abrirMeuPerfil()
                                            alert('Música excluida com sucesso!')
                                        })
                                    }
                                }
                            }
                        })

                    })
                })
            })
        } else {
            alert('Músicas importadas do TreeFy não podem ser excluidas por aqui infelizmente ;(')
        }

    } catch (error) {
        console.error('Erro ao excluir pasta da música:', error)
    }
}