import TenseLayout from '../../components/TenseLayout';

export default function PastPerfectPage() {
  return (
    <TenseLayout
      tenseName="Past Perfect"
      structure="Subject + had + V3"
      explanation="Used for actions that were completed before another past action."
      examples={[
        { sentence: 'She had left before I arrived.', translation: 'Вона пішла до того, як я прийшов.' },
        { sentence: 'We had finished dinner when the guests came.', translation: 'Ми закінчили вечерю, коли прийшли гості.' },
      ]}
      practiceTense="Past Perfect"
    />
  );
}
