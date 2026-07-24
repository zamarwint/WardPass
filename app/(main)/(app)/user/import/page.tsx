"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getVaults } from "@/app/actions/vault/getVaults";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vault } from "@/lib/types/VaultType";
// import { processCSV } from "@/lib/functions";

export default function ImportPage() {
    const router = useRouter();

    // GET CURRENT VAULT ITEMS, AND REFETCH THEM WHEN CRUD OPERATIONS OCCUR, AND WHEN THE PAGE IS REVISITED
    const { data: vaults, isLoading, error } = useQuery({
        queryKey: ["vaults"],
        queryFn: () => getVaults(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 5,
        enabled: true
    })

    if (error) {
        toast.error("There was an error loading your vaults. Please try refreshing the page." + error?.message);
    }

    const [file, setFile] = useState<File | null>(null);
    const [selectedVault, setSelectedVault] = useState<string>("");
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
    //             setSelectedVault("");
    //             router.push(`/user/vault/${selectedVault.id}`)
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
                                disabled
                            //disabled={processing}
                            />
                            {file && (
                                <div className="text-sm text-muted-foreground">
                                    Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Select Vault to put imported data in.</Label>
                            {isLoading ? (
                                <>
                                    <h1>Loading...</h1>
                                    <Skeleton className="w-full max-w-sm h-12" />
                                </>
                            ) : (
                                <Select onValueChange={(e) => setSelectedVault(e)} value={selectedVault}>
                                    <SelectTrigger disabled>
                                        <SelectValue placeholder="Select a vault" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vaults?.map((vault: Vault) => (
                                            <SelectItem className="cursor-pointer" key={vault.id} value={vault.name}>
                                                {vault.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )
                            }
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Master Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your master password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled
                            //disabled={processing}
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
                                disabled
                            //disabled={processing}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                // onClick={handleSubmit}
                                // disabled={!file || processing}
                                disabled
                                className="flex-1"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </div>
                                ) : 'Import Passwords (Coming soon)'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}