import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import xlsx from 'xlsx';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key not set' });
    return;
  }

  try {
    // Read and parse the Excel file
    const filePath = path.join(process.cwd(), 'api', 'openai', 'ExtractedContractData.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    // Convert to CSV for prompt clarity
    const csvData = jsonData.map(row => (row as any[]).join(',')).join('\n');
    // Compose the full prompt
    const fullPrompt = `${prompt}\n\nHere is the extracted spreadsheet data from the transaction (as CSV):\n${csvData}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: 1200,
      }),
    });
    const data = await response.json();
    res.status(200).json({ result: data.choices?.[0]?.message?.content || 'No result.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'OpenAI API error.' });
  }
} 