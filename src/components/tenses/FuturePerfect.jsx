import TenseLayout from '../../components/TenseLayout';

export default function FuturePerfectPage() {
  return (
    <TenseLayout
      tenseName="Future Perfect"
      structure="Subject + will have + V3"
      explanation="Used for actions that will be completed before a specific time in the future."
      examples={[
        { sentence: 'She will have graduated by June.', translation: 'Вона закінчить навчання до червня.' },
        { sentence: 'I will have finished the report by 5pm.', translation: 'Я завершу звіт до 17:00.' },
      ]}
      practiceTense="Future Perfect"
    />
  );
}