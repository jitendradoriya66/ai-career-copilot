import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker source safely
if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

/**
 * Extract text from uploaded PDF file ArrayBuffer
 * @param {ArrayBuffer} fileArrayBuffer 
 * @returns {Promise<string>} Extracted text string
 */
export async function extractTextFromPDF(fileArrayBuffer) {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: fileArrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ');
        
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF Text Extraction Error:', error);
    throw new Error('Failed to extract text from PDF. Please make sure the PDF is not encrypted or corrupt.');
  }
}
