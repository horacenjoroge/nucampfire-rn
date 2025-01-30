import { db } from '../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mapImageURL } from '../../utils/mapImageURL';

export const fetchPartners = createAsyncThunk(
   'partners/fetchPartners',
   async () => {
       const querySnapshot = await getDocs(collection(db, 'partners'));
       const partners = [];
       querySnapshot.forEach((doc) => {
           const data = doc.data();
           partners.push({ id: doc.id, ...data });
       });
       return partners.map((partner) => ({
           ...partner,
           image: mapImageURL(partner.image)
       }));
   }
);

const partnersSlice = createSlice({
   name: 'partners',
   initialState: { isLoading: true, errMess: null, partnersArray: [] },
   reducers: {},
   extraReducers: {
       [fetchPartners.pending]: (state) => {
           state.isLoading = true;
       },
       [fetchPartners.fulfilled]: (state, action) => {
           state.isLoading = false;
           state.errMess = null;
           state.partnersArray = action.payload;
       },
       [fetchPartners.rejected]: (state, action) => {
           state.isLoading = false;
           state.errMess = action.error ? action.error.message : 'Fetch failed';
       }
   }
});

export const partnersReducer = partnersSlice.reducer;