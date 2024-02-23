// Função para gerenciar a presença do usuário
function gerenciarPresencaUsuario() {
    // Referência para o nó de presença
    var presenceRef = db.collection('Presence')

    // Detecta a conexão do usuário
    var connectedRef = firebase.firestore.FieldValue.serverTimestamp()
    
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // Se estiver conectado, registre a presença do usuário
            var userPresenceRef = presenceRef.doc(user.email)
            let ID_MusicaTocandoAgora = null

            if(MusicaTocandoAgora.ID) {
                ID_MusicaTocandoAgora = MusicaTocandoAgora.ID
            }

            userPresenceRef.set({ 
                Online: true,
                LastScreen: connectedRef,
                Ouvindo: {
                    ID: ID_MusicaTocandoAgora
                }
            })

            // Quando o usuário se desconectar, remova a presença
            window.addEventListener("beforeunload", function() {
                let Ouvindo = {
                    ID: null
                }
                userPresenceRef.update({ Online: false, Ouvindo: Ouvindo })
            })
        }
    })

    // Monitora as mudanças na presença dos usuários
    presenceRef.onSnapshot(function(snapshot) {
        let Amigos = currentUser.User.InfosPerfil.Amigos.Aceitos
    
        snapshot.docs.forEach(Users => {
            let userID = Users.id
            let userData = Users.data()
    
            for(let c = 0; c < Amigos.length; c++) {
                if(Amigos[c] == userID) {
                    Carregar_Amigos(userID, userData)
                    break // Sai do loop assim que encontrar um amigo
                }
            }
        })
    })
}

//* Atualizar música ouvindo agora
function Atualizar_Musica_Ouvindo_Amigo(Email, ID) {
    let Ouvindo = {
        ID
    }
    db.collection('Presence').doc(Email).update({ Ouvindo: Ouvindo})
}