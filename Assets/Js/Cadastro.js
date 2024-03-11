const container_signIn = document.getElementById('container_signIn') //? Section sign in
const background_orange = document.getElementById('background_orange') //? background laranja
const container_background_orange = document.getElementById('container_background_orange') //? container dentro do background laranja
const container_CreatAcoonout = document.getElementById('container_CreatAcoonout') //? Section create acconunt
const container_btn_theme = document.getElementById('container_btn_theme') //? container btn tema
const container_icon_theme = document.getElementById('container_icon_theme') //? btn tema
const icon_theme = document.getElementById('icon_theme') //? img tema
let model_SignIn = true //? Vai identificar se o user quer fazer login ou cadastrar

function changeModel() {

    if(model_SignIn) {
        background_orange.className = 'left'
        scrollLeft()
        setTimeout(() => {
            container_CreatAcoonout.style.zIndex = 2
            container_signIn.style.zIndex = 0
        }, 300)
        container_CreatAcoonout.style.left = '50%'

        container_signIn.style.left = '50%'

    } else {
        background_orange.className = 'right'
        scrollRight()
        setTimeout(() => {
            container_signIn.style.zIndex = 2
            container_CreatAcoonout.style.zIndex = 0
        }, 300)
        container_signIn.style.left = '0%'


        container_CreatAcoonout.style.left = '0%'
    } 

    model_SignIn = !model_SignIn
}

//? Adicione a lógica para rolar para a direita
function scrollRight() {
    container_background_orange.style.left = '-100%'
}

//? Adicione a lógica para rolar para a esquerda
function scrollLeft() {
    container_background_orange.style.left = '0%'
}

//* ---------------------------------- Cadastrar ------------------------------------
const Email_User_Cadastro = document.getElementById('Email_User_Cadastro')
const Senha_User_Cadastro = document.getElementById('Senha_User_Cadastro')
const Nome_User_Cadastro = document.getElementById('Nome_User_Cadastro')
const Chave_User_Cadastro = document.getElementById('Chave_User_Cadastro')

function RandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16)  //gerador de cores aleatórias
}

document.getElementById("form_cadastro").addEventListener("submit", function(event) {
    event.preventDefault()
})  

document.getElementById("form_cadastro_mobile").addEventListener("submit", function(event) {
    event.preventDefault()
})  

function Cadastrar() {
    if(Email_User_Cadastro.value.trim() != '' && Senha_User_Cadastro.value.length > 0 && Nome_User_Cadastro.value.trim() != '' && Chave_User_Cadastro.value.trim() != '') {
        
        document.getElementById('CarregamentoTela1').style.display = 'flex'

        //? Vai deletar a chave de acesso
        db.collection('Chaves').get().then(snapshot => {
            snapshot.docs.forEach(ChavesAcesso => {
                const Chaves = ChavesAcesso.data()
                let chave_encotrada = false
                for(let c = 0; c <= Chaves.ChavesDeAcesso.length; c++) {
                    try {
                        if(Chaves.ChavesDeAcesso[c] == Chave_User_Cadastro.value) {
                            chave_encotrada = true
                            let ArrayChavesDeAcesso = Chaves.ChavesDeAcesso
                            let ContaUser
                            //* Vai cadastrar o user
                            auth.createUserWithEmailAndPassword(Email_User_Cadastro.value, Senha_User_Cadastro.value).then(user => {
                                ContaUser = {
                                    Email: Email_User_Cadastro.value,
                                    Nome: Nome_User_Cadastro.value,
                                    InfosPerfil: {
                                        Seguidores: [],
                                        Seguindo: [],
                                        Amigos: {
                                            Aceitos: [],
                                            Recusados: [],
                                            Pendentes: [],
                                            Bloqueados: []
                                        },
                                        ViewsSemanais: 0,
                                    },
                                    MusicasPostadas: [],
                                    MusicasCurtidas: [],
                                    GostoMusical: {
                                        Escolher_Generos: true,
                                        Autores: [],
                                        Genero: [],
                                        Playlists: [],
                                        Historico: {
                                            Autores: [],
                                            Musicas: [],
                                            Playlists: [],
                                            Users: []
                                        }
                                    },
                    
                                    Personalizar: {
                                        Background: null,
                                        FotoPerfil: null,
                                        BackgroundEmail: RandomColor()
                                    }
                                }
                    
                                //* Vai apagar a chave do user --------------------
                                ArrayChavesDeAcesso.splice(c, 1)

                                db.collection('Chaves').doc(ChavesAcesso.id).update({ChavesDeAcesso: ArrayChavesDeAcesso}).then(() => {
                                    //? Vai salvar a conta do user
                                    db.collection('Users').add(ContaUser).then(() => {
                                        location.href = 'MusiVerse.html'
                                    }).catch((e) => {
                                        alert('Error ao tentar criar o user: ' + e)
                                    })
                                }).catch((e) => {
                                    alert('Error ao tentar criar o user: ' + e)
                                })

                            }).catch(error => {
                                console.warn('Error: ', error)
                                
                                if(error.code == 'auth/email-already-in-use') {
                                    alert('Email já cadastrado! Use outro Email ou faça login com essa conta.')
                                    document.getElementById('CarregamentoTela1').style.display = 'none'
                                }
                            })
                        }
                    } catch{
                        alert('Chave não reconhecida')
                    }
                }

                if(!chave_encotrada) {
                    document.getElementById('CarregamentoTela1').style.display = 'none'
                    alert('Chave não reconhecida!')
                }
            })
        })
    }
}

