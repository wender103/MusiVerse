function Abrir_Aba_Amigos() {
    FecharTelaTocandoAgora()
    document.querySelector('#container_aba_amigos').style.right = '0'
}

function Fehcar_Aba_Amigos() {
    document.querySelector('#container_aba_amigos').style.right = '-110vw'
}

const container_amigos = document.querySelector('#container_amigos')
function Carregar_Amigos(Email, UsersData) {
    // console.log('Carregar_Amigos foi chamado');
    let Amigos = currentUser.User.InfosPerfil.Amigos.Aceitos

    for(let a = 0; a < TodosOsUsers.length; a++) {
        //* Vai clonar os pefis
        if(TodosOsUsers[a].User.Email == Email) {
            const container_perfil_amigo = document.createElement('div')

            const primeira_parte_perfil_amigo = document.createElement('div')
            const container_img_perfil_amigo = document.createElement('div')
            const div_container_img = document.createElement('div')
            const img_perfil = document.createElement('img')
            const ball_offline = document.createElement('span')

            const container_texto_perfil_amigo = document.createElement('div')
            const p = document.createElement('p')
            const span_offline = document.createElement('span')

            const container_musica_ouvindo_amigo = document.createElement('div')
            const container_play_musica_amigo = document.createElement('div')
            const play_musica_amigo = document.createElement('img')
            const container_img_musica_ouvindo_amigo = document.createElement('div')
            const img_musica_ouvindo_amigo = document.createElement('img')

            //* Classes
            container_perfil_amigo.id = `container_perfil_amigo_${Email}`
            container_perfil_amigo.className = 'container_perfil_amigo'
            primeira_parte_perfil_amigo.className = 'primeira_parte_perfil_amigo'
            container_img_perfil_amigo.className = 'container_img_perfil_amigo'
            container_texto_perfil_amigo.className = 'container_texto_perfil_amigo'

            if(UsersData.CorBackground && UsersData.Online) {
                container_perfil_amigo.style.backgroundImage = `linear-gradient(-45deg, ${UsersData.CorBackground}, rgba(0, 0, 0, 0))`
            }
            
            if(UsersData.Online == false) {
                ball_offline.className = 'ball_offline'
                span_offline.className = 'span_offline'
            }

            container_musica_ouvindo_amigo.className = 'container_musica_ouvindo_amigo'
            container_img_musica_ouvindo_amigo.className = 'container_img_musica_ouvindo_amigo'
            container_play_musica_amigo.className = 'container_play_musica_amigo'
            play_musica_amigo.className = 'play_musica_amigo'
            img_musica_ouvindo_amigo.className = 'img_musica_ouvindo_amigo'

            
            //* Textos
            play_musica_amigo.src = 'Assets/Imgs/Icons/Play.png'

            
            carregarImagem(TodosOsUsers[a].User.Personalizar.FotoPerfil, function(imgPerfil) {
                carregarImagem(TodosOsUsers[a].User.Personalizar.Background, function(imgBackground) {
                    if (imgPerfil) {
                        img_perfil.src = imgPerfil.src
                    } else if (imgBackground) {
                        img_perfil.src = imgBackground.src
                    } else {
                        img_perfil.src = 'Assets/Imgs/Banners/fitaCassete.avif'
                    }
                })
            })

            p.innerText = TodosOsUsers[a].User.Nome

            if(UsersData.Online == false) {
                span_offline.innerText = 'Offline...'

            } else if(UsersData.Online == true) {
                span_offline.innerText = 'Online...'
            }

            //? Musica ouvindo agora
            let ListaMusica
            if(UsersData.Ouvindo.ID) {
                container_musica_ouvindo_amigo.id = UsersData.Ouvindo.ID

                for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
                    if(TodasMusicas.Musicas[c].ID == UsersData.Ouvindo.ID) {
                        ListaMusica = TodasMusicas.Musicas[c]
                        img_musica_ouvindo_amigo.src = TodasMusicas.Musicas[c].LinkImg
                        container_musica_ouvindo_amigo.style.display = 'block'
                    }                        
                }
            }

            //* AppendChild
            div_container_img.appendChild(img_perfil)
            container_img_perfil_amigo.appendChild(div_container_img)
            container_img_perfil_amigo.appendChild(ball_offline)

            container_texto_perfil_amigo.appendChild(p)
            container_texto_perfil_amigo.appendChild(span_offline)

            primeira_parte_perfil_amigo.appendChild(container_img_perfil_amigo)
            primeira_parte_perfil_amigo.appendChild(container_texto_perfil_amigo)

            container_play_musica_amigo.appendChild(play_musica_amigo)
            container_img_musica_ouvindo_amigo.appendChild(img_musica_ouvindo_amigo)

            container_musica_ouvindo_amigo.appendChild(container_play_musica_amigo)
            container_musica_ouvindo_amigo.appendChild(container_img_musica_ouvindo_amigo)

            container_perfil_amigo.appendChild(primeira_parte_perfil_amigo)
            container_perfil_amigo.appendChild(container_musica_ouvindo_amigo)

            container_amigos.appendChild(container_perfil_amigo)

            //* Funções
            //? Ao passar o mouse na música tocando agora no perfil amigo vai aparecer um icone de play
            container_play_musica_amigo.addEventListener('mouseenter', () => {
                container_play_musica_amigo.style.opacity = '1'
            })

            //? Ao tirar o mouse na música tocando agora no perfil amigo vai sumir o icone de play
            container_play_musica_amigo.addEventListener('mouseleave', () => {
                container_play_musica_amigo.style.opacity = '0'
            })

            //? Ao clicar vai começar a música
            container_play_musica_amigo.addEventListener('click', () => {
                const container_perfil_amigo2 = document.querySelectorAll('.container_perfil_amigo')

                for(let a = 0; a < container_perfil_amigo2.length; a++) {
                    if(container_perfil_amigo2[a].id == `container_perfil_amigo_${Email}`) {
                        for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
                            if(TodasMusicas.Musicas[c].ID == document.querySelectorAll('.container_musica_ouvindo_amigo')[a].id) {
                                DarPlayMusica(TodasMusicas.Musicas[c])
                            }                        
                        }
                    }
                }
            })

            container_perfil_amigo.addEventListener('click', (e) => {
                let el = e.target
                if(el.className != 'container_play_musica_amigo' && el.className != 'play_musica_amigo' && el.className != 'container_musica_ouvindo_amigo') {
                    AbrirPaginas('profile', TodosOsUsers[a].User.Id)
                }
            })
        }
    }
}

