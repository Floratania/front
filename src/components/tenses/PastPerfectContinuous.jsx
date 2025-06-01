import TenseLayout from '../../components/TenseLayout';

export default function PastPerfectContinuousPage() {
  return (
    <TenseLayout
      tenseName="Past Perfect Continuous"
      structure="Subject + had been + V-ing"
      explanation="Used to emphasize the duration of an action that was happening before another action in the past."
      examples={[
        { sentence: 'He had been working all day.', translation: 'Він працював цілий день.' },
        { sentence: 'They had been waiting for hours.', translation: 'Вони чекали кілька годин.' },
      ]}
      practiceTense="Past Perfect Continuous"
    />
  );
}