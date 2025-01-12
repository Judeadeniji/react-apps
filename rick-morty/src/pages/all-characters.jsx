import React from 'react';
import { Link } from "react-router-dom";
import { For, Switch, Match } from "rc-extended/components";
import { $effect, signal, $watch, useSignalValue, useSignal } from "rc-extended/store";
import { useFetch } from "rc-extended/use";
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

const FloatingCard = ({ children, className }) => (
  <div className={`relative rounded-xl group hover:scale-105 transition-all duration-500 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative bg-black/80 backdrop-blur-xl rounded-xl border border-white/10">
      {children}
    </div>
  </div>
);

FloatingCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function Header() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          All Characters
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-50" />
      </div>
    </header>
  );
}

function Card({ character }) {
  return (
  <Link to={`/u/${character.id}`} className="block overflow-hidden">
      <FloatingCard className="overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img 
            loading="eager" 
            src={character.image} 
            alt={character.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
            <div className="p-3 text-center">
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                {character.name}
              </span>
            </div>
          </div>
        </div>
      </FloatingCard>
    </Link>
  );
}

Card.propTypes = {
  character: PropTypes.object.isRequired,
};

function Pagination() {
  const [page, action] = useSignal(idx);
  
  const next = () => action(idx => idx + 1);
  const prev = () => action(idx => idx > 1 ? idx - 1 : idx);
  
  return (
    <div className="fixed bottom-0 inset-x-0 bg-black/80 backdrop-blur-xl border-t border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          onClick={prev} 
          className="relative group px-6 py-2.5 overflow-hidden rounded-lg flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-[1px] bg-black rounded-lg" />
          <ChevronLeft className="relative w-4 h-4 text-green-400" />
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-medium">
            Previous
          </span>
        </button>
        
        <span className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
          Page {page}
        </span>
        
        <button 
          onClick={next}
          className="relative group px-6 py-2.5 overflow-hidden rounded-lg flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-[1px] bg-black rounded-lg" />
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-medium">
            Next
          </span>
          <ChevronRight className="relative w-4 h-4 text-green-400" />
        </button>
      </div>
    </div>
  );
}

const idx = signal(1);

export default function AllCharacters() {
  const pageIndex = useSignalValue(idx);
  const { isPending, isFulfilled, isRejected, result, error, invalidate } = useFetch(`https://rickandmortyapi.com/api/character/?page=${pageIndex}`);
  
  $watch(idx, (newIdxValue) => {
    console.log({ idx: newIdxValue });
    invalidate();
  });

  $effect(() => {
    console.log("Hi from $effect", idx.value);
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-20 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pb-24">
          <Switch fallback={
            <div className="text-center py-12 text-white/70">
              Something Went Wrong 😭
            </div>
          }>
            <Match when={isPending}>
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
              </div>
            </Match>
            <Match when={isFulfilled}>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <For each={result && result.results}>
                  {(character) => (
                    <Card key={character.id} character={character} />
                  )}
                </For>
              </div>
            </Match>
            <Match when={isRejected}>
              <div className="text-center py-12 text-red-400">
                {error && error.message}
              </div>
            </Match>
          </Switch>
        </main>

        <Pagination />
      </div>
    </div>
  );
}