import {createContext} from "react";

export const langContext = createContext();

export const initialState = {
    language:"it",
    messages:{
        searchPokemon: {
            it:"Effettuare Login per accedere alle funzioni",
            en:"Login to access all function"
        }
    }
}