import { db } from '../../firebase.config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
   'comments/fetchComments',
   async () => {
       const querySnapshot = await getDocs(collection(db, 'comments'));
       const comments = [];
       querySnapshot.forEach((doc) => {
           const data = doc.data();
           comments.push({ id: doc.id, ...data });
       });
       return comments;
   }
);

export const postComment = createAsyncThunk(
   'comments/postComment',
   async (payload) => {
       payload.date = new Date().toISOString();
       const docRef = await addDoc(collection(db, 'comments'), payload);
       return { id: docRef.id, ...payload };
   }
);

const commentsSlice = createSlice({
   name: 'comments',
   initialState: { isLoading: true, errMess: null, commentsArray: [] },
   reducers: {
       addComment: (state, action) => {
           state.commentsArray.push(action.payload);
       }
   },
   extraReducers: {
       [fetchComments.pending]: (state) => {
           state.isLoading = true;
       },
       [fetchComments.fulfilled]: (state, action) => {
           state.isLoading = false;
           state.errMess = null;
           state.commentsArray = action.payload;
       },
       [fetchComments.rejected]: (state, action) => {
           state.isLoading = false;
           state.errMess = action.error ? action.error.message : 'Fetch failed';
       },
       [postComment.fulfilled]: (state, action) => {
           state.commentsArray.push(action.payload);
       }
   }
});

export const { addComment } = commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;