//* ----------------------------------- Login ---------------------------------------
const Email_User_Login = document.getElementById('Email_User_Login')
const Senha_User_Login = document.getElementById('Senha_User_Login')

document.getElementById("form_login").addEventListener("submit", function(event) {
    event.preventDefault()
})

document.getElementById("form_login_mobile").addEventListener("submit", function(event) {
    event.preventDefault()
}) 

function FazerLogin() {
    if(Email_User_Login.value.trim() != '' && Senha_User_Login.value.trim() != '') {
        
        firebase.auth().signInWithEmailAndPassword(Email_User_Login.value, Senha_User_Login.value).then(() => {
            location.href = 'MusiVerse.html'
    
        }).catch((error) => {
            if(error.code == 'auth/wrong-password') {
                alert('Senha errada, tente novamente com outra senha.')
            }
        })
    } else {
        alert("Preencha todos os campos por favor.")
    }
}

//* -------------------------------- Mobile -----------------------------------
let tela_login = true
const article_login_mobile = document.getElementById('article_login_mobile')
const article_cadastro_mobile = document.getElementById('article_cadastro_mobile')

function Trocar_tela() {
    if(tela_login) {
        tela_login = false
        article_login_mobile.style.top = '150vh'
        article_cadastro_mobile.style.top = '50vh'
        
        setTimeout(() => {
            article_login_mobile.style.display = 'none'
            article_login_mobile.style.top = '-100vh'

            setTimeout(() => {
                article_login_mobile.style.display = 'flex'
            }, 100)
        }, 800)
    } else {
        tela_login = true

        article_cadastro_mobile.style.top = '150vh'
        article_login_mobile.style.top = '50vh'

        setTimeout(() => {
            article_cadastro_mobile.style.display = 'none'
            article_cadastro_mobile.style.top = '-100vh'

            setTimeout(() => {
                article_cadastro_mobile.style.display = 'flex'
            }, 100)
        }, 800)
    }
}

//* Atualizar inputs
function Atualizar_Input(input) {
    //* Pc atualizando os mobiles
    if(!input.id.includes('_Mobile')) {
        document.getElementById(`${input.id}_Mobile`).value = input.value
    } else {
        let id_input = input.id
        id_input = id_input.split('_Mobile').join("")

        document.getElementById(id_input).value = input.value
    }
}