import TenseLayout from '../../components/TenseLayout';

export default function FuturePerfectContinuousPage() {
  return (
    <TenseLayout
      tenseName="Future Perfect Continuous"
      structure="Subject + will have been + V-ing"
      explanation="Used to emphasize duration of actions before a future point in time."
      examples={[
        { sentence: 'He will have been working for 5 hours.', translation: 'Він працюватиме вже 5 годин.' },
        { sentence: 'By December, she will have been teaching for 10 years.', translation: 'До грудня вона викладатиме вже 10 років.' },
      ]}
      practiceTense="Future Perfect Continuous"
    />
  );
}
