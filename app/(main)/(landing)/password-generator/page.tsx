"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { CheckCircle2, CircleAlert, Copy, Dice5, RotateCcw, KeyRound } from "lucide-react";
import { useState } from "react";

export default function PasswordGeneratorPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [successOrFailure, setSuccessOrFailure] = useState<number>(0);
    const [modalMessage, setModalMessage] = useState<string>("");

    // Password Generator Variables.
    const [sliderValue, setSliderValue] = useState<number[]>([16, 32]);
    const [upperChecked, setUpperChecked] = useState<boolean>(true);
    const [lowerChecked, setLowerChecked] = useState<boolean>(true);
    const [numbersChecked, setNumbersChecked] = useState<boolean>(true);
    const [symbolsChecked, setSymbolsChecked] = useState<boolean>(true);
    const [spacesChecked, setSpacesChecked] = useState<boolean>(false);
    const [pass, setPass] = useState<string>("");

    // Password Generate Function
    const passwordGenerate = () => {
        const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseLetters = uppercaseLetters.toLowerCase();
        const digits = "0123456789";
        const symbols = "!@#$%^&*_-+=~";
        const space = " ";
        const addingSpace = (combination: string) => combination + space;

        let combination: string = "", password: string = "";

        if (!(sliderValue[0] > 0 || sliderValue[1] > 0)) {
            setSuccessOrFailure(1);
            setModalMessage("Invalid password length. Set the start and end values to be greater than 0 and try again.");
            setModalOpen(true);
            return;
        }

        if (!upperChecked && !lowerChecked && !numbersChecked && !symbolsChecked && !spacesChecked) {
            setSuccessOrFailure(1);
            setModalMessage("No password feature is selected. Please select a feature and try again.");
            setModalOpen(true);
            return;
        }

        if (upperChecked) combination += uppercaseLetters;
        if (lowerChecked) combination += lowercaseLetters;
        if (numbersChecked) combination += digits;
        if (symbolsChecked) combination += symbols;
        if (spacesChecked) combination = addingSpace(combination);

        const randomBelow = (maxExclusive: number) => {
            const values = new Uint32Array(1);
            const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
            do { crypto.getRandomValues(values); } while (values[0] >= limit);
            return values[0] % maxExclusive;
        };

        const length = sliderValue[0] + randomBelow(sliderValue[1] - sliderValue[0] + 1);
        for (let x = 0; x < length; x++) {
            const randomNumber = randomBelow(combination.length);
            password += combination.substring(randomNumber, randomNumber + 1);
        }
        setPass(password);
    };

    const copyPassword = async () => {
        if (!pass) {
            setSuccessOrFailure(1);
            setModalMessage("No password is ready to copy yet. Generate one first.");
            setModalOpen(true);
            return;
        }

        try {
            await navigator.clipboard.writeText(pass);
            setSuccessOrFailure(0);
            setModalMessage("Your password has been copied to the clipboard.");
            setModalOpen(true);
            return;
        } catch {
            setSuccessOrFailure(1);
            setModalMessage("Your browser could not copy the password. Select and copy it manually instead.");
            setModalOpen(true);
            return;
        }
    };

    const clearDisplay = () => {
        setPass("");
        setSliderValue([16, 32]);
        setUpperChecked(true);
        setLowerChecked(true);
        setNumbersChecked(true);
        setSymbolsChecked(true);
        setSpacesChecked(false);
    };

    return (
        <>
            <header className="border-b border-border pb-10">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-card border border-border text-foreground shadow-xs">
                        <KeyRound className="size-3.5 text-primary" />
                        CRYPTOGRAPHIC PRNG
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">TOOL / 01</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-foreground leading-[1.08]">
                    Generate high-entropy <span className="text-gradient-gold font-normal">passwords.</span>
                </h1>
                <p className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Derive unguessable passwords directly on your machine using the browser Web Crypto API. 
                    Zero network requests, zero telemetry, 100% private.
                </p>
            </header>

            <FieldSet className="w-full min-w-0 rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-10 shadow-xs">
                <div className="mb-8 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <FieldLegend className="text-2xl font-medium text-foreground tracking-tight">Configure Entropy Parameters</FieldLegend>
                        <FieldDescription className="text-xs text-muted-foreground mt-1">Generated locally via crypto.getRandomValues().</FieldDescription>
                    </div>
                    <span className="w-fit rounded px-2.5 py-1 font-mono text-[11px] tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                        OFFLINE SECURE
                    </span>
                </div>

                <FieldGroup className="space-y-6">
                    <Field>
                        <div className="flex items-center justify-between gap-4">
                            <FieldTitle className="text-sm font-medium text-foreground">Password length range</FieldTitle>
                            <span className="font-mono text-sm tabular-nums text-primary font-semibold">{sliderValue[0]}–{sliderValue[1]} chars</span>
                        </div>
                        <FieldDescription className="text-xs text-muted-foreground">Select minimum and maximum character length.</FieldDescription>
                        <Slider
                            value={sliderValue}
                            onValueChange={(value) => setSliderValue(value as [number, number])}
                            max={128}
                            min={8}
                            step={1}
                            className="mt-4 w-full"
                            aria-label="Password length range"
                        />
                    </Field>

                    <FieldSeparator className="border-border" />

                    <div>
                        <FieldLabel className="text-sm font-medium text-foreground">Character sets</FieldLabel>
                        <p className="mt-1 text-xs text-muted-foreground">Choose character categories to include in the entropy pool.</p>
                    </div>

                    <FieldGroup className="grid gap-3 sm:grid-cols-2">
                        {[
                            { id: "password-uppercase", label: "Uppercase letters", hint: "A–Z", checked: upperChecked, set: setUpperChecked },
                            { id: "password-lowercase", label: "Lowercase letters", hint: "a–z", checked: lowerChecked, set: setLowerChecked },
                            { id: "password-numbers", label: "Numbers", hint: "0–9", checked: numbersChecked, set: setNumbersChecked },
                            { id: "password-symbols", label: "Symbols", hint: "!@#$%^&*", checked: symbolsChecked, set: setSymbolsChecked },
                            { id: "password-spaces", label: "Spaces", hint: "␠", checked: spacesChecked, set: setSpacesChecked },
                        ].map((option) => (
                            <div
                                key={option.id}
                                onClick={() => option.set(!option.checked)}
                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                                    option.checked
                                        ? "bg-primary/10 border-primary text-foreground shadow-2xs"
                                        : "bg-muted/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id={option.id}
                                        checked={option.checked}
                                        onCheckedChange={(checked) => option.set(checked === true)}
                                    />
                                    <span className="text-sm font-medium">{option.label}</span>
                                </div>
                                <span className="font-mono text-xs text-primary font-semibold">{option.hint}</span>
                            </div>
                        ))}
                    </FieldGroup>

                    <FieldSeparator className="border-border" />

                    {/* GENERATED OUTPUT DISPLAY */}
                    <div className="space-y-2">
                        <FieldLabel htmlFor="generated-password" className="text-sm font-medium text-foreground">Generated password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="generated-password"
                                autoComplete="off"
                                placeholder="Click Generate Password below..."
                                readOnly
                                value={pass}
                                className="h-14 rounded-xl bg-background border border-input font-mono text-base tracking-wider text-emerald-600 dark:text-emerald-400 pr-12 focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            {pass && (
                                <button
                                    onClick={copyPassword}
                                    title="Copy password"
                                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <Copy className="size-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button
                            className="h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm shadow-xs cursor-pointer"
                            size="lg"
                            onClick={passwordGenerate}
                        >
                            <Dice5 className="size-4 mr-2" />
                            Generate Password
                        </Button>
                        <Button
                            className="h-11 px-6 rounded-lg bg-card hover:bg-muted text-foreground border border-border text-sm font-medium shadow-xs cursor-pointer"
                            variant="outline"
                            size="lg"
                            onClick={copyPassword}
                        >
                            <Copy className="size-4 mr-2" />
                            Copy Password
                        </Button>
                        <Button
                            className="h-11 px-4 rounded-lg text-muted-foreground hover:text-foreground text-sm cursor-pointer"
                            variant="ghost"
                            size="lg"
                            onClick={clearDisplay}
                        >
                            <RotateCcw className="size-4 mr-1.5" />
                            Reset
                        </Button>
                    </div>
                </FieldGroup>
            </FieldSet>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-lg font-medium">{successOrFailure === 0 ? "Success" : "Notice"}</DialogTitle>
                    </DialogHeader>
                    {successOrFailure === 0 ? (
                        <DialogDescription className="flex flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                            <CheckCircle2 aria-hidden="true" className="size-10 text-emerald-500" />
                            <span>{modalMessage}</span>
                        </DialogDescription>
                    ) : (
                        <DialogDescription className="flex flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                            <CircleAlert aria-hidden="true" className="size-10 text-amber-500" />
                            <span>{modalMessage}</span>
                        </DialogDescription>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
