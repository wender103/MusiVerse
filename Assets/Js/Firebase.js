const firebaseConfig = {
    apiKey: "AIzaSyDcxRheDy1LJCMrC_TPt5QTdomVBnRIRVU",
    authDomain: "musiverse-e89c0.firebaseapp.com",
    projectId: "musiverse-e89c0",
    storageBucket: "musiverse-e89c0.appspot.com",
    messagingSenderId: "750244530290",
    appId: "1:750244530290:web:4c19979dd17d232eb39aeb"
}

  // Initialize Firebase
firebase.initializeApp(firebaseConfig)
const provider = new firebase.auth.GoogleAuthProvider()
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

let currentUser = {} //? Vai conter as informações do user
let TodosOsUsers = []
document.addEventListener("DOMContentLoaded", function () {
  //? Obeserva se há um usuário e mudanças na autenticação (login, logout)
  firebase.auth().onAuthStateChanged((usuario) => {
    if(usuario) {
      currentUser.InfoEmail = usuario

      db.collection('Users').get().then((snapshot) => {
        let contador = 0
        // console.log('Chamada feita, carregar info user')

        snapshot.docs.forEach(Users => {
            const InfoUsers = Users.data()

            TodosOsUsers.push({
              User: InfoUsers
            })

            TodosOsUsers[contador].User.Id = Users.id
           
            if(InfoUsers.Email == currentUser.InfoEmail.email) {
              currentUser.User = InfoUsers
              currentUser.User.Id = Users.id

              try {
                Escolher_Generos_Musicais()
              } catch (error){console.warn(error)}

              try {
                Checar_Se_Tem_Pedidos()
              } catch (error) {
                console.warn(error)
              }

              try {
                if(currentUser.InfoEmail.photoURL != null) {
                  const imgPerfilUser = document.getElementById('imgPerfilUser')
                  imgPerfilUser.src = currentUser.InfoEmail.photoURL
                  imgPerfilUser.style.display = 'block'
        
                  document.getElementById('imgPerfilUserHeaderUser').style.backgroundImage = `url(${currentUser.InfoEmail.photoURL})`
                  document.getElementById('imgPerfilUserNavCell').style.backgroundImage = `url(${currentUser.InfoEmail.photoURL})`
                } else {
                  //? Vai colocar a primeira letra do email e um background que foi salvo
                  const containerUserNavBar = document.getElementById('containerUserNavBar')
                  containerUserNavBar.style.background = currentUser.User.Personalizar.BackgroundEmail
                  const LetraNomePerfilUser = document.getElementById('LetraNomePerfilUser')
                  LetraNomePerfilUser.innerText = currentUser.InfoEmail.email.charAt(0).toUpperCase()
                  LetraNomePerfilUser.style.display = 'block'

                  const imgPerfilUserNavCell = document.getElementById('imgPerfilUserNavCell')
                  imgPerfilUserNavCell.style.background = currentUser.User.Personalizar.BackgroundEmail
                  const LetraNomePerfilUserNavCell = document.getElementById('LetraNomePerfilUserNavCell')
                  LetraNomePerfilUserNavCell.innerText = currentUser.InfoEmail.email.charAt(0).toUpperCase()
                  LetraNomePerfilUserNavCell.style.display = 'block'
                }
                
              } catch{
                //? Vai colocar a primeira letra do email e um background que foi salvo
                try {
                  const containerUserNavBar = document.getElementById('containerUserNavBar')
                  containerUserNavBar.style.background = currentUser.User.Personalizar.BackgoundEmail
                  const LetraNomePerfilUser = document.getElementById('LetraNomePerfilUser')
                  LetraNomePerfilUser.innerText = currentUser.InfoEmail.email.charAt(0).toUpperCase()
                  LetraNomePerfilUser.style.display = 'block'
                  
                  
                  const imgPerfilUserNavCell = document.getElementById('imgPerfilUserNavCell')
                  imgPerfilUserNavCell.style.background = currentUser.User.Personalizar.BackgoundEmail
                  const LetraNomePerfilUserNavCell = document.getElementById('LetraNomePerfilUserNavCell')
                  LetraNomePerfilUserNavCell.innerText = currentUser.InfoEmail.email.charAt(0).toUpperCase()
                  LetraNomePerfilUserNavCell.style.display = 'block'
                } catch {}
              }

              try {
                Atualizar_Presenca(true, currentUser.InfoEmail.email, MusicaTocandoAgora.ID)
              } catch{}
            }

          contador++
        })

        try {
          obterValoresDaURL('All')
        } catch{}
      }).catch((e) => {
        // location.href = `Error.html`
    })
    } else {
      // Obtém a URL atual
      var url = window.location.href

      // Divide a URL em partes usando a barra '/'
      var partesDaURL = url.split('/')

      // Obtém a última parte da URL, que é o nome do arquivo
      var nomeDoArquivo = partesDaURL[partesDaURL.length - 1]

      if(nomeDoArquivo != 'Cadastro.html' && nomeDoArquivo != 'Error.html') {
        location.href = `Cadastro.html`
      }
    }
  })
})

// Função para gerar um UID único
function generateUniqueUid() {
  return db.collection('MusicasPostadas').doc().id
}

function login() {
  auth.signInWithPopup(provider)
}

try {
  document.getElementById('containerUserNavBar').addEventListener('click', () => {
    location.href = 'Cadastro.html'
  })

  document.getElementById('btn_abrir_perfil_cell').addEventListener('click', () => {
    abrirMeuPerfil()
    AbrirPaginas('MeuPerfil')
  })
} catch{}

function Checar_Estado_Site() {
  return new Promise((resolve, reject) => {
    db.collection('Site').limit(1).get().then((snapshot) => {
      snapshot.docs.forEach(SiteInfo => {
        let Site = SiteInfo.data()
        if (Site.Estado == 'Suspenso') {
          location.href = 'Error.html';
          reject("Site suspenso")
        } else {
          resolve()
        }
      });
    }).catch(error => {
      reject(error)
    })
  })
}

function Checar_Infos_Site() {
  db.collection('Site').onSnapshot((data) => {
    data.docs.map(function(SiteInfo) {
        let Site = SiteInfo.data()
        if(Site.Estado != 'Suspenso' && location.href.includes('Error.html')) {
            location.href = 'MusiVerse.html'
        } else if(Site.Estado == 'Suspenso' && !location.href.includes('Error.html')) {
          location.href = 'Error.html'
        }
    })
  })

} Checar_Infos_Site()