const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
let modal = document.getElementById('modal')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <button id="${pokemon.number}" class="pokemon-card" onClick="selectPokemon(${pokemon.number})">
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
        </button>
    `
}

const selectPokemon = async (id) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url)
    const pokemon = await response.json()
    displayCard(pokemon)
}

const displayCard = (pokemon) => {
    const types = pokemon.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    const pokeAbilities = pokemon.abilities.map((abilities) => abilities.ability.name).join(', ');
    const baseStats = pokemon.stats.map((base_stats) => base_stats.base_stat)

    const weight = parseInt(pokemon.weight) / 10;
    const height = parseInt(pokemon.height) / 10;
 
    const photo = pokemon.sprites.other.dream_world.front_default

    modal.style.display = 'block';
    const newModal =  `
    <section class="contentModal ${pokemon.type}">
        <div class="headerModal">
            <Button class="closeBtn" onclick="closeCard()">X</Button>
            <div class="title-nameModal">
                <span class="nameModal">${pokemon.name}</span>
                <ol class="typesModal">
                    ${pokemon.types.map((type) => `<li class="typeModal ${type}">${type}</li>`).join('')}
                </ol>
            </div>
            <div class="title-numberModal">
                <span class="numberModal">#${pokemon.id}</span>
            </div>
        </div>
        <div class="imageModal">
            <img src="${photo}" alt="${pokemon.name}">
        </div>
        <div class="detailModal">
            <div class="titleInfo1Modal">
                <p>Attributes</p>
            </div>
            <div class="details">
                <div class="detail-title title1">
                    <p>Height</p>
                    <p>Weight</p>
                    <p>Base Exp</p>
                    <p>Abilities</p>
                </div>
                <div class="detail-description">
                    <p>${height}m</p>
                    <p>${weight}kg</p>
                    <p>${pokemon.base_experience}exp</p>
                    <p>${pokeAbilities}</p>
                </div>
            </div>
            <hr>
            <div class="titleInfo2Modal">
                <p>Base Stats</p>
            </div>
            <div class="details">
                <div class="details_left">
                    <div class="detail-title title2">
                        <p>HP</p>
                        <p>ATK</p>
                        <p>DEF</p>
                    </div>
                    <div class="detail-description">
                        <p>${baseStats[0]}</p>
                        <p>${baseStats[1]}</p>
                        <p>${baseStats[2]}</p>
                    </div>
                </div>
                <div class="details_right">
                    <div class="detail-title title2">
                        <p>SPATK</p>
                        <p>SPDEF</p>
                        <p>SPEED</p>
                    </div>
                    <div class="detail-description">
                        <p>${baseStats[3]}</p>
                        <p>${baseStats[4]}</p>
                        <p>${baseStats[5]}</p>
                    </div>
                </div>
                
                </div>
            </div>
        </div>
    </section>
    `

    modal.innerHTML += newModal;
}

function closeCard () {
    modal.style.display = 'none';
    modal.innerHTML = "";
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})