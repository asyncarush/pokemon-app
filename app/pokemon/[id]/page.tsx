import { PokemonDetailsAPIResult } from "@/typings";
import Image from "next/image";
import Link from "next/link";


export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await res.json();
  return data.results.map((_: { name: string; url: string }, idx: number) => ({
    id: (idx + 1).toString(),
  }));
}

export default async function PokemonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  
  if (!res.ok) {
    return <div className="text-white text-xl">Pokémon not found.</div>;
  }
  const pokemon: PokemonDetailsAPIResult = await res.json();

  return (
    <div className="flex relative flex-col h-full p-6 items-center bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 rounded-lg w-full max-w-7xl md:h-[90vh] ">
      
      <div className="rounded-2xl flex flex-col items-center w-full max-w-xl">
        <Image
          src={pokemon.sprites?.other?.["official-artwork"]?.front_default || pokemon.sprites?.front_default || ""}
          alt={pokemon.name}
          width={120}
          height={120}
          className="w-48 h-48 object-contain drop-shadow-lg mb-4 rounded-xl"
        />
        <h1 className="text-4xl font-extrabold capitalize text-yellow-300 drop-shadow mb-2">{pokemon.name} <span className="text-lg text-gray-300 font-mono">#{pokemon.id}</span></h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {pokemon.types.map((t: { type: { name: string } }) => (
            <span key={t.type.name} className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 via-yellow-300 to-red-400 text-slate-900 font-bold shadow text-xs uppercase">
              {t.type.name}
            </span>
          ))}
        </div>
        <div className="mb-4 w-full">
          <h2 className="text-xl font-bold text-white mb-2">Abilities</h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((a: { ability: {name: string}}) => (
              <span key={a.ability.name} className="px-2 py-1 rounded bg-slate-700 text-yellow-200 text-xs font-semibold capitalize">
                {a.ability.name}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4 w-full">
          <h2 className="text-xl font-bold text-white mb-2">Stats</h2>
          <div className="flex flex-col gap-2">
            {pokemon.stats.map((s: { stat: { name: string }; base_stat: number }) => (
              <div key={s.stat.name} className="flex items-center gap-2">
                <span className="w-24 capitalize text-xs text-gray-300">{s.stat.name}</span>
                <div className="flex-1 bg-slate-800 rounded h-3 overflow-hidden">
                  <div className="bg-yellow-400 h-3" style={{width: `${Math.min(s.base_stat, 100)}%`}} />
                </div>
                <span className="text-xs text-white font-mono w-8 text-right">{s.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-2 w-full">
          <h2 className="text-xl font-bold text-white mb-2">Moves</h2>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {pokemon.moves.slice(0, 12).map((m: { move: { name: string } }) => (
              <span key={m.move.name} className="px-2 py-1 rounded bg-blue-900 text-blue-200 text-xs font-semibold capitalize">
                {m.move.name}
              </span>
            ))}
            {pokemon.moves.length > 12 && (
              <span className="px-2 py-1 rounded bg-slate-700 text-gray-300 text-xs font-semibold">+{pokemon.moves.length - 12} more</span>
            )}
          </div>
        </div>
        <Link href="/" className="text-sm px-2 py-1 rounded-lg bg-yellow-400 text-slate-900 font-bold shadow hover:bg-yellow-300 transition">← Back to Home</Link>
      </div>
    </div>
  );
}