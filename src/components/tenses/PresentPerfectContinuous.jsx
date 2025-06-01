import TenseLayout from '../../components/TenseLayout';

export default function PresentPerfectContinuous() {
  return (
    <TenseLayout
      tenseName="Present Perfect Continuous"
      explanation="Used to show actions that started in the past and are still continuing or just stopped."
      structure="Subject + have/has been + verb+ing"
      examples={[
        { sentence: 'He has been working since morning.', translation: 'Він працює з ранку.' },
        { sentence: 'They have been studying for two hours.', translation: 'Вони вчаться вже дві години.' },
      ]}
      practiceTense="Present Perfect Continuous"
    />
  );
}
