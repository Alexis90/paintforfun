import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { voteProposal, getProposals } from '../services/proposals';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const ProposalCard = ({ proposal: initialProposal }) => {
  const [proposal, setProposal] = useState(initialProposal);
  const canvasRef = useRef(null);
  const previewSize = 256;

  const walletAddress = useSelector((state) => state.wallet.address);
  const isHolder = useSelector((state) => state.wallet.isHolder);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, previewSize, previewSize);

    const artworkData = JSON.parse(proposal.artworkData);

    artworkData.forEach((pixel) => {
      ctx.fillStyle = pixel.color;
      const drawX = Math.floor(pixel.x);
      const drawY = Math.floor(pixel.y);
      ctx.fillRect(drawX, drawY, 4, 4);
    });
  }, [proposal]);

  const handleVote = async (value) => {
    if (!walletAddress || !isHolder)
      return toast.error('You have to be a token holder to vote');

    try {
      const data = {
        walletAddress,
        proposalId: proposal.proposalId,
        voteValue: +value,
      };
      await voteProposal(data);
      const updatedProposal = await getProposals({
        proposal_id: proposal.proposalId,
      });

      setProposal(updatedProposal[0]);
      toast('Vote submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit vote');
    }
  };

  return (
    <div className="bg-secondary rounded-lg p-4 shadow-md flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={previewSize}
        height={previewSize}
        className="border border-primary rounded-md mb-2"
      />
      <div>Ends on: {dayjs(proposal.endTime).format('DD/MM HH:mm')}</div>

      <div className="flex w-full space-x-3">
        <button
          className="grow flex space-x-1 items-center justify-center px-3 py-1 rounded bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out"
          onClick={() => handleVote(1)}
        >
          <ThumbsUp size={20} />
          <span>({proposal.yesVotes})</span>
        </button>
        <button
          className="grow flex space-x-1 items-center justify-center px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out"
          onClick={() => handleVote(-1)}
        >
          <ThumbsDown size={20} />
          <span>({proposal.noVotes})</span>
        </button>
      </div>
    </div>
  );
};

export default ProposalCard;
