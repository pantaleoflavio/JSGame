let position = 'room1';
let userPrompt;
const azioni = ['raccogli', 'combatti', 'borsa', 'muovi']
let borsa = []

// Funzione per leggere il contenuto del Intro Gioco
async function leggiIntroStory() {
    try {
      // Ottieni il percorso del file TXT
      let startStory = 'start.txt';

      // fetch per ottenere il contenuto
      let response = await fetch(startStory);

      // gestione errori
      if (!response.ok) {
        throw new Error('Errore durante il recupero del file.');
      }

      // Leggi il contenuto del file
      let startGame = await response.text();

      // Stampare il contenuto del file
      console.log(startGame);
    } catch (error) {
      console.error('Si è verificato un errore:', error.message);
    }
}


async function getRoomsDataFromFile() {
try {
    // fetch
    const response = await fetch('rooms.json');

    // gestione errori
    if (!response.ok) {
        throw new Error('Errore durante il recupero della collezione di oggetti.');
    }

    const roomData = await response.json();
    
    // console.log(room.percorsi);
    // console.log(roomName);
    
    return roomData;
    } catch (error) {
    console.error('Si è verificato un errore:', error.message);
    }
}

// Carica i dati delle stanze dal file JSON e salvali nel Local Storage
async function initializeRoomsData() {
    // Carica i dati dal Local Storage
    const storedRoomsData = localStorage.getItem('rooms');
  
    // Se i dati sono presenti, restituiscili
    if (storedRoomsData) {
      return JSON.parse(storedRoomsData);
    }
  
    // Altrimenti, carica i dati dal file JSON
    const roomsData = await getRoomsDataFromFile();
  
    // Salva i dati nel Local Storage
    localStorage.setItem('rooms', JSON.stringify(roomsData));
  
    return roomsData;
}

// Funzione per leggere il contenuto delle Rooms in base alla posizione dell Eroe
async function allRooms(roomName) {

    const roomData = await initializeRoomsData()
    const room = roomData[roomName];
    
    return room;

    }

// Funzione per descrizione della stanza in base alla posizione dell'eroe
async function posizioneEroe(position) {
    const room = await allRooms(position);
    console.log('sei nella stanza ', position, room.descrizione)
    console.log('sono consentite le seguenti mosse: ', room.percorsi)  
    if (room.oggetti.length > 0) {
        if (room.oggetti.includes('principessa')) {
            console.log('nella stanza e presente la principessa! se vuoi salvarla premi raccogli');
        } else {
            console.log('nella stanza ci sono i seguenti oggetti: ', room.oggetti)
        }
    } else{
        console.log('nella stanza non ci sono oggetti')
    }

    if (room.mostro) {
        console.log('in questa stanza trovi un mostro: ', room.mostro, 'devi decidere se affrontarlo o meno')
    } else{
        console.log('nella stanza non c\'e nessuno')
    }

return room

}

