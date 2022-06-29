import logo from './logo.svg';
import './App.css';
import {
  Route, BrowserRouter as Router, Routes, useParams, Link, useNavigate,
} from 'react-router-dom'; 
import { useState, useContext } from 'react';
import { useEffect } from 'react';
import {initialState,langContext} from './context/lang-context';
import {logged,logInContext} from './context/login';
import PokemonList from './components/PokemonList';
import Battle from './components/Battle';



function App() {
  const [language,setLanguage] = useState(initialState);
  const [logIn,setLogIn] = useState(logged);

  const changeLanguage = (language) => setLanguage(prevLanguage=>({...prevLanguage,language}));
  const verifyLogIn = ()=>setLogIn(true);

  return (
    <langContext.Provider value={{...language,changeLanguage}}>
      <logInContext.Provider value={{logIn,verifyLogIn}}>
        <Router>
          <div className="container">
            <NavBar/>
            <Routes>
              <Route path='/' element={<Home />}/>
              <Route path='/pokemon/:pokemon' element={<Pokemon />} />
              <Route path='/type/:type' element={<Type />} />
              <Route path='/pokemon/' element={<PokemonList/>}/>
              <Route path='/pokemon/battle' element={<Battle/>}/>
              <Route path='*' element={<NotFound />} />
            </Routes>  
          </div>
          
        </Router>  
      </logInContext.Provider>
    </langContext.Provider>
    
  );
}

function SearchBar() {
  const navigate = useNavigate();

  function search(e) {
    if (e.key === 'Enter') {
      navigate('/pokemon/' + e.target.value);
    }
  }

  return (
    <div className='navbar-search'>
      <i className="fas fa-search"></i>
      <input type="text" className='searchbar' onKeyDown={search} placeholder='Cerca pokemon'/>
    </div>
  )
}

function NavBar() {
  const {changeLanguage} = useContext(langContext);
  const {logIn} = useContext(logInContext);

  function handleLanguage(e){
    e.preventDefault();
    changeLanguage(e.target.value);
  }

  return (
    <div className='navbar'>
      <select onChange={handleLanguage}>
        <option value="it">it</option>
        <option value="en">en</option>
      </select>
      <Link to={`/`}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png" className='img-logo' alt="logo pokemon" /></Link>
      {logIn && <SearchBar/>}
    </div>
  )
}

function Home() {
  const {messages,language} = useContext(langContext);
  const {logIn, verifyLogIn} = useContext(logInContext);
  // const ctx = useContext(logInContext);
  // console.log(ctx);


  return (
    <>
      <h1>{messages.searchPokemon[language]}</h1>
      <button onClick={verifyLogIn}>LogIn</button>
      {logIn && <div className='features-container'>
        
          <Link to={`/pokemon/`} className='features-link'>
            <div className="features n1">
              Pokemon List
            </div>
          </Link>  

          <Link to={`/pokemon/battle`} className='features-link'>
            <div className="features n2">
              Battle
            </div>
          </Link> 
       
        
      </div>
        
      }
      
    </>
  )
}

function Pokemon() {
  const {pokemon} = useParams();
  const [json,updateJson] = useState();
  const [isLoading,setIsLoading] = useState(true);
  const [displayMoves,setDisplayMoves] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch (`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(res=>res.json())
    .then(json=>{
      setIsLoading(false);
      updateJson(json);
      
    })
    .catch(error=>{
      console.log(error);
      navigate('/notFound');
    })
  }, [pokemon]);

  if (isLoading===true){
    return(
      <h1>Caricamento in corso</h1>
    )
  }



  function showMoves() {
    if (displayMoves===false){
      setDisplayMoves(true);
    }else{
      setDisplayMoves(false);
    }
  }

  return (
    <div className='pokemon'>
        <h1>{json.name}</h1>
        <img src={json.sprites.front_default} alt="" className='pokemon-profile' />
        <h3>Tipo</h3>
        <ul className='pokemon-type'>
          {json.types.map((item, key) => 
            <li key={key}>{item.type.name}</li>)}
        </ul>
        
        <button type='button' onClick={showMoves}>{displayMoves && "Nascondi"} {!displayMoves && "Mostra"}</button>
        {displayMoves && <ul>
          {json.moves.map((item,key)=><li key={key}>{item.move.name}</li>)}
        </ul>}     
      
    </div>

  )
}

function Type() {
  const {type} = useParams();
  const [json,updateJson] = useState();
  const [isLoading,setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch (`https://pokeapi.co/api/v2/type/${type}`)
    .then(res=>res.json())
    .then(json=>{
      setIsLoading(false);
      updateJson(json);
    })
    .catch(error=>{
      console.log(error);
      navigate('/notFound');
    })
  }, [type]);

  if (isLoading===true){
    return(
      <h1>Caricamento in corso</h1>
    )
  }

  return (
    <>
      <h2>Tipo:{json.name}</h2>
      <ul>
        double_damage_from
        {json.damage_relations.double_damage_from.map((item, key) => <li key={key}>{item.name}</li>)}
      </ul>
    </>
  ) 
}

function NotFound() {
  return (
    <h1>404</h1>
  )
}

export default App;
