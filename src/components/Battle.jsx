import { useEffect, useState } from "react";

const generaPokemon = () => Math.round(Math.random()*500);

function Battle (){
  const pokemon1 = Math.round(Math.random()*500);
  const pokemon2 = generaPokemon();

  const [pokemonJson1,setPokemonJson1] =useState();
  const [hpPokemon1,sethpPokemon1] = useState();
  const [hpPokemon2,sethpPokemon2] = useState();
  const [pokemonJson2,setPokemonJson2] =useState();
  const [isLoading1,setIsLoading1] = useState(true);
  const [isLoading2,setIsLoading2] = useState(true);
  const [turn,setTurn] = useState(0);

    useEffect(()=>{
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon1}`)
        .then(res=>res.json())
        .then(json=>{
          setPokemonJson1(json);
          sethpPokemon1(json.stats[0].base_stat*10);
          setIsLoading1(false);
        })
    },[])

    useEffect(()=>{
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2}`)
        .then(res=>res.json())
        .then(json=>{
          setPokemonJson2(json);
          sethpPokemon2(json.stats[0].base_stat*10);
          setIsLoading2(false);
        })
    },[])


    function handleAttacckPokemon1(e){
      sethpPokemon2(prevHp=>prevHp-e.target.textContent);
      setTurn(prevTurn=>prevTurn+1);
    }

    function handleAttacckPokemon2(e){
      sethpPokemon1(prevHp=>prevHp-e.target.textContent);
      setTurn(prevTurn=>prevTurn-1);
    }

    const styleTurn={
      border: '1px solid red'
    };

    return(
      <>
        {isLoading1 && isLoading2 && <h1>Caricamento battaglia in corso</h1>}
        {!isLoading1 && !isLoading2 &&
          <>
            <h1>Battle</h1>
            <div className="battle-container">
              <div className="pokemon1-container" style={turn==0 ? styleTurn: null}>
                {/* <Pokemon 
                  name={pokemonJson1.name} 
                  imageProfile={pokemonJson1.sprites.front_default} 
                  hp={pokemonJson1.stats[0].base_stat} 
                  moves={pokemonJson1.moves}
                /> */}
                {hpPokemon2<=0 ? <h1>Il giocatore 1 ha vinto</h1> : null}
                {turn===0 ? <h2>E' il tuo turno</h2>: null}
                <h2>{pokemonJson1.name}</h2>
                <img src={pokemonJson1.sprites.front_default} alt="" />
                <h3>HP rimasti: {hpPokemon1} </h3>
                {pokemonJson1.moves.map(el=><li key={el.move.url} >{el.move.name} <span onClick={turn === 0 ? handleAttacckPokemon1 : ()=>null}><PokemonMoves url={el.move.url}/></span></li>)}
              </div>
              
              <div className="pokemon2-container" style={turn==1 ? styleTurn: null}>
              {hpPokemon1<=0 ? <h1>Il giocatore 2 ha vinto</h1> : null}
              {turn===1 ? <h2>E' il tuo turno</h2>: null}
              <h2>{pokemonJson2.name}</h2>
                <img src={pokemonJson2.sprites.front_default} alt="" />
                <h3>HP rimasti: {hpPokemon2} </h3>
                {pokemonJson2.moves.map(el=><li key={el.move.url} >{el.move.name} <span onClick={turn === 1 ? handleAttacckPokemon2 : ()=>null}><PokemonMoves url={el.move.url}/></span></li>)}
              </div>
              
            </div>
          </>
        
        }
      </>
      
    )
}

function Pokemon ({name,imageProfile,hp,moves,hpEnemy}){

  const [hpPokemon,setHpPokemon] = useState(hpEnemy);

  function handleD(e){
    setHpPokemon(prevHp=>prevHp-e.target.textContent);
  }

  return(
    <>
      <h2>{name}</h2>
      <img src={imageProfile} alt={name} />
      <div className="prova">
        <h3>HP rimasti: {hp}</h3>
        <h3>HP rimasti2: {hpPokemon}</h3>
      </div>
      
      {moves.map(el=><li key={el.move.url}>{el.move.name} <span onClick={handleD}><PokemonMoves url={el.move.url}/></span></li>)}
    </>
    
  )
}

function PokemonMoves({url}){
  let id = url.split('/');
  id=id[6];
  const movesStyle={
    cursor:'pointer'
  }
  const [moves,setMoves] = useState();
  const [isLoading,setIsLoading] = useState(true);

  useEffect(()=>{
    fetch(`https://pokeapi.co/api/v2/move/${id}/`)
      .then(res=>res.json())
      .then(json=>{ 
        setMoves(json);
        setIsLoading(false);
      })
  },[id])


  if (isLoading){
    return(
      <span>Caricamento mosse...</span>
    )
  }

  return(
    <>
      <b style={movesStyle}>{moves.power}</b>
    </>
  )

}
  
export default Battle;
