import Image from "next/image";
import { SearchedPokemon } from "../typings";
import Link from "next/link";

export default function SearchResult({ pokemon }: { pokemon: SearchedPokemon }) {
  return (
    <Link href={`/pokemon/${pokemon.id}`} className="flex flex-row cursor-pointer items-center gap-6 bg-white/10 p-6 rounded-2xl shadow-lg mt-8 w-full max-w-lg mx-auto">
      <Image
        src={pokemon.image}
        alt={pokemon.name}
        width={120}
        height={120}
        className="rounded-xl"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold capitalize">{pokemon.name}</h2>
        <p className="text-gray-300">ID: <span className="font-mono text-white">{pokemon.id}</span></p>
      </div>
    </Link>
  );
}
