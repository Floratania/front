import API from './api';

// export const getFlashcards = async (statuses = []) => {
//   const params = new URLSearchParams();
//   statuses.forEach(status => params.append('status', status));
//   const res = await API.get('/flashcards/flashcards/', { params });
//   return res.data;
// };
// export const getFlashcards = (status = [], wordsetId = null) => {
//     const params = new URLSearchParams();
//     status.forEach(s => params.append('status', s));
//     if (wordsetId) params.append('set', wordsetId);
//     return API.get('flashcards/flashcards/', { params });
//   };

export const getFlashcards = async (status = [], setId = null) => {
    const params = new URLSearchParams();
    if (status.length) {
      status.forEach(s => params.append('status', s));
    }
    if (setId) {
      params.append('set', setId);
    }
  
    const res = await API.get(`flashcards/flashcards/`, { params });
    return res.data;
  };

  
  export const updateProgress = async (flashcardId, status) => {
    const res = await API.post('flashcards/progress/', {
      flashcard_id: flashcardId,  // ✅ правильна назва
      status: status,
    });
    return res.data;
  };
  
  export default API;