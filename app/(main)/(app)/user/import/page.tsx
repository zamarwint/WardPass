"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
// import { processCSV } from "@/lib/functions";

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [password, setPassword] = useState("");
    const [note, setNote] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    // const handleSubmit = async () => {
    //     if (!file) {
    //         alert("Please select a file first");
    //         return;
    //     }
    //     if (!password) {
    //         alert("Please enter a password");
    //         return;
    //     }

    //     setProcessing(true);
    //     try {
    //         // Read file as text
    //         const fileText = await file.text();

    //         // Process CSV with Master Password and Note
    //         // const result = await processCSV(fileText, password, note);

    //         if (result.success) {
    //             alert(`Successfully imported ${result.count} passwords!`);
    //             setFile(null);
    //             setPassword("");
    //             setNote("");
    //         } else {
    //             alert(`Error: ${result.error}`);
    //         }
    //     } catch (error) {
    //         console.error('Error processing file:', error);
    //         alert('An error occurred while processing the file');
    //     } finally {
    //         setProcessing(false);
    //     }
    // };

    return (
        <div className="flex items-center justify-center size-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center w-full py-10 space-y-4">
                    <h1 className="text-6xl font-bold text-primary">
                        Import Passwords
                    </h1>
                    <p className="text-muted-foreground">Import passwords from a CSV file encrypted with your Master Password.</p>
                </div>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Import Passwords</CardTitle>
                        <CardDescription>
                            Import passwords from a CSV file encrypted with your Master Password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="file">CSV File</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                disabled={processing}
                            />
                            {file && (
                                <div className="text-sm text-muted-foreground">
                                    Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Master Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your master password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={processing}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note">Note</Label>
                            <Input
                                id="note"
                                type="text"
                                placeholder="Optional note for this import (e.g., 'Imported on 2023-10-27')"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                disabled={processing}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                // onClick={handleSubmit}
                                disabled={!file || processing}
                                className="flex-1"
                            >
                                {processing ? 'Processing...' : 'Import Passwords'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}