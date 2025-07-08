import PptxGenJS from "pptxgenjs";
import { Slide } from "@/pages/Index";

const themeColors: Record<string, { bg: string; text: string }> = {
  professional: { bg: "1e3a8a", text: "FFFFFF" }, // blue bg, white text
  dark: { bg: "111827", text: "FFFFFF" },         // dark bg, white text
  vibrant: { bg: "f97316", text: "FFFFFF" },      // orange bg, white text
};

export const exportToPPTX = (slides: Slide[], themeKey: string = "professional") => {
  const pptx = new PptxGenJS();
  const theme = themeColors[themeKey] || themeColors.professional;

  slides.forEach((slide) => {
    const slideObj = pptx.addSlide();
    slideObj.background = { color: theme.bg };

    // Title
    slideObj.addText(slide.title, { x: 0.5, y: 0.3, fontSize: 28, bold: true, color: theme.text });

    // Bullets
    if (slide.bullets && slide.bullets.length > 0) {
      slideObj.addText(slide.bullets.map(b => `• ${b}`).join("\n"), { x: 0.7, y: 1.2, fontSize: 18, color: theme.text });
    }

    // Visual (as preformatted text)
    if (slide.visual && slide.visual !== 'null') {
      slideObj.addText(slide.visual, { x: 0.7, y: 2.8, fontSize: 14, fontFace: "Courier New", color: theme.text });
    }

    // Visual Description
    if (slide.visualDescription && slide.visualDescription !== 'null') {
      slideObj.addText(slide.visualDescription, { x: 0.7, y: 4.5, fontSize: 12, italic: true, color: theme.text });
    }

    // Source
    if (slide.source && slide.source !== 'null') {
      slideObj.addText(`Source: ${slide.source}`, { x: 0.7, y: 5.0, fontSize: 10, color: "CCCCCC" });
    }
  });

  pptx.writeFile("slides.pptx");
};