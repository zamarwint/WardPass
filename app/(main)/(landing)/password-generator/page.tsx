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
import { CheckCircle2, CircleAlert, Copy, Dice5, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function PasswordGeneratorPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [successOrFailure, setSuccessOrFailure] = useState<number>(0);
    const [modalMessage, setModalMessage] = useState<string>("");

    // Password Generator Variables.
    const [sliderValue, setSliderValue] = useState<number[]>([12, 24]);
    const [upperChecked, setUpperChecked] = useState<boolean>(false);
    const [lowerChecked, setLowerChecked] = useState<boolean>(false);
    const [numbersChecked, setNumbersChecked] = useState<boolean>(false);
    const [symbolsChecked, setSymbolsChecked] = useState<boolean>(false);
    const [spacesChecked, setSpacesChecked] = useState<boolean>(false);
    const [pass, setPass] = useState<string>("");

    // Password Generate Function
    const passwordGenerate = () => {
        // Features to enter into the password
        const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseLetters = uppercaseLetters.toLowerCase();
        const digits = "0123456789";
        const symbols = "!@#$%^&*_-+=~";
        const space = " ";
        const addingSpace = (combination: string) => combination + space;

        // Combination and Password
        let combination: string = "", password: string = "";

        // Checks
        // CHECKS IF BOTH OF THE SLIDER VALUES ARE 0
        if (!(sliderValue[0] > 0 || sliderValue[1] > 0)) {
            setSuccessOrFailure(1);
            setModalMessage("Invalid password length. Set the start and end values to be greater than 0 and try again.");
            setModalOpen(true);
            return;
        }

        // CHECKS ANY IF THE CHECKBOXES ARE CHECKED, IF NONE, ERROR.
        if (!upperChecked && !lowerChecked && !numbersChecked && !symbolsChecked && !spacesChecked) {
            setSuccessOrFailure(1);
            setModalMessage("No password feature is selected. Please select a feature and try again.");
            setModalOpen(true);
            return;
        }

        // Get checkbox values
        if (upperChecked) combination += uppercaseLetters;
        if (lowerChecked) combination += lowercaseLetters;
        if (numbersChecked) combination += digits;
        if (symbolsChecked) combination += symbols;
        if (spacesChecked) combination = addingSpace(combination);

        // Randomize then set password
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

    // Copy the password
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

    // Clear the display.
    const clearDisplay = () => {
        setPass("");
        setSliderValue([12, 24]);
        setUpperChecked(false);
        setLowerChecked(false);
        setNumbersChecked(false);
        setSymbolsChecked(false);
        setSpacesChecked(false);
    };

    return (
        <>
            <header className="border-b border-border pb-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="eyebrow">WardPass / Password generator</p>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">TOOL / 01</span>
                </div>
                <h1 className="landing-display max-w-3xl text-4xl leading-[1.04] tracking-tight md:text-6xl">Generate a stronger<br /><span className="landing-serif text-primary">password.</span></h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Choose a length and character set, then save the result somewhere safe—like a WardPass vault.</p>
            </header>
            <FieldSet className="w-full min-w-0 rounded-none border border-border bg-card px-5 py-6 sm:px-8 sm:py-8">
                <div className="mb-7 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <Field>
                        <FieldLegend className="text-2xl font-medium tracking-tight">Build a password</FieldLegend>
                        <FieldDescription>Generated in this browser using the Web Crypto API.</FieldDescription>
                    </Field>
                    <span className="w-fit border border-border px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted-foreground">LOCAL / RANDOM</span>
                </div>

                <FieldGroup>
                    <Field>
                        <div className="flex items-center justify-between gap-4">
                            <FieldTitle className="text-base font-medium">Password length</FieldTitle>
                            <span className="font-mono text-sm tabular-nums text-foreground">{sliderValue[0]}–{sliderValue[1]}</span>
                        </div>
                        <FieldDescription>Set a minimum and maximum length from 8 to 128 characters.</FieldDescription>
                        <Slider
                            value={sliderValue}
                            onValueChange={(value) => setSliderValue(value as [number, number])}
                            max={128}
                            min={8}
                            step={1}
                            className="mt-2 w-full"
                            aria-label="Password length range"
                        />
                    </Field>
                    <FieldSeparator />
                    <div>
                        <FieldLabel className="text-base font-medium">Character sets</FieldLabel>
                        <p className="mt-1 text-sm text-muted-foreground">Choose one or more kinds of characters to include.</p>
                    </div>
                    <FieldGroup className="grid gap-2 sm:grid-cols-2 sm:gap-3">
                        {[
                            { id: "password-uppercase", label: "Uppercase letters", hint: "A–Z", checked: upperChecked, set: setUpperChecked },
                            { id: "password-lowercase", label: "Lowercase letters", hint: "a–z", checked: lowerChecked, set: setLowerChecked },
                            { id: "password-numbers", label: "Numbers", hint: "0–9", checked: numbersChecked, set: setNumbersChecked },
                            { id: "password-symbols", label: "Symbols", hint: "13 symbols", checked: symbolsChecked, set: setSymbolsChecked },
                            { id: "password-spaces", label: "Spaces", hint: "␠", checked: spacesChecked, set: setSpacesChecked },
                        ].map((option) => (
                            <Field key={option.id} orientation="horizontal" className="min-h-14 items-center border border-border px-3 py-2.5 transition-colors hover:border-primary/60">
                                <Checkbox id={option.id} checked={option.checked} onCheckedChange={(checked) => option.set(checked === true)} />
                                <FieldLabel htmlFor={option.id} className="flex w-full items-center justify-between gap-3 font-normal">
                                    <span>{option.label}</span><span className="font-mono text-[11px] text-muted-foreground">{option.hint}</span>
                                </FieldLabel>
                            </Field>
                        ))}
                    </FieldGroup>
                    <FieldSeparator />
                    <Field>
                        <FieldLabel htmlFor="generated-password" className="text-base font-medium">Generated password</FieldLabel>
                        <Input id="generated-password" autoComplete="off" placeholder="Your password appears here" readOnly value={pass} className="h-12 rounded-none bg-background font-mono text-base tracking-wide sm:text-lg" />
                    </Field>
                    <Field orientation="horizontal" className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <Button className="rounded-none" variant="default" size="lg" onClick={passwordGenerate}><Dice5 /> Generate password</Button>
                        <Button className="rounded-none" variant="outline" size="lg" onClick={clearDisplay}><RotateCcw /> Reset options</Button>
                        <Button className="rounded-none" variant="outline" size="lg" onClick={copyPassword}><Copy /> Copy password</Button>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="rounded-none border-border">
                    <DialogHeader className="text-center">
                        <DialogTitle>{successOrFailure === 0 ? "Success" : "Error"}</DialogTitle>
                    </DialogHeader>
                    {successOrFailure === 0 ? (
                        <DialogDescription className="flex flex-col items-center justify-center gap-4 text-center">
                            <CheckCircle2 aria-hidden="true" className="size-12 text-primary" />
                            {modalMessage}
                        </DialogDescription>
                    ) : (
                        <DialogDescription className="flex flex-col items-center justify-center gap-4 text-center">
                            <CircleAlert aria-hidden="true" className="size-12 text-destructive" />
                            {modalMessage}
                        </DialogDescription>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
