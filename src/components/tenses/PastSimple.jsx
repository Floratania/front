import TenseLayout from '../../components/TenseLayout';

export default function PastSimplePage() {
  return (
    <TenseLayout
      tenseName="Past Simple"
      structure="Subject + V2 (past form)"
      explanation="Used for actions completed in the past."
      examples={[
        { sentence: 'I watched a movie yesterday.', translation: 'Я подивився фільм учора.' },
        { sentence: 'She visited London last year.', translation: 'Вона відвідала Лондон минулого року.' },
      ]}
      practiceTense="Past Simple"
    />
  );
}