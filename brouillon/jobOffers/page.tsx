"use client";

import React, { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient } from "@mysten/sui.js/client";
import './jobOffersScrollbar.css';

// Contract configuration
const PACKAGE_ID = "0x0"; // Replace with your deployed package ID
const REGISTRY_ID = "0x0"; // Replace with your registry object ID
const TREASURY_ID = "0x0"; // Replace with your treasury object ID

interface Job {
  id: string;
  employer: string;
  freelancer?: string;
  description: string;
  payment: string;
  required_cred: string;
  completed: boolean;
  contested: boolean;
  created_at: string;
}

interface Cred {
  score: string;
  total_jobs: string;
  successful_jobs: string;
}

export default function JobOffersPage() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userCred, setUserCred] = useState<Cred | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);

  // Job creation form state
  const [jobForm, setJobForm] = useState({
    description: "",
    payment: "",
    required_cred: "0"
  });

  // Initialize user if needed
  useEffect(() => {
    if (account?.address) {
      initializeUser();
      fetchUserCred();
    }
  }, [account?.address]);

  // Fetch jobs and user cred
  useEffect(() => {
    fetchJobs();
    if (account?.address) {
      fetchUserCred();
    }
  }, [account?.address]);

  const initializeUser = async () => {
    if (!account?.address) return;

    try {
      const txb = new TransactionBlock();
      txb.moveCall({
        target: `${PACKAGE_ID}::platform::init_user`,
        arguments: [],
      });

      await signAndExecute(
        { transactionBlock: txb },
        {
          onSuccess: (result) => {
            console.log("User initialized:", result);
            fetchUserCred();
          },
          onError: (error) => {
            console.error("Failed to initialize user:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error initializing user:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      const jobIds = await client.getDynamicFieldObject({
        parentId: REGISTRY_ID,
        name: { type: "0x2::object::ID", value: REGISTRY_ID }
      });

      // This is a simplified version - in practice you'd need to fetch each job individually
      // For now, we'll use mock data
      setJobs([
        {
          id: "1",
          employer: "0x123...",
          description: "Frontend React Developer needed for e-commerce project",
          payment: "1000000000", // 1 SUI
          required_cred: "5",
          completed: false,
          contested: false,
          created_at: Date.now().toString()
        },
        {
          id: "2", 
          employer: "0x456...",
          description: "Smart contract audit for DeFi protocol",
          payment: "5000000000", // 5 SUI
          required_cred: "10",
          completed: false,
          contested: false,
          created_at: Date.now().toString()
        }
      ]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCred = async () => {
    if (!account?.address) return;

    try {
      const cred = await client.getObject({
        id: account.address,
        options: { showContent: true }
      });

      if (cred.data?.content && 'fields' in cred.data.content) {
        setUserCred({
          score: cred.data.content.fields.score,
          total_jobs: cred.data.content.fields.total_jobs,
          successful_jobs: cred.data.content.fields.successful_jobs
        });
      }
    } catch (error) {
      console.error("Error fetching user cred:", error);
      // User might not be initialized yet
    }
  };

  const createJob = async () => {
    if (!account?.address) return;

    try {
      const txb = new TransactionBlock();
      
      // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
      const paymentInMist = Math.floor(parseFloat(jobForm.payment) * 1_000_000_000);
      
      // Split payment coin
      const [payment] = txb.splitCoins(txb.gas, [paymentInMist]);

      txb.moveCall({
        target: `${PACKAGE_ID}::platform::create_job`,
        arguments: [
          txb.object(REGISTRY_ID),
          txb.object(TREASURY_ID),
          txb.pure.string(jobForm.description),
          payment,
          txb.pure.u64(parseInt(jobForm.required_cred)),
          txb.object("0x6"), // Clock object
        ],
      });

      await signAndExecute(
        { transactionBlock: txb },
        {
          onSuccess: (result) => {
            console.log("Job created:", result);
            setShowCreateJob(false);
            setJobForm({ description: "", payment: "", required_cred: "0" });
            fetchJobs();
          },
          onError: (error) => {
            console.error("Failed to create job:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const acceptJob = async (jobId: string) => {
    if (!account?.address) return;

    try {
      const txb = new TransactionBlock();
      
      txb.moveCall({
        target: `${PACKAGE_ID}::platform::accept_job`,
        arguments: [
          txb.object(REGISTRY_ID),
          txb.pure.u64(parseInt(jobId)),
          txb.pure.option("None"), // No caution deposit for now
        ],
      });

      await signAndExecute(
        { transactionBlock: txb },
        {
          onSuccess: (result) => {
            console.log("Job accepted:", result);
            fetchJobs();
          },
          onError: (error) => {
            console.error("Failed to accept job:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const completeJob = async (jobId: string) => {
    if (!account?.address) return;

    try {
      const txb = new TransactionBlock();
      
      txb.moveCall({
        target: `${PACKAGE_ID}::platform::complete_job`,
        arguments: [
          txb.object(REGISTRY_ID),
          txb.pure.u64(parseInt(jobId)),
          txb.object("0x6"), // Clock object
        ],
      });

      await signAndExecute(
        { transactionBlock: txb },
        {
          onSuccess: (result) => {
            console.log("Job completed:", result);
            fetchJobs();
          },
          onError: (error) => {
            console.error("Failed to complete job:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error completing job:", error);
    }
  };

  const contestJob = async (jobId: string) => {
    if (!account?.address) return;

    try {
      const txb = new TransactionBlock();
      
      txb.moveCall({
        target: `${PACKAGE_ID}::platform::contest_job`,
        arguments: [
          txb.object(REGISTRY_ID),
          txb.pure.u64(parseInt(jobId)),
          txb.pure.string("Job requirements not met"),
        ],
      });

      await signAndExecute(
        { transactionBlock: txb },
        {
          onSuccess: (result) => {
            console.log("Job contested:", result);
            fetchJobs();
          },
          onError: (error) => {
            console.error("Failed to contest job:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error contesting job:", error);
    }
  };

  const formatSUI = (mist: string) => {
    return (parseInt(mist) / 1_000_000_000).toFixed(2);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #eaf6fd 0%, #f8fbff 60%, #70b5fa 100%)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#70b5fa] mx-auto mb-4"></div>
          <p className="text-xl text-[#202c54]">Loading job offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start" style={{background: 'linear-gradient(135deg, #eaf6fd 0%, #f8fbff 60%, #70b5fa 100%)'}}>
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen bg-white/80 shadow-lg flex flex-col items-stretch overflow-y-auto custom-scrollbar min-w-[220px] max-w-[260px] py-8 px-3 z-10">
        <h2 className="text-lg font-bold text-[#202c54] mb-4 px-2">Actions</h2>
        
        {account?.address && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-[#202c54] font-semibold">Your Cred Score</p>
            <p className="text-2xl font-bold text-[#70b5fa]">
              {userCred ? userCred.score : "0"}
            </p>
            {userCred && (
              <p className="text-xs text-gray-600">
                {userCred.successful_jobs}/{userCred.total_jobs} successful
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => setShowCreateJob(true)}
          className="mb-4 px-4 py-2 bg-[#70b5fa] text-white rounded-lg font-semibold hover:bg-[#4fa3f7] transition-colors"
        >
          Create Job
        </button>

        <button
          onClick={() => setShowJobDetails(false)}
          className="mb-2 px-4 py-2 bg-white text-[#202c54] border border-[#70b5fa] rounded-lg font-semibold hover:bg-blue-100 transition-colors"
        >
          Browse Jobs
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl min-h-screen px-4 mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-[#202c54] text-center drop-shadow-sm">
          Job Marketplace
        </h1>
        <p className="text-xl font-medium text-[#70b5fa] mb-6 text-center">
          {account?.address ? "Find your next opportunity" : "Connect your wallet to get started"}
        </p>

        {!account?.address ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-lg text-[#202c54] mb-4">Please connect your wallet to view and create jobs</p>
          </div>
        ) : (
          <div className="w-full pb-20">
            {jobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center text-[#202c54] font-medium">
                No job offers available. Be the first to create one!
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#202c54] mb-2">
                          {job.description}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Employer: {formatAddress(job.employer)}</span>
                          <span>•</span>
                          <span>Payment: {formatSUI(job.payment)} SUI</span>
                          <span>•</span>
                          <span>Required Cred: {job.required_cred}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {job.freelancer ? (
                          <span className="text-sm text-green-600 font-semibold">
                            {job.freelancer === account.address ? "You are assigned" : "Taken"}
                          </span>
                        ) : (
                          <button
                            onClick={() => acceptJob(job.id)}
                            className="px-4 py-2 bg-[#70b5fa] text-white rounded-lg font-semibold hover:bg-[#4fa3f7] transition-colors text-sm"
                          >
                            Accept Job
                          </button>
                        )}
                        
                        {job.employer === account.address && job.freelancer && !job.completed && (
                          <button
                            onClick={() => completeJob(job.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                        
                        {job.freelancer === account.address && !job.completed && !job.contested && (
                          <button
                            onClick={() => contestJob(job.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                          >
                            Contest
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {job.completed && (
                      <div className="text-sm text-green-600 font-semibold">
                        ✓ Completed
                      </div>
                    )}
                    
                    {job.contested && (
                      <div className="text-sm text-red-600 font-semibold">
                        ⚠ Under Dispute
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Job Modal */}
      {showCreateJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-[#202c54] mb-4">Create New Job</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#202c54] mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70b5fa] focus:border-transparent"
                  rows={3}
                  placeholder="Describe the job requirements..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#202c54] mb-2">
                  Payment (SUI)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={jobForm.payment}
                  onChange={(e) => setJobForm({...jobForm, payment: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70b5fa] focus:border-transparent"
                  placeholder="1.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#202c54] mb-2">
                  Required Cred Score
                </label>
                <input
                  type="number"
                  value={jobForm.required_cred}
                  onChange={(e) => setJobForm({...jobForm, required_cred: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70b5fa] focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={createJob}
                className="flex-1 px-4 py-2 bg-[#70b5fa] text-white rounded-lg font-semibold hover:bg-[#4fa3f7] transition-colors"
              >
                Create Job
              </button>
              <button
                onClick={() => setShowCreateJob(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}