//? Ao invés de reescrever a lista de amigos ele vai atualizar apenas o amigo no qual mudou algo no banco de dados
let amigo_encontrado = false
let limpar_lista_amigo = false
function Atualizar_Amigo(Email, UsersData) {
    return new Promise((resolve, reject) => {
        // console.log('Perfil atualizou');
        const container_perfil_amigo = document.querySelectorAll('.container_perfil_amigo')

        for(let c = 0; c < container_perfil_amigo.length; c++) {
            if(container_perfil_amigo[c].id == `container_perfil_amigo_${Email}`) {
                amigo_encontrado = true

                const container_img_perfil_amigo = document.querySelectorAll('.container_img_perfil_amigo')[c]
                const ball_offline = container_img_perfil_amigo.querySelector('span')

                const container_texto_perfil_amigo = document.querySelectorAll('.container_texto_perfil_amigo')[c]
                const span_offline = container_texto_perfil_amigo.querySelector('span')

                const container_musica_ouvindo_amigo = document.querySelectorAll('.container_musica_ouvindo_amigo')[c]
                const container_play_musica_amigo = document.querySelectorAll('.container_play_musica_amigo')[c]
                const container_img_musica_ouvindo_amigo = document.querySelectorAll('.container_img_musica_ouvindo_amigo')[c]
                const img_musica_ouvindo_amigo = container_img_musica_ouvindo_amigo.querySelector('img')

                if(UsersData.Online == false) {
                    ball_offline.className = 'ball_offline'
                    span_offline.className = 'span_offline'
                } else {
                    ball_offline.classList.remove('ball_offline')
                    span_offline.classList.remove('span_offline')
                }

                if(UsersData.Online == false) {
                    span_offline.innerText = 'Offline...'

                } else if(UsersData.Online == true) {
                    span_offline.innerText = 'Online...'
                }

                //? Musica ouvindo agora
                let ListaMusica
                if(UsersData.Ouvindo.ID) {
                    container_musica_ouvindo_amigo.id = UsersData.Ouvindo.ID    

                    for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
                        if(TodasMusicas.Musicas[c].ID == UsersData.Ouvindo.ID) {
                            ListaMusica = TodasMusicas.Musicas[c]
                            img_musica_ouvindo_amigo.src = TodasMusicas.Musicas[c].LinkImg
                            container_musica_ouvindo_amigo.style.display = 'block'
                        }                        
                    }
                } else {
                    container_musica_ouvindo_amigo.style.display = 'none'
                }
            }
        }

        if(!amigo_encontrado) {
            if(!limpar_lista_amigo) {
                limpar_lista_amigo = true
                document.querySelector('#container_amigos').innerHTML = ''
                
                setTimeout(() => {
                    limpar_lista_amigo = false
                }, 1000)
            }

            resolve('Amigo não encontrado')

        }

    })
}

