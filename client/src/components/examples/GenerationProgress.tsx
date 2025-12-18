import GenerationProgress from '../GenerationProgress';

export default function GenerationProgressExample() {
  return (
    <GenerationProgress
      isVisible={true}
      status={{
        current: 7,
        total: 10,
        completed: 6,
        failed: 1,
        currentPrompt: "A luxury skincare product on marble surface..."
      }}
    />
  );
}
