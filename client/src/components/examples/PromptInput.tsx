import { useState } from 'react';
import PromptInput from '../PromptInput';

export default function PromptInputExample() {
  const [prompts, setPrompts] = useState('A luxury skincare product on marble\nProfessional product photography');
  return <PromptInput prompts={prompts} onChange={setPrompts} />;
}
