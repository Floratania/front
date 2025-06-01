import TenseLayout from '../../components/TenseLayout';

export default function PresentContinuous() {
  return (
    <TenseLayout
      tenseName="Present Continuous"
      explanation="Present Continuous is used for actions happening now or temporary situations."
      structure="Subject + am/is/are + verb+ing"
      examples={[
        { sentence: 'He is reading a book.', translation: 'Він читає книгу.' },
        { sentence: 'We are watching a movie.', translation: 'Ми дивимось фільм.' },
      ]}
      practiceTense="Present Continuous"
    />
  );
}