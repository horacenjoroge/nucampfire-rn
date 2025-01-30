
import { mapImageURL } from '../../utils/mapImageURL';
import { db } from '../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCampsites = createAsyncThunk(
    'campsites/fetchCampsites',
    async () => {
        const querySnapshot = await getDocs(collection(db, 'campsites'));
        const campsites = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            campsites.push({ id: doc.id, ...data });
        });
        return campsites;
    }
);

const campsitesSlice = createSlice({
    name: 'campsites',
    initialState: { isLoading: true, errMess: null, campsitesArray: [] },
    reducers: {},
    extraReducers: {
        [fetchCampsites.pending]: (state) => {
            state.isLoading = true;
        },
        [fetchCampsites.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.errMess = null;
            state.campsitesArray = action.payload.map((campsite) => ({
                ...campsite,
                image: mapImageURL(campsite.image)
            }));
        },
        [fetchCampsites.rejected]: (state, action) => {
            state.isLoading = false;
            state.errMess = action.error ? action.error.message : 'Fetch failed';
        }
    }
});

export const campsitesReducer = campsitesSlice.reducer;
