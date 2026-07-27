import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ComplaintForm = () => {
  const { data, status } = useSelector((state) => state.complaint);

  const handleCommit = async () => {
    try {
      await axios.post('http://localhost:8000/api/complaints', data);
      alert('Committed to QMS Ledger successfully!');
    } catch (error) {
      alert('Error committing data.');
    }
  };

  const InputField = ({ label, value, placeholder, isTextarea = false }) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {isTextarea ? (
        <textarea 
          readOnly 
          value={value || ''} 
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none" 
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input 
          type="text" 
          readOnly 
          value={value || ''} 
          className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none" 
          placeholder={placeholder} 
        />
      )}
    </div>
  );

  return (
    <div className="w-1/2 h-full bg-white border-r flex flex-col">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Log Customer Complaint</h2>
          <p className="text-sm text-gray-500">API & FDF Quality Assurance Module</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'Ready to Commit' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {status}
        </span>
      </div>

      {/* Scrollable Form Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50">
        
        {/* Section 1 */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">1. ORIGIN & CUSTOMER DETAILS</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Complaint Source" value={data.complaint_source} placeholder="e.g., Pharmacy" />
            <InputField label="Customer Name" value={data.customer_name} placeholder="Awaiting AI Extraction..." />
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">2. PRODUCT & BATCH IDENTIFICATION</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Product Name (API/FDF)" value={data.product_name} placeholder="Awaiting AI Extraction..." />
            <InputField label="Product Strength" value={data.product_strength} placeholder="e.g., 500 mg" />
            <InputField label="Batch / Lot Number" value={data.batch_number} placeholder="Awaiting AI Extraction..." />
            <InputField label="Affected Quantity" value={data.affected_quantity} placeholder="e.g., 12 capsules" />
            <InputField label="Manufacturing Date" value={data.manufacturing_date} placeholder="e.g., March 2026" />
            <InputField label="Expiry Date" value={data.expiry_date} placeholder="e.g., February 2028" />
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">3. FACILITY & MATERIAL IMPACT</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Originating Site Block" value={data.originating_block} placeholder="Awaiting AI classification..." />
            <InputField label="Impacted Non-Product Materials (NPM)" value={data.npm} placeholder="e.g., Primary packaging..." />
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">4. DEFECT ANALYSIS</h3>
          <InputField label="Complaint Category" value={data.complaint_category} placeholder="e.g., Product Defect - Discoloration" />
          <InputField label="Complaint Description" value={data.complaint_description} placeholder="AI will synthesize the complaint into a formal QMS description..." isTextarea={true} />
          
          {/* AI Risk Assessment Box */}
          <div className="mt-4 p-4 border border-purple-200 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-4">
              <span className="text-purple-600 font-bold mr-2">✨ AI copilot risk assessment</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputField label="Severity (Suggested)" value={data.severity} placeholder="Minor, Major, Critical" />
              <InputField label="Suggested Next Action" value={data.suggested_next_action} placeholder="e.g., Route to QA Investigation..." />
            </div>
            <InputField label="Initial Risk Assessment" value={data.initial_risk_assessment} placeholder="AI reasoning will appear here..." isTextarea={true} />
          </div>
        </section>

      </div>

      {/* Footer Commit Button */}
      <div className="p-4 bg-white border-t">
        <button 
          onClick={handleCommit}
          disabled={status !== 'Ready to Commit'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Commit to QMS Ledger
        </button>
      </div>
    </div>
  );
};

export default ComplaintForm;