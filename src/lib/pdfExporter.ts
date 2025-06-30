
import { Slide } from '@/pages/Index';

interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
}

export const exportToPDF = (slides: Slide[], theme: Theme) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Generate CSS for the theme
  const getThemeStyles = (theme: Theme) => {
    const primaryColor = theme.primary.includes('gradient') 
      ? 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)'
      : theme.primary.replace('bg-', '');
    
    const backgroundColor = theme.primary.includes('blue') ? '#1e3a8a' :
                           theme.primary.includes('gray') ? '#111827' :
                           'linear-gradient(135deg, #f97316 0%, #ec4899 100%)';
    
    return backgroundColor;
  };

  // Generate HTML for all slides
  const slidesHTML = slides.map((slide, index) => `
    <div class="slide" style="
      width: 100vw;
      height: 100vh;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: ${getThemeStyles(theme)};
      color: white;
      page-break-after: always;
      box-sizing: border-box;
      position: relative;
    ">
      ${slide.type === 'cover' ? `
        <div style="text-align: center;">
          <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 2rem; line-height: 1.2;">${slide.title}</h1>
          <div style="font-size: 1.5rem; opacity: 0.9;">
            ${slide.bullets.map(bullet => `<p style="margin: 1rem 0;">${bullet}</p>`).join('')}
          </div>
        </div>
      ` : `
        <div>
          <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 2rem;">${slide.title}</h2>
          <ul style="list-style: none; padding: 0;">
            ${slide.bullets.map(bullet => `
              <li style="display: flex; align-items: flex-start; margin-bottom: 1.5rem; font-size: 1.25rem; line-height: 1.6;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: white; margin-right: 1rem; margin-top: 0.75rem; flex-shrink: 0;"></div>
                <span>${bullet}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `}
      <div style="position: absolute; bottom: 1.5rem; right: 1.5rem; font-size: 0.875rem; opacity: 0.7;">
        ${index + 1}
      </div>
    </div>
  `).join('');

  // Write the complete HTML document
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${slides[0]?.title || 'Slides'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
          }
          .slide {
            overflow: hidden;
          }
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        ${slidesHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
