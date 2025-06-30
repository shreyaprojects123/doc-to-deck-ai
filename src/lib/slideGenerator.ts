
export interface SlideData {
  id: number;
  title: string;
  bullets: string[];
  type: 'cover' | 'content';
}

export const generateSlides = async (text: string, apiKey: string): Promise<SlideData[]> => {
  const prompt = `Convert the following text into a professional slide deck. Create 1 cover slide followed by 4-8 content slides. 

For the cover slide, create:
- A compelling title that summarizes the main topic
- A subtitle or brief description
- Today's date

For each content slide, create:
- A clear, specific title
- 3-5 concise bullet points that capture key insights
- Focus on actionable insights and key takeaways

Text to convert:
${text}

Return the response as a JSON array with this exact structure:
[
  {
    "id": 1,
    "title": "Presentation Title",
    "bullets": ["Subtitle or description", "Generated on [current date]"],
    "type": "cover"
  },
  {
    "id": 2,
    "title": "Content Slide Title",
    "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
    "type": "content"
  }
]

Make the content professional, concise, and suitable for a business presentation.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional presentation designer. Create clear, concise slides that would be suitable for a business environment. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    const slides = JSON.parse(content);
    
    // Add current date to cover slide if not present
    if (slides[0] && slides[0].type === 'cover') {
      const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      if (!slides[0].bullets.some((bullet: string) => bullet.includes(today.split(',')[0]))) {
        slides[0].bullets.push(`Generated on ${today}`);
      }
    }
    
    return slides;
  } catch (error) {
    console.error('Error generating slides:', error);
    throw new Error('Failed to generate slides. Please check your API key and try again.');
  }
};
