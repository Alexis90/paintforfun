import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getProposals } from '../services/proposals';
import ProposalCard from './proposalCard';

const Council = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const fetchActiveProposals = async () => {
      try {
        const activeProposals = await getProposals({ status: 'active' });

        if (!activeProposals && !activeProposals.length) return;

        setProposals(activeProposals);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchActiveProposals();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
      {!proposals.length && (
        <div className="flex items-center justify-center h-full">
          <p>No proposals open, please come back later.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.proposalId} proposal={proposal} />
        ))}
      </div>
    </div>
  );
};

export default Council;
