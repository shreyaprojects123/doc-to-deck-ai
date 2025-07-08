import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post('/api/generate-slides', async (req, res) => {
  const { text } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('API KEY:', apiKey);

  if (!apiKey) {
    console.log('No API key found in environment!');
    return res.status(500).json({ error: 'OpenAI API key not set on server.' });
  }

   // Add this log:
   console.log('Received text:', text);
  const prompt = `Convert the following text into a professional slide deck. Create 1 cover slide followed by 4-8 content slides.

For the cover slide, create:
- A compelling title that summarizes the main topic
- A subtitle or brief description
- Today's date

For each content slide, create:
- A clear, specific title
- 3-5 concise bullet points that capture key insights
- For at least 50% of the slides, include a relevant visual element (such as a chart, graph, or data table) in markdown or ASCII format. 
- If including a data table or chart, cite the source of the data.
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
    "visual": "| A | B |\\n|---|---|\\n| 1 | 2 |",
    "visualDescription": "Brief description of the visual, or null",
    "source": "Source of data, or null",
    "type": "content"
  }
]

Make the content professional, concise, and suitable for a business presentation.`;

  try {
    console.log('About to call OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional presentation designer...' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log('OpenAI API response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', errorText);
      return res.status(500).json({ error: 'OpenAI API error', details: errorText });
    }

    const data = await response.json();
    console.log('OpenAI API response data:', data);
    const content = data.choices[0].message.content;
    console.log('OpenAI API response content:', content);
    const cleanContent = content.replace(/```json\n?/, '').replace(/\n?```$/, '');
    console.log('OpenAI API response cleanContent:', cleanContent);
    const slides = JSON.parse(cleanContent);

    console.log('Slides before cleanup:', slides);

    // Clean up visuals, descriptions, and sources: remove backticks and set to null if value is 'null'
    ['visual', 'visualDescription', 'source'].forEach(field => {
      slides.forEach(slide => {
        if (slide[field] && typeof slide[field] === 'string') {
          slide[field] = slide[field]
            .replace(/^```[a-zA-Z]*\n?/i, '')
            .replace(/\n?```$/, '');
          if (slide[field].trim().toLowerCase() === 'null') {
            slide[field] = null;
          }
        }
      });
    });

    console.log('Slides after cleanup:', slides);

    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate slides.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});