import { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { getNFTs } from '../services/nfts';
import NftCard from './NftCard';

const filterOptions = ['latest', 'oldest', 'highest price', 'lowest price'];

const NFTsPage = () => {
  const [nfts, setNfts] = useState([]);
  const [filter, setFilter] = useState('latest');

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const mintedNFTs = await getNFTs({ status: 'minted' });

        setNfts(mintedNFTs);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchNFTs();
  }, []);

  const sortedNFTs = useMemo(() => {
    let sorted = [...nfts];
    switch (filter) {
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest price':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'lowest price':
        sorted.sort((a, b) => a.price - b.price);
        break;
      default: // 'latest'
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  }, [nfts, filter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        NFT Gallery
      </h1>

      <div className="mb-6 flex justify-center">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`mx-2 px-4 py-2 rounded-full ${
              filter === option
                ? 'bg-primary text-white'
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedNFTs.map((nft) => (
          <NftCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default NFTsPage;