async  function game(position) {
    while (!borsa.includes('principessa')) {

        let room = await posizioneEroe(position);
        console.log('hai le seguenti scelte: ', azioni, 'ricorda inserendo exit uscirai dal programma')
        //console.log(position)
        userPrompt = prompt('che cosa vuoi fare?: ')
        switch (userPrompt) {
            case 'muovi':
                userPrompt = prompt('hai scelto di muoverti, in che direzione vuoi andare?: ')
                if (position === 'room1') {
                    
                    if (userPrompt === 'est') {
                        position = 'room2'
                    } else if(userPrompt === 'sud') {
                        position = 'room4'
                    }

                } else if (position === 'room2') {

                    if (userPrompt === 'ovest') {
                        position = 'room1'
                    } else if(userPrompt === 'sud') {
                        position = 'room5'
                    } else if(userPrompt === 'est') {
                        position = 'room3'
                    }

                } else if (position === 'room3') {
                    if (userPrompt === 'ovest') {
                        position = 'room2'
                    }

                } else if (position === 'room4') {
                    if (userPrompt === 'nord') {
                        position = 'room1'
                    }

                } else if (position === 'room5') {
                    if (userPrompt === 'est') {
                        position = 'room6'
                    } else if(userPrompt === 'sud') {
                        position = 'room8'
                    }

                } else if (position === 'room6') {
                    //console.log('Valore di room.mostro:', room.mostro);
                    if (userPrompt === 'ovest') {
                        position = 'room5'
                    } else if(userPrompt === 'sud') {
                        if (room.mostro) {
                            console.log('non puoi proseguire fintanto che dracula vive')
                        } else {
                            position = 'room9'
                        }
                    }

                } else if (position === 'room7') {

                    if (userPrompt === 'est') {
                        position = 'room8'
                    }

                } else if (position === 'room8') {

                    if (userPrompt === 'ovest') {
                        position = 'room7'
                    } else if(userPrompt === 'nord') {
                        position = 'room5'
                    }

                } else if (position === 'room9') {
                    //console.log('nella stanza e presente la principessa! se vuoi salvarla premi raccogli');
                    if (userPrompt === 'est') {
                        position = 'room2'
                    } else if(userPrompt === 'sud') {
                        position = 'room4'
                    }
                }

                break;
            case 'raccogli':
                if (Array.isArray(room.oggetti) && room.oggetti.length > 0) {
                    borsa = borsa.concat(room.oggetti)
                    // Svuota l'array room.oggetti
                    room.oggetti = [];

                    // Aggiorna il Local Storage
                    updateLocalStorage(position, room);

                } else {
                    console.log('hai scelto raccogli, ma la stanza e vuota')
                }

                break;
            case 'combatti':
                if (room.mostro) {
                    if (room.mostro === 'medusa' && borsa.includes('shield')) {
                        console.log('hai ucciso medusa')

                       // Svuota la stringa room.mostro
                        room.mostro = '';

                        // Aggiorna il Local Storage
                        updateLocalStorage(position, room);


                    } else if (room.mostro === 'medusa'){
                        console.log('sei stato ucciso da medusa')
                        localStorage.clear()
                        return;
                    }

                    if (room.mostro === 'dracula' && borsa.includes('spada')) {
                        console.log('hai ucciso dracula')

                        // Svuota la stringa room.mostro
                        room.mostro = '';

                        // Aggiorna il Local Storage
                        updateLocalStorage(position, room);



                    } else if (room.mostro === 'dracula') {
                        console.log('sei stato violentato da dracula')
                        localStorage.clear()
                        return;
                    }

                } else {
                    console.log('hai scelto di combattere, ma la stanza e vuota, dovrai combattere contro i tuoi demoni')
                }
                break;
            case 'borsa':
                if (borsa.length > 0) {
                    console.log('la tua borsa contiene i seguenti oggetti: ', borsa)  
                } else {
                    console.log('la tua borsa e vuota')
                }
                break;
            case 'exit':
                console.log('Hai scelto di uscire dal programma.');
                localStorage.clear()
                return;
            default:
                console.log('azione non valida')
                break;
        }
    }
    console.log('Hai trovato la principessa! Fine del gioco.');
    localStorage.clear()
}
    
// Funzione per aggiornare il Local Storage
function updateLocalStorage(position, room) {
    // Leggi i dati correnti dal Local Storage
    const storedRoomsData = localStorage.getItem('rooms');
  
    if (storedRoomsData) {
      const storedRooms = JSON.parse(storedRoomsData);
  
      // Modifica i dati della stanza
      storedRooms[position] = room;
  
      // Aggiorna il Local Storage
      localStorage.setItem('rooms', JSON.stringify(storedRooms));
 
    }
  }

// Chiama le funzioni
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        leggiIntroStory();
        
    }, 1000);
    
    setTimeout(() => {
        game(position)
        
    }, 3000);
  });