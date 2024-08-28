import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wand2 } from "lucide-react";

const Index = () => {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', age: 30, occupation: 'Developer' },
    { id: 2, name: 'Jane Smith', age: 28, occupation: 'Designer' },
    { id: 3, name: 'Bob Johnson', age: 35, occupation: 'Manager' },
  ]);
  const [prompt, setPrompt] = useState('');

  const handleAddAIColumn = () => {
    if (!prompt) return;

    // Simulate AI-generated data (replace with actual AI integration later)
    const newData = data.map(row => ({
      ...row,
      aiColumn: `AI data for ${row.name} based on ${prompt}`,
    }));

    setData(newData);
    setPrompt('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">🪄 AI-Enhanced Data Table</h1>
        
        <div className="mb-6 flex items-center space-x-2">
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Occupation</TableHead>
                {data[0].aiColumn && <TableHead>AI Column</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.occupation}</TableCell>
                  {row.aiColumn && <TableCell>{row.aiColumn}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Index;
