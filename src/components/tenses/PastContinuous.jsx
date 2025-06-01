import TenseLayout from '../../components/TenseLayout';

export default function PastContinuousPage() {
  return (
    <TenseLayout
      tenseName="Past Continuous"
      structure="Subject + was/were + V-ing"
      explanation="Used for actions that were happening at a specific time in the past."
      examples={[
        { sentence: 'They were playing football at 5pm.', translation: 'Вони грали у футбол о 17:00.' },
        { sentence: 'I was reading when he called.', translation: 'Я читав, коли він зателефонував.' },
      ]}
      practiceTense="Past Continuous"
    />
  );
}