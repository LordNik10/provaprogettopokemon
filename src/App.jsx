import logo from './logo.svg';
import './App.css';
import {
  Route, BrowserRouter as Router, Routes, useParams, Link, useNavigate,
} from 'react-router-dom'; 
import { useState, useContext } from 'react';
import { useEffect } from 'react';
import {initialState,langContext} from './context/lang-context';
import {logged,logInContext} from './context/login';



function App() {
  const [language,setLanguage] = useState(initialState);
  const [logIn,setLogIn] = useState(logged);

  const changeLanguage = (language) => setLanguage(prevLanguage=>({...prevLanguage,language}));
  const verifyLogIn = ()=>setLogIn(true);

  return (
    <langContext.Provider value={{...language,changeLanguage}}>
      <logInContext.Provider value={(logIn,verifyLogIn)}>
        <Router>
          <NavBar/>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/pokemon/:pokemon' element={<Pokemon />} />
            <Route path='/type/:type' element={<Type />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
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
      <input type="text" className='searchbar' onKeyDown={search} />
    </div>
  )
}

function NavBar() {
  const {changeLanguage} = useContext(langContext);


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
      <SearchBar/>
    </div>
  )
}

function Home() {
  const {messages,language} = useContext(langContext);
  

  // function pressLogIn(){
  //   verifyLogIn();
  // }
  // const ctx = useContext(langContext);
  // console.log(ctx);
  return (
    <>
      <h1>{messages.searchPokemon[language]}</h1>
      <button>LogIn</button>
    </>
  )
}

function Pokemon() {
  const {pokemon} = useParams();
  const [json,updateJson] = useState();
  const [isLoading,setIsLoading] = useState(true);
  const [type,setType] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch (`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then(res=>res.json())
    .then(json=>{
      setIsLoading(false);
      updateJson(json);
      setType([]);
      // for (let i=0;i<json.types.length;i++){
      //   let obj = {
      //     number: 0,
      //     nome:""
      //   }
      //   let number = json.types[i].type.url.split("/");
      //   obj.number=number[6];  
      //   obj.nome=json.types[i].type.name;
      //   console.log(obj);
      //   setType(prevType=>[{...prevType},obj]);
      // }

      console.log(type);
      
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


  // function showMoves() {
  //   setDisplayMoves(display => !display);
  // }

  return (
    <div className='pokemon'>
        {type}
        <h1>{json.name}</h1>
        <img src={json.sprites.front_default} alt="" className='pokemon-profile' />
        <h3>Tipo</h3>
        <ul className='pokemon-type'>
          {type.map((item, key) => 
            <li key={key}><Link to={`/type/${item.number}`}>{item.nome}</Link> </li>)}
        </ul>
        
        {/* <button type='button' onClick={showMoves}>
          {displayMoves ? "Nascondi" : "Mostra"}
        </button> */}
        <ul>
          {json.moves.map((item,key)=><li key={key}>{item.move.name}</li>)}
        </ul>     
      
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
