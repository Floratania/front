import TenseLayout from '../../components/TenseLayout';

export default function FutureSimplePage() {
  return (
    <TenseLayout
      tenseName="Future Simple"
      structure="Subject + will + V"
      explanation="Used for actions that will happen in the future."
      examples={[
        { sentence: 'I will go to the gym tomorrow.', translation: 'Я піду в спортзал завтра.' },
        { sentence: 'She will call you later.', translation: 'Вона зателефонує тобі пізніше.' },
      ]}
      practiceTense="Future Simple"
    />
  );
}