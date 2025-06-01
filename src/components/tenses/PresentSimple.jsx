import TenseLayout from '../../components/TenseLayout';

export default function PresentSimple() {
  return (
    <TenseLayout
      tenseName="Present Simple"
      explanation="Present Simple is used to describe habits, general truths, repeated actions or unchanging situations."
      structure="Subject + base verb (add 's' or 'es' for he/she/it)"
      examples={[
        { sentence: 'She works every day.', translation: 'Вона працює кожного дня.' },
        { sentence: 'They live in Kyiv.', translation: 'Вони живуть у Києві.' },
      ]}
      practiceTense="Present Simple"
    />
  );
}