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

  const [pageSize, setPageSize] = useState(12);
  const abortRef = useRef<AbortController | null>(null);

  // List of Pokemons with Pagination
  useEffect(() => {
    setLoading(true);
    setError("");
    
    if (abortRef.current) abortRef.current.abort();
    
    const controller = new AbortController();
    abortRef.current = controller;
    
    const offset = (page - 1) * pageSize;
    
    const fetchPokemonList = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`,
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
              image: details.sprites?.other?.["official-artwork"]?.front_default ?? null,
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
  }, [page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  // debounce Effect
  useEffect(() => {
    if (!search) {
      setPokemon(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");

    const controller = new AbortController();
    abortRef.current = controller;
    
    const timer = setTimeout(() => {
      const fetchPokemon = async () => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`,
            { signal: controller.signal }
          );
          if (!response.ok) throw new Error("Pokémon not found");
          const pokemonData = await response.json();
          const pokemonObject = {
            name: pokemonData.name,
            image: pokemonData.sprites?.other?.["official-artwork"]?.front_default ?? null,
            id: pokemonData.id,
          };
          setPokemon(pokemonObject);
        } catch (err: any) {
          setPokemon(null);
          setError(err.message ?? "Failed to fetch");
        } finally {
          setLoading(false);
        }
      };
      fetchPokemon();
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);


  useEffect(() => {
    function calculatePageSize(width: number) {
      if (width < 640) return 6; // sm and below
      if (width < 1024) return 8; // md
      return 12; // lg and above
    }

    const setResponsivePageSize = () => {
      setPageSize(calculatePageSize(window.innerWidth));
    };

    setResponsivePageSize(); 
    window.addEventListener("resize", setResponsivePageSize);

    return () => window.removeEventListener("resize", setResponsivePageSize);
  }, []);

  return (
    <div className="relative flex flex-col h-full items-center bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 rounded-lg w-full max-w-7xl md:h-[90vh] overflow-hidden">
      
      <div className="flex flex-col w-full items-center pt-8 pb-32 relative z-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-yellow-300 to-red-500 bg-clip-text text-transparent drop-shadow-lg select-none">Pokémon Search</h1>
        <div className="relative w-full flex flex-col items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name e.g. Pikachu"
            className="mt-8 rounded-lg focus:ring-2 focus:ring-yellow-400/60 focus:outline-none bg-slate-700/80 placeholder-gray-300 p-3 w-11/12 sm:w-2/3 md:w-1/2 z-10"
          />
          {/* Absolute search result under input */}
          {pokemon && !loading && !error && (
            <div className="absolute left-1/2 top-full -translate-x-1/2 mt-4 w-full sm:w-2/3 md:w-1/2 z-20">
              <SearchResult pokemon={pokemon} />
            </div>
          )}
        </div>
        
        {error && <p className="text-red-400 mt-4">{error}</p>}
        
        {loading && (
          <div className="mt-6 animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent" />
        )}
      </div>

      
      
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center z-0 bg-gradient-to-t from-slate-900/90 via-slate-900/70 to-transparent pt-4 pb-6 border-t border-slate-700">
        <PokemonGrid pokemonList={pokemonList} />
        <Pagination page={page} setPage={setPage} total={total} pageSize={pageSize} />
      </div>
    </div>
  );
}

