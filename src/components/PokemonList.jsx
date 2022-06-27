import { useEffect, useState } from "react";
import {
  Route, BrowserRouter as Router, Routes, useParams, Link, useNavigate,
} from 'react-router-dom';

function PokemonList(){
  const [pokemonJson, setPokemonJson] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countPage, setCountPage] = useState(0);
  const [page,setPage] = useState(1);

  useEffect (()=>{
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${countPage}&limit=20`)
      .then(res=>res.json())
      .then(json=>{
        setPokemonJson(json);
        setIsLoading(false);
      })
  },[countPage]);

  function estraiPokemonId(url){
    let id = url.split('/');
    id=id[6];
    return id;
  }

  function handleChangePage(n){
    if (n===1){
      setCountPage(prevCountPage=>prevCountPage+20);
      setPage(prevPage=>prevPage+1);
    }else{
      if (page===1){
        return;
      }else{
        setCountPage(prevCountPage=>prevCountPage-20);
        setPage(prevPage=>prevPage-1);
      }
      
      
    }
    
  }

  return(
    <>
      {isLoading && <h1>Caricamento lista pokemon in corso</h1>}
        <div className="list-container">
          { !isLoading && 
            pokemonJson.results.map(el=><Link to={`/pokemon/${el.name}`} key={el.name}><img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${estraiPokemonId(el.url)}.png`} key={el.name}/></Link>)
          }  
        </div>
      <div className="button-container">
        {page !== 1 &&
          <button type="button" className="btn-page" onClick={() => handleChangePage(0)}>Prev</button>
        }
        <h3>{page}</h3>
        <button type="button" className="btn-page" onClick={() => handleChangePage(1)}>Next</button>

      </div>
      
      
    </>
  )

}

export default PokemonList;