const input_add_amigo = document.querySelector('#input_add_amigo')
function Checar_add_amigo() {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(input_add_amigo.value.trim() != '' && regex.test(input_add_amigo.value) && input_add_amigo.value != currentUser.User.Email) {
        Enviar_pedido(input_add_amigo.value)        

    } else if(input_add_amigo.value == currentUser.User.Email) {
        alert('Faça amigos primeiro, ser amigo de si mesmo que não dá!')

    } else {
        alert('Dígite um email valido.')
    }
}

function Enviar_pedido(Email_Amigo) {
    let Perfil_User = {User: '', InfosPerfil: ''}
    let Perfil_Amigo = {User: '', InfosPerfil: ''}

    db.collection('Users').get().then((snapshot) => {
        snapshot.docs.forEach(Users => {
            //? Vai clonar os pefis
            if(Users.data().Email == currentUser.User.Email) {
                Perfil_User.User = Users.data()
                Perfil_User.InfosUser = Users

            } else if(Users.data().Email == Email_Amigo) {
                Perfil_Amigo.User = Users.data()
                Perfil_Amigo.InfosUser = Users
            }
        })

        //? Vai fazer as devidas alterações no perfil User
        if(Array.isArray(Perfil_User.User.InfosPerfil.Amigos)) {
            Perfil_User.User.InfosPerfil.Amigos = {
                Pendentes: [],
                Aceitos: [],
                Bloqueados: [],
                Recusados: []
            }
        }

        //? Vai fazer as devidas alterações no perfil Amigo
        if(Array.isArray(Perfil_Amigo.User.InfosPerfil.Amigos)) {
            Perfil_Amigo.User.InfosPerfil.Amigos = {
                Pendentes: [],
                Aceitos: [],
                Bloqueados: [],
                Recusados: []
            }
        }

        let ja_e_amigo = false //* Vai checar se vc já é amigo dele
        let esta_bloqueado = false //* Vai checar se vc foi bloqueado pelo amigo que tu quer adicionar
        let ja_enviou_antes = false //* Vai checar se vc já enviou pedido para esse amigo antes
        let vc_bloqueou_ele = false
        let esta_nos_seus_pendentes = false //* Vai checar se o amigo já havia mandado pedido de amizade antes

        //? Vai checar se o amigo já havia sido adicionado antes
        for (let a = 0; a < Perfil_User.User.InfosPerfil.Amigos.Aceitos.length; a++) {
            let Aceitos = Perfil_User.User.InfosPerfil.Amigos.Aceitos

            if(Aceitos[a] == Email_Amigo) {
                ja_e_amigo = true
                alert('Vocês já são amigos! 🏳️‍🌈🤨')
            }
        }

        //? Vai checar se vc está bloqueado
        if(!ja_e_amigo) {
            for (let a = 0; a < Perfil_Amigo.User.InfosPerfil.Amigos.Bloqueados.length; a++) {
                let Bloqueados = Perfil_Amigo.User.InfosPerfil.Amigos.Bloqueados
    
                if(Bloqueados[a] == Perfil_User.User.Email) {
                    esta_bloqueado = true
                    alert('Vocês não podem ser amigos(as), ele(a) te bloqueou. 🚫😔😟')
                }
            }
        }

        //? Vai checar se vc está bloqueado
        if(!ja_e_amigo && !esta_bloqueado) {
            for (let a = 0; a < Perfil_Amigo.User.InfosPerfil.Amigos.Pendentes.length; a++) {
                let Pendentes = Perfil_Amigo.User.InfosPerfil.Amigos.Pendentes
    
                if(Pendentes[a] == Perfil_User.User.Email) {
                    ja_enviou_antes = true
                    alert('Calma calabreso. Você já enviou um pedido antes, espere ele(a) responder. ⏱️⏳')
                }
            }
        }

        //? Vai checar se ele já pedio para ser seu amigo antes
        if(!ja_e_amigo && !esta_bloqueado && !ja_enviou_antes) {
            for (let a = 0; a < Perfil_User.User.InfosPerfil.Amigos.Pendentes.length; a++) {
                let Pendentes = Perfil_User.User.InfosPerfil.Amigos.Pendentes
    
                if(Pendentes[a] == Email_Amigo) {
                    esta_nos_seus_pendentes = true
                    Aceitar_Ou_Enviar_Pedido(Email_Amigo, 'Aceitar')
                }
            }
        }

        //? Vai checar se ele já pedio para ser seu amigo antes
        if(!ja_e_amigo && !esta_bloqueado && !ja_enviou_antes && !esta_nos_seus_pendentes) {
            for (let a = 0; a < Perfil_User.User.InfosPerfil.Amigos.Bloqueados.length; a++) {
                let Bloqueados = Perfil_User.User.InfosPerfil.Amigos.Bloqueados
    
                if(Bloqueados[a] == Email_Amigo) {
                    vc_bloqueou_ele = true
                    Perfil_User.User.InfosPerfil.Amigos.Bloqueados.splice(a, 1)
                    db.collection('Users').doc(Perfil_User.InfosUser.id).update({InfosPerfil:  Perfil_User.User.InfosPerfil}).then(() => {
                        alert('Você desbloqueou ele(a).')
                    })
                    Aceitar_Ou_Enviar_Pedido(Email_Amigo, 'Enviar')
                }
            }
        }

        //? Vai enviar o pedido
        if(!ja_e_amigo && !esta_bloqueado && !ja_enviou_antes && !esta_nos_seus_pendentes && !vc_bloqueou_ele) {
            Aceitar_Ou_Enviar_Pedido(Email_Amigo, 'Enviar')
        }
    })
}

