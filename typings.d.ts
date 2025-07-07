export interface SearchedPokemon {
  name : string;
  image : string;
  id : number;
}

export interface PokemonDetailsAPIResult {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string } }[];
  sprites: {
    other?: {
      [key: string]: { front_default?: string };
    };
    front_default?: string;
  };
}