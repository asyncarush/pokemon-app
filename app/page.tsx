"use client"

import { useEffect, useState, useRef } from "react";
import {SearchedPokemon} from "@/typings"
import PokemonGrid from "@/components/PokemonGrid";
import Pagination from "@/components/Pagination";
import SearchResult from "@/components/Searchresult";

export default function Page() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState<SearchedPokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pokemonList, setPokemonList] = useState<SearchedPokemon[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 12;
  const abortRef = useRef<AbortController | null>(null);

  // List of Pokemons with Pagination
  useEffect(() => {
    setLoading(true);
    setError("");
    
    if (abortRef.current) abortRef.current.abort();
    
    const controller = new AbortController();
    abortRef.current = controller;
    
    const offset = (page - 1) * PAGE_SIZE;
    
    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
          { signal: controller.signal }
        );  
        
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        setTotal(data.count);
        
        const pokemons = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url, { signal: controller.signal });
            const details = await res.json();
            return {
              name: details.name,
              image: details.sprites.other["official-artwork"].front_default,
              id: details.id,
            };
          })
        );
        
        if (!controller.signal.aborted) setPokemonList(pokemons);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message ?? "Failed to fetch");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchPokemonList();

    // this will abort the preiovus page call to reduce the number of requests
    return () => controller.abort();
  }, [page]);

  // debounce Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex flex-col justify-between h-full items-center bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 rounded-lg w-full max-w-7xl md:h-[90vh] overflow-hidden">
      <div className="flex flex-col w-full items-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold pt-8 bg-gradient-to-r from-blue-400 via-yellow-300 to-red-500 bg-clip-text text-transparent drop-shadow-lg select-none">Pokémon Search</h1>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name e.g. Pikachu"
          className="mt-8 rounded-lg focus:ring-2 focus:ring-yellow-400/60 focus:outline-none bg-slate-700/80 placeholder-gray-300 p-3 w-11/12 sm:w-2/3 md:w-1/2"
        />

        {error && <p className="text-red-400 mt-4">{error}</p>}
        {loading && (
          <div className="mt-6 animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent" />
        )}

        {pokemon && !loading && !error && (
          <SearchResult pokemon={pokemon} />
        )}
      </div>
      
      <div>
        <div>
          <PokemonGrid pokemonList={pokemonList} />
          <Pagination page={page} setPage={setPage} total={total} pageSize={PAGE_SIZE} />
        </div>
      </div>
    </div>
  );
}






