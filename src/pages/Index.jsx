import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wand2, Upload } from "lucide-react";
import Papa from 'papaparse';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [newColumnName, setNewColumnName] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (results) => {
        setHeaders(results.meta.fields || []);
        setData(results.data);
      },
      header: true,
    });
  };

  const handleAddAIColumn = async () => {
    if (!prompt || !apiKey || !newColumnName) return;

    try {
      const model = new ChatOpenAI({
        apiKey: apiKey,
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
      });

      const newData = await Promise.all(data.map(async (row) => {
        const message = new HumanMessage(`${prompt}\n\nRow data: ${JSON.stringify(row)}\n\nGenerate content:`);
        const response = await model.invoke([message]);
        return { ...row, [newColumnName]: response.content.trim() };
      }));

      setData(newData);
      setHeaders((prevHeaders) => [...prevHeaders, newColumnName]);
      setPrompt('');
      setNewColumnName('');
    } catch (error) {
      console.error("Error generating AI column:", error);
      alert("Error generating AI column. Please check your API key and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">🪄 AI-Enhanced Data Table</h1>
        
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="flex-grow"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
          </div>
          <Input
            type="password"
            placeholder="Enter your OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-grow"
          />
          <Input
            type="text"
            placeholder="Enter new column name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            className="flex-grow"
          />
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter prompt for AI column..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleAddAIColumn} className="bg-purple-600 hover:bg-purple-700">
              <Wand2 className="mr-2 h-4 w-4" />
              Add AI Column
            </Button>
          </div>
        </div>

        {data.length > 0 && headers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>{row[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
