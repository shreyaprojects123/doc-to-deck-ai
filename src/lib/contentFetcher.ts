
export const fetchContentFromUrl = async (url: string): Promise<string> => {
  try {
    // For Google Docs, we need to convert the URL to plain text export format
    if (url.includes('docs.google.com')) {
      // Convert Google Docs URL to export format
      const docId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (docId) {
        const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
        const response = await fetch(exportUrl, { mode: 'cors' });
        if (response.ok) {
          return await response.text();
        }
      }
    }

    // For other URLs, we'll use a CORS proxy or direct fetch
    // Note: This is a simplified approach - in production you'd want a backend service
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    if (response.ok) {
      const data = await response.json();
      // Extract text content from HTML (basic approach)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.contents;
      return tempDiv.textContent || tempDiv.innerText || '';
    }

    throw new Error('Failed to fetch content');
  } catch (error) {
    console.error('Error fetching content:', error);
    throw new Error('Unable to fetch content from this URL. Please try copying and pasting the text directly.');
  }
};
