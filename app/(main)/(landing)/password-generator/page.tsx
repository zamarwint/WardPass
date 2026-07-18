"use client";

import { SuccessIcon, ErrorIcon } from "@/app/_components/ModalContent";
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
import { useState } from "react";

export default function PasswordGeneratorPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [successOrFailure, setSuccessOrFailure] = useState<number>(0);
    const [modalMessage, setModalMessage] = useState<string>("");

    // Password Generator Variables.
    const [sliderValue, setSliderValue] = useState<number[]>([0, 0]);
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
        const addingSpace = (combination: string) => {
            for (let x = 0; x < length / 2; x++) {
                combination += space;
            }
            return combination;
        }

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

        // LENGTH OF THE PASSWORD
        const length = sliderValue[1] - sliderValue[0];

        // Get checkbox values
        if (upperChecked) combination += uppercaseLetters;
        if (lowerChecked) combination += lowercaseLetters;
        if (numbersChecked) combination += digits;
        if (symbolsChecked) combination += symbols;
        if (spacesChecked) combination = addingSpace(combination);

        // Randomize then set password
        for (let x = 0; x < length; x++) {
            const randomNumber = Math.floor(Math.random() * combination.length);
            password += combination.substring(randomNumber, randomNumber + 1);
        }
        setPass(password);
    };

    // Copy the password
    const copyPassword = async () => {
        if (!pass) {
            setSuccessOrFailure(1);
            setModalMessage("An error occured. No password was generated. Please try again.");
            setModalOpen(true);
            return;
        }

        try {
            await navigator.clipboard.writeText(pass);
            setSuccessOrFailure(0);
            setModalMessage("Your password has been copied to the clipboard.");
            setModalOpen(true);
            return;
        } catch (err) {
            setSuccessOrFailure(1);
            setModalMessage("An error occured. Please try again." + err);
            setModalOpen(true);
            return;
        }
    };

    // Clear the display.
    const clearDisplay = () => {
        setPass("");
        setSliderValue([0, 0]);
        setUpperChecked(false);
        setLowerChecked(false);
        setNumbersChecked(false);
        setSymbolsChecked(false);
        setSpacesChecked(false);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center text-center gap-3">
                <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Generate a Secure Password</h1>
                <p className="text-xl text-muted-foreground">Remember to store it somewhere safe afterwards.</p>
            </div>
            <div className="flex flex-col items-center justify-center border border-neutral-200 dark:border-neutral-600 bg-card/80 drop-shadow-xl dark:drop-shadow-xl/25 py-10 w-full gap-10 rounded-2xl">
                <FieldSet className="w-full px-4 md:px-10">
                    <FieldLegend className="text-center">Password</FieldLegend>
                    <FieldDescription className="text-center">Generate your password.</FieldDescription>

                    <FieldSeparator />

                    <FieldGroup>
                        <Field>
                            <FieldTitle className="text-xl">Password Length</FieldTitle>
                            <FieldDescription>
                                Set your password length
                                (<span className="font-medium tabular-nums">{sliderValue[0]}</span> -{" "}
                                <span className="font-medium tabular-nums">{sliderValue[1]}</span>).
                            </FieldDescription>
                            <Slider
                                value={sliderValue}
                                onValueChange={(value) => setSliderValue(value as [number, number])}
                                max={1000}
                                min={0}
                                step={10}
                                className="mt-2 w-full"
                                aria-label="Price Range"
                            />
                        </Field>
                    </FieldGroup>

                    <FieldSeparator />

                    <FieldLabel className="text-xl">
                        Choose characters to include:
                    </FieldLabel>
                    <FieldDescription>
                        Check the boxes for the characters you want to include in your password.
                    </FieldDescription>
                    <FieldGroup className="gap-3">
                        <Field orientation="horizontal">
                            <Checkbox id="finder-pref-9k2-hard-disks-ljj" checked={upperChecked} onCheckedChange={() => setUpperChecked(!upperChecked)} />
                            <FieldLabel
                                htmlFor="finder-pref-9k2-hard-disks-ljj"
                                className="font-normal"
                                defaultChecked
                            >
                                UPPERCASE LETTERS (A-Z)
                            </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="finder-pref-9k2-external-disks-1yg" checked={lowerChecked} onCheckedChange={() => setLowerChecked(!lowerChecked)} />
                            <FieldLabel
                                htmlFor="finder-pref-9k2-external-disks-1yg"
                                className="font-normal"
                            >
                                lowercase letters (a-z)
                            </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="finder-pref-9k2-cds-dvds-fzt" checked={numbersChecked} onCheckedChange={() => setNumbersChecked(!numbersChecked)} />
                            <FieldLabel
                                htmlFor="finder-pref-9k2-cds-dvds-fzt"
                                className="font-normal"
                            >
                                Numbers (0-9)
                            </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="finder-pref-9k2-connected-servers-6l2" checked={symbolsChecked} onCheckedChange={() => setSymbolsChecked(!symbolsChecked)} />
                            <FieldLabel
                                htmlFor="finder-pref-9k2-connected-servers-6l2"
                                className="font-normal"
                            >
                                Symbols (!, @, #, $, %, ^, &, *, ?, _, -, =)
                            </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="finder-pref-9k2-connected-servers-6l2" checked={spacesChecked} onCheckedChange={() => setSpacesChecked(!spacesChecked)} />
                            <FieldLabel
                                htmlFor="finder-pref-9k2-connected-servers-6l2"
                                className="font-normal"
                            >
                                Spaces ( )
                            </FieldLabel>
                        </Field>

                        <FieldSeparator />

                        <Field>
                            <FieldLabel htmlFor="name" className="text-xl">Generated Password</FieldLabel>
                            <Input id="name" autoComplete="off" placeholder="e.g. G@5S5Jq!028476$d" readOnly value={pass} className="select-none pointer-events-none" />
                        </Field>

                        <Field orientation="horizontal" className="flex flex-col md:flex-row items-center justify-center">
                            <Button variant="default" size="lg" onClick={passwordGenerate} >Generate Password</Button>
                            <Button variant="default" size="lg" onClick={clearDisplay}>Reset Password</Button>
                            <Button variant="default" size="lg" onClick={copyPassword}>Copy Password</Button>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </div>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader className="text-center">
                        <DialogTitle>{successOrFailure === 0 ? "Success" : "Error"}</DialogTitle>
                    </DialogHeader>
                    {successOrFailure === 0 ? (
                        <DialogDescription className="flex flex-col items-center justify-center gap-4 text-center">
                            <SuccessIcon />
                            {modalMessage}
                        </DialogDescription>
                    ) : (
                        <DialogDescription className="flex flex-col items-center justify-center gap-4 text-center">
                            <ErrorIcon />
                            {modalMessage}
                        </DialogDescription>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}