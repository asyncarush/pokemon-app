import Image from "next/image";
import { SearchedPokemon } from "@/typings.d";
import Link from "next/link";

export default function PokemonGrid({ pokemonList }: { pokemonList: SearchedPokemon[] }) {
  return (
    <div className="mt-2 mb-2 grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4 w-full px-1">
      {pokemonList.map((pokemon) => (
        <Link
          key={pokemon.id}
          href={`/pokemon/${pokemon.id}`}
          className="flex flex-col items-center p-3 rounded-lg hover:scale-110 transition cursor-pointer"
        >
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={72}
            height={72}
            className="rounded"
          />
          <span className="mt-2 text-xs font-semibold capitalize text-white text-center truncate w-[80px]">
            {pokemon.name}
          </span>
        </Link>
      ))}
    </div>
  );
}