import {createContext} from "react";

export const langContext = createContext();

export const initialState = {
    language:"it",
    messages:{
        searchPokemon: {
            it:"Cerca pokemon",
            en:"Search pokemon"
        }
    }
}