export interface SlideData {
  id: number;
  title: string;
  bullets: string[];
  type: 'cover' | 'content';
}

export const generateSlides = async (text: string): Promise<SlideData[]> => {
  const response = await fetch('https://doc-to-deck-ai.onrender.com/api/generate-slides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate slides');
  }

  return await response.json();
};
