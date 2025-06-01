import TenseLayout from '../../components/TenseLayout';

export default function PresentPerfect() {
  return (
    <TenseLayout
      tenseName="Present Perfect"
      explanation="Present Perfect is used for actions that happened at an unspecified time and are relevant now."
      structure="Subject + have/has + past participle"
      examples={[
        { sentence: 'I have finished my homework.', translation: 'Я закінчив домашнє завдання.' },
        { sentence: 'She has visited London.', translation: 'Вона відвідала Лондон.' },
      ]}
      practiceTense="Present Perfect"
    />
  );
}