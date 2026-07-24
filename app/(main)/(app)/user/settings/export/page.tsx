"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getVaults } from "@/app/actions/vault/getVaults";
import { toast } from "sonner";
import { Vault } from "@/lib/types/VaultType";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ExportPage() {
    const [selectedVault, setSelectedVault] = useState<string>("");
    const [password, setPassword] = useState<string>("");

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

    return (
        <div className="pt-60 px-10 flex flex-col items-start justify-center size-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="size-full max-w-2xl space-y-8"
            >
                <div className="text-left w-full space-y-2">
                    <h1 className="text-3xl font-bold">
                        Export Passwords
                    </h1>
                    <p className="text-muted-foreground">Export passwords to a CSV file.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Select a Vault</CardTitle>
                        <CardDescription>Select a vault to export items from.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
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
                                            <SelectItem className="cursor-pointer" key={vault.id} value={vault.id}>
                                                {vault.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                disabled
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                // onClick={handleSubmit}
                                // disabled={!selectedVault || !password}
                                disabled
                                className="w-full"
                            >
                                Export Data (Coming soon)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}