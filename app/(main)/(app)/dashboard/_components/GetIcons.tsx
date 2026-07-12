"use client";

import { motion } from "motion/react";
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

const iconsToRender: IconName[] = ['user', 'lock', 'settings'];

export default function GetIcons() {
    return (
        <motion.div className="flex flex-wrap">
            {iconsToRender.map((iconName) => (
                <DynamicIcon key={iconName} name={iconName as IconName} size={32} />
            ))}
        </motion.div>
    )
}