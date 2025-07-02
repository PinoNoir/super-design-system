'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, Loader, Button } from 'sds-ui';
import styles from './styles/pdf-viewer.module.css';

type PdfData = {
  title?: string;
  summary: string;
  keyPoints?: string[];
  invoiceNumber?: string;
  total?: number;
  currency?: string;
  companyName?: string;
  documentDate?: string;
  rawText?: string;
};

type PdfExtractionProps = Readonly<{
  filename: string;
  onExtracted?: (data: unknown) => void;
}>;

export default function PdfExtraction({ filename, onExtracted }: PdfExtractionProps) {
  // Use state for managing data and status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<PdfData | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Track if the component is mounted to avoid state updates after unmount
  const isMounted = useRef(true);
  const requestSent = useRef(false);

  // Effect to fetch data and clean up on unmount
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Function to fetch PDF data
  const fetchPdfData = useCallback(async () => {
    if (!filename) return;

    setIsLoading(true);
    setError(null);

    try {
      setDebugInfo(`Requesting extraction for: ${filename}`);
      console.log(`Submitting PDF extraction request for ${filename} (attempt: ${retryCount + 1})`);

      const response = await fetch('/api/ai/extract-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      });

      const responseText = await response.text();
      setDebugInfo((prev) => `${prev}\nReceived response with status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${responseText}`);
      }

      let jsonData;
      try {
        jsonData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        setDebugInfo((prev) => `${prev}\nFailed to parse JSON response`);
        throw new Error('Invalid JSON response from server');
      }

      if (isMounted.current) {
        setData(jsonData);
        setDebugInfo((prev) => `${prev}\nSuccessfully extracted data with keys: ${Object.keys(jsonData).join(', ')}`);
        if (onExtracted) {
          onExtracted(jsonData);
        }
      }
    } catch (err) {
      console.error('Error extracting PDF data:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setDebugInfo((prev) => `${prev}\nError: ${err instanceof Error ? err.message : String(err)}`);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [filename, onExtracted, retryCount]);

  // Effect to fetch data when filename changes or retry is triggered
  useEffect(() => {
    if (filename) {
      requestSent.current = true; // Move this here
      fetchPdfData();
    }
  }, [filename, retryCount, fetchPdfData]);

  // Function to retry extraction
  const handleRetry = () => {
    requestSent.current = false;
    setRetryCount((prev) => prev + 1);
  };

  // Function to cancel extraction
  const handleCancel = () => {
    // Just reset the state since there's no streaming to cancel
    if (isMounted.current) {
      setIsLoading(false);
      setError(new Error('Extraction cancelled by user'));
    }
  };

  // Show spinner while loading
  if (isLoading) {
    return (
      <div className={styles.Loading}>
        <Loader withOverlay />
        <Text as="p" weight="medium">
          Analyzing document content...
        </Text>
        <Text as="p" size="small" color="neutral60">
          This may take up to 60 seconds depending on the document complexity.
        </Text>
      </div>
    );
  }

  // Show error with retry option
  if (error) {
    return (
      <div className={styles.Error}>
        <Text as="h3" color="error" weight="medium">
          Error analyzing document
        </Text>
        <Text as="p">{error.message || 'An unexpected error occurred while processing the document.'}</Text>
        <div className={styles.Actions}>
          <Button variant="secondary" size="small" onClick={handleRetry}>
            Retry Analysis
          </Button>
          <Button variant="danger" size="small" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
        <details className={styles.DebugInfo}>
          <summary>Debug Information</summary>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: '12px',
              maxHeight: '200px',
              overflow: 'auto',
            }}
          >
            {debugInfo}
            {error.stack ? `\n\nStack: ${error.stack}` : ''}
            {error.cause ? `\n\nCause: ${JSON.stringify(error.cause)}` : ''}
          </pre>
        </details>
      </div>
    );
  }

  // Nothing to show if there's no data yet
  if (!data) {
    return (
      <div className={styles.Empty}>
        <Text as="p">Preparing document analysis...</Text>
      </div>
    );
  }

  // Render the extracted content
  return (
    <div className={styles.Container}>
      {data.title && (
        <div className={styles.Title}>
          <Text as="h2" weight="medium">
            {data.title}
          </Text>
          {data.documentDate && (
            <Text as="p" size="small" color="neutral60">
              Date: {data.documentDate}
            </Text>
          )}
        </div>
      )}

      {data.summary && (
        <div className={styles.Summary}>
          <Text as="h3" weight="medium">
            Summary
          </Text>
          <Text as="p">{data.summary}</Text>
        </div>
      )}

      {data.keyPoints && data.keyPoints.length > 0 && (
        <div className={styles.KeyPoints}>
          <Text as="h3" weight="medium">
            Key Points
          </Text>
          <ul className={styles.KeyPointsList}>
            {data.keyPoints.map((point) => (
              <li key={point}>
                <Text as="p">{point}</Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Invoice specific information */}
      {data.invoiceNumber && (
        <div className={styles.Invoice}>
          <Text as="h3" weight="medium">
            Invoice Details
          </Text>
          <div className={styles.InvoiceDetails}>
            <div className={styles.Detail}>
              <Text as="span" weight="medium">
                Invoice Number:
              </Text>
              <Text as="span">{data.invoiceNumber}</Text>
            </div>

            {data.total !== undefined && (
              <div className={styles.Detail}>
                <Text as="span" weight="medium">
                  Total:
                </Text>
                <Text as="span">
                  {data.currency || ''} {data.total}
                </Text>
              </div>
            )}

            {data.companyName && (
              <div className={styles.Detail}>
                <Text as="span" weight="medium">
                  Company:
                </Text>
                <Text as="span">{data.companyName}</Text>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Raw text content if available */}
      {data.rawText && (
        <details>
          <summary>
            <Text as="span" weight="medium">
              Additional Content
            </Text>
          </summary>
          <div className={styles.RawTextContent}>
            <Text as="p">{data.rawText}</Text>
          </div>
        </details>
      )}
    </div>
  );
}
