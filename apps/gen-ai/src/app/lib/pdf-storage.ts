// Simple in-memory storage for PDF analysis results
// In production, you'd want to use a database like PostgreSQL or Redis

interface PdfAnalysis {
  filename: string;
  analysis: any;
  timestamp: number;
}

class PdfStorage {
  private storage = new Map<string, PdfAnalysis>();

  // Store PDF analysis results
  storeAnalysis(filename: string, analysis: any): void {
    this.storage.set(filename, {
      filename,
      analysis,
      timestamp: Date.now(),
    });

    // Clean up old entries (older than 1 hour)
    this.cleanup();
  }

  // Get PDF analysis results
  getAnalysis(filename: string): PdfAnalysis | null {
    const result = this.storage.get(filename);
    if (result && Date.now() - result.timestamp < 60 * 60 * 1000) {
      // 1 hour
      return result;
    }
    return null;
  }

  // Check if analysis exists
  hasAnalysis(filename: string): boolean {
    return this.getAnalysis(filename) !== null;
  }

  // Clean up old entries
  private cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [key, value] of this.storage.entries()) {
      if (value.timestamp < oneHourAgo) {
        this.storage.delete(key);
      }
    }
  }
}

export const pdfStorage = new PdfStorage();