function Aceitar_Ou_Enviar_Pedido(Email_Amigo, Metodo) {
    let Perfil_User = {User: '', InfosPerfil: ''}
    let Perfil_Amigo = {User: '', InfosPerfil: ''}

    db.collection('Users').get().then((snapshot) => {
        snapshot.docs.forEach(Users => {
            //? Vai clonar os pefis
            if(Users.data().Email == currentUser.User.Email) {
                Perfil_User.User = Users.data()
                Perfil_User.InfosUser = Users

            } else if(Users.data().Email == Email_Amigo) {
                Perfil_Amigo.User = Users.data()
                Perfil_Amigo.InfosUser = Users
            }
        })

        if(Metodo == 'Aceitar') {
            //* Vai adicionar para o user
            for (let a = 0; a < Perfil_User.User.InfosPerfil.Amigos.Pendentes.length; a++) {
                let Pendentes = Perfil_User.User.InfosPerfil.Amigos.Pendentes

                if(Pendentes[a] == Email_Amigo) {
                    Perfil_User.User.InfosPerfil.Amigos.Pendentes.splice(a, 1)
                }
            }
            
            Perfil_User.User.InfosPerfil.Amigos.Aceitos.push(Email_Amigo)
            db.collection('Users').doc(Perfil_User.InfosUser.id).update({InfosPerfil:  Perfil_User.User.InfosPerfil})

            //* Vai adicionar para o Amigo
            for (let a = 0; a < Perfil_Amigo.User.InfosPerfil.Amigos.Pendentes.length; a++) {
                let Pendentes = Perfil_Amigo.User.InfosPerfil.Amigos.Pendentes

                if(Pendentes[a] == Perfil_User.User.Email) {
                    Perfil_Amigo.User.InfosPerfil.Amigos.Pendentes.splice(a, 1)
                }
            }

            Perfil_Amigo.User.InfosPerfil.Amigos.Aceitos.push(Perfil_User.User.Email)
            db.collection('Users').doc(Perfil_Amigo.InfosUser.id).update({InfosPerfil:  Perfil_Amigo.User.InfosPerfil}).then(() => {
                alert('Agora vocês são amigos(as)! 🙂🫠')
            })

            //* Vai enviar o pedido de amizade
        } else if(Metodo == 'Enviar') {
            Perfil_Amigo.User.InfosPerfil.Amigos.Pendentes.push(Perfil_User.User.Email)
            db.collection('Users').doc(Perfil_Amigo.InfosUser.id).update({InfosPerfil:  Perfil_Amigo.User.InfosPerfil}).then(() => {
                alert('Pedido enviado com sucesso! Boa sorte! 🙂🫠')
            })
        }
    })
}

