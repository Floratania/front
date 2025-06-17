import API from './api';



export const getWordSets = async () => {
  const res = await API.get('flashcards/wordsets/');
  return res.data;
};

export const subscribeToSet = async (setId) => {
  const res = await API.post(`flashcards/wordsets/${setId}/subscribe/`);
  return res.data;
};

export const unsubscribeFromSet = async (setId) => {
  const res = await API.post(`flashcards/wordsets/${setId}/unsubscribe/`);
  return res.data;
};


export const importOxfordSet = async (list_type) => {
  const res = await API.post(`flashcards/wordsets/import_from_file/`, { list_type });
  return res.data;
};
export default API;