import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    complaint_source: '', customer_name: '', product_name: '', product_strength: '',
    batch_number: '', affected_quantity: '', manufacturing_date: '', expiry_date: '',
    originating_block: '', npm: '', complaint_category: '', complaint_description: '',
    severity: '', suggested_next_action: '', initial_risk_assessment: ''
  },
  status: 'Pending Triage', // or 'Ready to Commit'
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    updateComplaintData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
      state.status = 'Ready to Commit';
    },
    resetComplaintData: () => initialState,
  },
});

export const { updateComplaintData, resetComplaintData } = complaintSlice.actions;
export default complaintSlice.reducer;