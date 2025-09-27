"use client";

import React, { useState, useEffect } from "react";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";

// Contract configuration
const PACKAGE_ID = "0x0"; // Replace with your deployed package ID
const REGISTRY_ID = "0x0"; // Replace with your registry object ID
const TREASURY_ID = "0x0"; // Replace with your treasury object ID

interface Cred {
  score: string;
  total_jobs: string;
  successful_jobs: string;
}

export default function ApplyEmployerPage() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  
  const [userCred, setUserCred] = useState<Cred | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);

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
    } finally {
      setLoading(false);
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
            alert("Job created successfully!");
          },
          onError: (error) => {
            console.error("Failed to create job:", error);
            alert("Failed to create job. Please try again.");
          },
        }
      );
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Error creating job. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #eaf6fd 0%, #f8fbff 60%, #70b5fa 100%)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#70b5fa] mx-auto mb-4"></div>
          <p className="text-xl text-[#202c54]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{background: 'linear-gradient(135deg, #eaf6fd 0%, #f8fbff 60%, #70b5fa 100%)'}}>
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-extrabold mb-6 tracking-tight text-[#202c54] text-center">
            Apply as Employer
          </h1>
          
          {!account?.address ? (
            <div className="text-center">
              <p className="text-lg text-[#202c54] mb-4">Please connect your wallet to create job offers</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Cred Display */}
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h2 className="text-lg font-semibold text-[#202c54] mb-2">Your Cred Score</h2>
                <div className="text-3xl font-bold text-[#70b5fa] mb-2">
                  {userCred ? userCred.score : "0"}
                </div>
                {userCred && (
                  <p className="text-sm text-gray-600">
                    {userCred.successful_jobs}/{userCred.total_jobs} successful jobs
                  </p>
                )}
              </div>

              {/* Employer Benefits */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#202c54]">Why Choose VeilAccord?</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">✓ Verified Freelancers</h3>
                    <p className="text-sm text-green-700">Access to freelancers with proven track records and cred scores</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">✓ Secure Payments</h3>
                    <p className="text-sm text-blue-700">Escrowed payments ensure work completion before funds release</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">✓ Dispute Resolution</h3>
                    <p className="text-sm text-purple-700">Fair dispute resolution process for contested jobs</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">✓ Low Fees</h3>
                    <p className="text-sm text-orange-700">Only 5% platform fee - much lower than traditional platforms</p>
                  </div>
                </div>
              </div>

              {/* Create Job Button */}
              <div className="text-center">
                <button
                  onClick={() => setShowCreateJob(true)}
                  className="bg-[#70b5fa] hover:bg-[#4fa3f7] text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors text-lg"
                >
                  Create Your First Job
                </button>
              </div>

              {/* How It Works */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#202c54] mb-4">How It Works</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#70b5fa] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h3 className="font-semibold text-[#202c54]">Create Job Post</h3>
                      <p className="text-sm text-gray-600">Describe your project, set payment amount, and specify required cred score</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#70b5fa] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h3 className="font-semibold text-[#202c54]">Freelancer Applies</h3>
                      <p className="text-sm text-gray-600">Qualified freelancers can apply to your job</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#70b5fa] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h3 className="font-semibold text-[#202c54]">Work Begins</h3>
                      <p className="text-sm text-gray-600">Payment is escrowed, freelancer starts working</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#70b5fa] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <h3 className="font-semibold text-[#202c54]">Mark Complete</h3>
                      <p className="text-sm text-gray-600">Review work and mark as complete to release payment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
                <p className="text-xs text-gray-500 mt-1">
                  Higher cred scores indicate more experienced freelancers
                </p>
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