let contador_pedidos = 0
function Checar_Se_Tem_Pedidos() {
    let Pendentes = currentUser.User.InfosPerfil.Amigos.Pendentes

    if(Pendentes.length > 0) {
        Abrir_Pedidos(Pendentes[contador_pedidos])
        contador_pedidos++
    }
}

function Recusar_Pedido(User_Pedido) {
    //* Vai tirar o pedido dos pendentes
    for (let a = 0; a < currentUser.User.InfosPerfil.Amigos.Pendentes.length; a++) {
        let Pendentes = currentUser.User.InfosPerfil.Amigos.Pendentes

        if(Pendentes[a] == User_Pedido) {
            currentUser.User.InfosPerfil.Amigos.Pendentes.splice(a, 1)
        }
    }
    db.collection('Users').doc(currentUser.User.Id).update({InfosPerfil:  currentUser.User.InfosPerfil})

    //* Vai enviar ao user que fez o pedido a informações de foi regeitado
    db.collection('Users').get().then((snapshot) => {
        snapshot.docs.forEach(Users => {
            let Amigo = Users.data()

            if(Amigo.Email == User_Pedido) {
                //? Vai fazer as devidas alterações no perfil Amigo
                if(Array.isArray(Amigo.InfosPerfil.Amigos)) {
                    Amigo.InfosPerfil.Amigos = {
                        Pendentes: [],
                        Aceitos: [],
                        Bloqueados: [],
                        Recusados: []
                    }
                }

                if(Amigo.InfosPerfil.Amigos.Recusados.length > 0) {
                    for(let b = 0; b < Amigo.InfosPerfil.Amigos.Recusados.length; b++) {
                        if(Amigo.InfosPerfil.Amigos.Recusados[b] == currentUser.User.Email) {
                            Amigo.InfosPerfil.Amigos.Recusados.splice(b, 1)
                        }
                    }
                }
                Amigo.InfosPerfil.Amigos.Recusados.push(currentUser.User.Email)
                db.collection('Users').doc(Users.id).update({InfosPerfil:  Amigo.InfosPerfil})
                contador_pedidos--
            }
        })
    })
}

function Abrir_Pedidos(User_Pedido) {
    for(let c = 0; c < TodosOsUsers.length; c++) {
        if(TodosOsUsers[c].User.Email == User_Pedido) {
            document.querySelector('#fundo_pedido_amizade').classList.add('Open_pedidos')
            document.querySelector('#container_pedido_amizade').classList.add('Open_pedidos')
            const img_user_pedido = document.querySelector('#img_user_pedido')

            if(TodosOsUsers[c].User.Personalizar.FotoPerfil != undefined && TodosOsUsers[c].User.Personalizar.FotoPerfil != null) {
                var img = new Image()
                img.src = TodosOsUsers[c].User.Personalizar.FotoPerfil
                img.onload = function() {
                    img_user_pedido.src = img.src
                }
                img.onerror = function() {
                    img_user_pedido.src = `Assets/Imgs/Banners/fitaCassete.avif`
                }

            } else {
                img_user_pedido.src = `Assets/Imgs/Banners/fitaCassete.avif`
            }

            document.querySelector('#nome_user_pedido_amizade').innerText = TodosOsUsers[c].User.Nome

            document.querySelector('#btn_recusar_pedido_amizade').addEventListener('click', () => {
                Recusar_Pedido(User_Pedido)
                Fechar_Pedidos()
            })

            document.querySelector('#btn_aceitar_pedido_amizade').addEventListener('click', () => {
                Aceitar_Ou_Enviar_Pedido(User_Pedido, 'Aceitar')
                Fechar_Pedidos()
            })
        }
    }
}

function Fechar_Pedidos() {
    document.querySelector('#fundo_pedido_amizade').classList.remove('Open_pedidos')
    document.querySelector('#container_pedido_amizade').classList.remove('Open_pedidos')
    
    setTimeout(() => {
        document.querySelector('#fundo_pedido_amizade').display = 'none'
        if(currentUser.User.InfosPerfil.Amigos.Pendentes.length > contador_pedidos) {
            Checar_Se_Tem_Pedidos()
        }
    }, 1000)

}