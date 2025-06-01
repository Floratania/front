import TenseLayout from '../../components/TenseLayout';

export default function FutureContinuousPage() {
  return (
    <TenseLayout
      tenseName="Future Continuous"
      structure="Subject + will be + V-ing"
      explanation="Used for actions that will be happening at a specific time in the future."
      examples={[
        { sentence: 'I will be studying at 8pm.', translation: 'Я буду вчитися о 20:00.' },
        { sentence: 'They will be traveling next week.', translation: 'Вони будуть у подорожі наступного тижня.' },
      ]}
      practiceTense="Future Continuous"
    />
  );
}
