const btn_full_screen = document.getElementById('btn_full_screen')
const tela_fullscreen = document.getElementById('tela_fullscreen')
const video_tela_fullscreen = document.getElementById('video_tela_fullscreen')

btn_full_screen.addEventListener('click', () => {
    console.log('clicou');
    Adicionar_Video_Tela_FullScrenn()
})

function Adicionar_Video_Tela_FullScrenn() {
    if(MusicaTocandoAgora.Clip) {
        console.log('Era paar');
        tela_fullscreen.style.display = 'flex'
        video_tela_fullscreen.src = MusicaTocandoAgora.Clip
    }
}