"use client";

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggleIcon() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

import { useId, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { SunIcon, MoonIcon } from 'lucide-react'

export const SwitchDualIconLabelDemo = () => {
    const id = useId()
    const [checked, setChecked] = useState<boolean>(true)
    const { setTheme } = useTheme();

    const toggleSwitch = () => {
        setChecked(prev => !prev);
        setTheme(checked ? "light" : "dark");
    }

    return (
        <div className='group inline-flex items-center gap-2' data-state={checked ? 'checked' : 'unchecked'}>
            <span
                id={`${id}-light`}
                className='group-data-checked:text-muted-foreground/70 cursor-pointer text-left text-sm font-medium'
                aria-controls={id}
                onClick={() => setChecked(false)}
            >
                <SunIcon className='size-4' aria-hidden='true' />
            </span>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={toggleSwitch}
                aria-labelledby={`${id}-dark ${id}-light`}
                aria-label='Toggle between dark and light mode'
            />
            <span
                id={`${id}-dark`}
                className='group-data-unchecked:text-muted-foreground/70 cursor-pointer text-right text-sm font-medium'
                aria-controls={id}
                onClick={() => setChecked(true)}
            >
                <MoonIcon className='size-4' aria-hidden='true' />
            </span>
        </div>
    )
}
