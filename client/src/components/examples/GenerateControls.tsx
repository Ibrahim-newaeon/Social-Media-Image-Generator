import GenerateControls from '../GenerateControls';

export default function GenerateControlsExample() {
  return (
    <GenerateControls
      onGenerate={() => console.log('Generate clicked')}
      onStop={() => console.log('Stop clicked')}
      isGenerating={false}
      promptCount={5}
    />
  );
}
