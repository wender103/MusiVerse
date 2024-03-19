// Função para gerenciar a presença do usuário
function gerenciarPresencaUsuario() {
    // Inicializa a atualização de presença a cada 5 minutos
    setInterval(() => {
        Atualizar_Presenca(true, currentUser.InfoEmail.email, MusicaTocandoAgora.ID);
    }, 2 * 60 * 1000); // 5 minutos em milissegundos

    // Monitora as mudanças na presença dos usuários
    db.collection('Presence').onSnapshot(function(snapshot) {
        let Amigos = currentUser.User.InfosPerfil.Amigos.Aceitos
    
        snapshot.docs.forEach(Users => {
            let userID = Users.id
            let userData = Users.data()
    
            for(let c = 0; c < Amigos.length; c++) {
                if(Amigos[c] == userID) {
                    Atualizar_Amigo(userID, userData).then((resp) => {
                        if(resp == 'Amigo não encontrado') {
                            Carregar_Amigos(userID, userData)
                        }
                    })
                    break; // Sai do loop assim que encontrar um amigo
                }
            }
        })
    })
}

// Quando o usuário se desconectar, remova a presença
window.addEventListener("beforeunload", function() {
    Atualizar_Presenca(false, currentUser.InfoEmail.email, null);
})

// Função para enviar informações de presença para a API
function Atualizar_Presenca(IsOnline = false, Email, MusicaID) {
    try {
        // fetch('http://localhost:3000/api/updatePresence', {
        fetch('https://apipresenca.onrender.com/api/updatePresence', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: Email,
                isOnline: IsOnline,
                listeningMusicId: MusicaID,
                colorimg: cor_escolhida_background
            }),
        })
        .then(response => {
            if (response.ok) {
                // console.log('Informações de presença enviadas com sucesso para a API');
            } else {
                // console.warn('Erro ao enviar informações de presença para a API');
            }
        })
        .catch(error => {
            // console.error('Erro de rede ao enviar informações de presença para a API:', error);
        });
    } catch (error) {
        // console.warn(error)
    }
}

//* Atualizar no dc
function Atualizar_Perfil_DC(Musica) {
    const requestData = {
        state: `De: ${Musica.Autor}`,
        details: `Ouvindo: ${Musica.NomeMusica}`,
        largeImageKey: Musica.LinkImg,
        largeImageText: Musica.NomeMusica,
    }
    
    try {
        // fetch('http://localhost:3000/prececa/dc', {
        fetch('https://api-presenca-dc.vercel.app/prececa/dc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .catch(error)
    } catch (error) {
        // console.warn(error)
    }
}