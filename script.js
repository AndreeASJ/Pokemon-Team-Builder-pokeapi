// Almacena los pokemones que se han agregado.

let pokemones = [];
let equipoActual = [];
let equiposGuardados = [];

// Agrega un evento de escucha al botón "submitButton" que se activa al hacer clic.
document.getElementById('submitButton').addEventListener('click', async function () {
    if (equipoActual.length < 3) {
        let input = document.getElementById('pokemonName').value;
        input = input.trim().toLowerCase(); // Convierte el input a minúsculas y elimina espacios en blanco
        await displayPokemon(input);
    }
});

// Agrega un evento de escucha al botón "historial"
document.getElementById('historial').addEventListener('click', function () {
    showTeams();
});

// Agrega un evento de escucha al botón "resetButton"
document.getElementById('resetButton').addEventListener('click', function () {
    reset();
});

// Función asincrónica que obtiene los datos de un Pokémon de la API.
async function getPokemon(input) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null; // Devuelve null si hay un error
    }
}

// Función async que muestra un Pokémon en la interfaz si el equipo aun no está lleno.
async function displayPokemon(input) {
    const pokemon = await getPokemon(input);
    if (pokemon) {
        if (equipoActual.length < 3) {
            pokemones.push(pokemon);
            equipoActual.push(pokemon);
            if (equipoActual.length === 3) {
                document.getElementById('submitButton').disabled = true;
                document.getElementById('pokemonName').disabled = true;
                document.getElementById('historial').disabled = false;
                document.getElementById('resetButton').disabled = false;
                document.getElementById('guardarEquipo').disabled = false; // Enable "Guardar Equipo" button
            }
            console.log(pokemon);
            renderPokemon(pokemon, 'pokemon-container');
        }
    } else {
        alert('Error: No se encontró el Pokémon. Por favor, verifica el nombre o ID.');
    }
}

// Renderiza la información de un Pokémon en la interfaz
function renderPokemon(pokemon, containerId) {
    const container = document.getElementById(containerId);
    const element = document.createElement('div');
    element.innerHTML = `
        <div>
            <img src=${pokemon.sprites.front_default}>
            <strong>Id:</strong> ${pokemon.id}
            <strong>Name:</strong> ${pokemon.name}
            <strong>Type:</strong> ${pokemon.types[0].type.name}
        </div>
    `;
    container.appendChild(element);
}

// Muestra los equipos guardados en la interfaz si existen
function showTeams() {
    if (equiposGuardados.length > 0) {
        equiposGuardados.forEach(team => {
        });
    } else {
        alert('No hay equipos guardados.');
    }
}

// Reinicia el equipo actual y habilita los elementos de la interfaz
function reset() {
    equipoActual = [];
    document.getElementById('submitButton').disabled = false;
    document.getElementById('pokemonName').disabled = false;
    document.getElementById('historial').disabled = equiposGuardados.length === 0; // Enable "Mostrar Equipos" button if there are saved teams
    document.getElementById('resetButton').disabled = true;
    document.getElementById('guardarEquipo').disabled = true;
    document.getElementById('pokemon-container').innerHTML = '';
}

// Agrega un evento de escucha al botón "guardarEquipo"
document.getElementById('guardarEquipo').addEventListener('click', function () {
    if (equipoActual.length === 3) {
        equiposGuardados.push([...equipoActual]);
        alert('Equipo guardado correctamente.');
        reset();
    } else {
        alert('El equipo debe tener 3 pokemones.');
    }
});

// Renderiza los equipos guardados en la interfaz
function renderTeams() {
    const container = document.getElementById('teams-container');
    container.innerHTML = ''; // Clear previous content
    equiposGuardados.forEach((team, index) => {
        const teamElement = document.createElement('div');
        teamElement.classList.add('team');
        teamElement.innerHTML = `<strong>Equipo ${index + 1}:</strong>`;
        team.forEach(pokemon => {
            const pokemonElement = document.createElement('div');
            pokemonElement.classList.add('pokemon');
            pokemonElement.innerHTML = `
                <div>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <div><strong>ID:</strong> ${pokemon.id}</div>
                    <div><strong>Name:</strong> ${pokemon.name}</div>
                    <div><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</div>
                </div>
            `;
            teamElement.appendChild(pokemonElement);
            // Renderiza cada Pokémon del equipo guardado
        });
        container.appendChild(teamElement);
    });
}

// Agrega un evento de escucha al botón "historial"
document.getElementById('historial').addEventListener('click', function () {
    renderTeams();
});
