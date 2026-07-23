import { LineAnimationClass } from "@/app/_components/LineAnimation";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Security Whitepaper | WardPass",
};

export default function SecurityWhitepaperPage() {
    return (
        <div className="py-30 mx-auto flex flex-col gap-10 font-geist">
            <div className="flex flex-col items-center justify-center text-center gap-12 min-w-sm max-w-2xl">
                <div className="flex flex-col gap-6 items-center">
                    <h1 className="text-2xl md:text-6xl font-bold font-geist text-primary">Security Whitepaper</h1>
                    <p className="text-xl text-muted-foreground">As shown on the home page, the WardPass team is committed to transparency and security. Below is a summary of our security practices:</p>
                    <FieldSet className="max-w-lg md:max-w-xl text-muted-foreground prose text-md space-y-8">
                        <Field>
                            <div className="w-full max-w-200 h-auto">
                                <Image src="/security-badges.svg" alt="Security Badges" width={1440} height={190} className="w-full max-w-200 h-auto" loading="eager" />
                            </div>
                            <FieldSeparator className="mb-4" />
                            <FieldDescription className="text-center">
                                The WardPass codebase is publicly available on GitHub, and we encourage security researchers to review our code for vulnerabilities. You can find our code at <Link href="https://github.com/zamarwint/WardPass" target="_blank" rel="noopener noreferrer" className={`font-bold text-foreground hover:text-primary ${LineAnimationClass}`}>github.com/wardpass</Link>.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldTitle className="text-xl text-foreground">What is SOC Type II?</FieldTitle>
                            <FieldSeparator className="mb-2" />
                            <FieldDescription>
                                SOC 2® Type 2 extends beyond the SOC 2® Type 1 evaluation of the design of controls to examine the operational effectiveness of those controls. The emphasis at this stage is related to service commitments and system requirements based on the TSC over a defined period, typically a minimum of six months. The SOC 2® Type 2 audit process includes a detailed description of the auditor’s tests of controls and results. SOC 2® Type 2 reports are integral for organizations that require ongoing assurance that their information security practices align with industry standards.
                            </FieldDescription>
                            <FieldDescription className="font-bold text-foreground">SOURCE: <Link href="https://optro.ai/blog/soc-2-type-1-vs-type-2" target="_blank" rel="noopener noreferrer" className={`font-bold text-foreground hover:text-primary ${LineAnimationClass}`}>https://optro.ai/blog/soc-2-type-1-vs-type-2</Link></FieldDescription>
                        </Field>

                        <Field>
                            <FieldTitle className="text-xl text-foreground">What is AES 256-bit encryption?</FieldTitle>
                            <FieldSeparator className="mb-2" />
                            <FieldDescription>
                                AES, the Advanced Encryption Standard, is the current U.S. government standard for a symmetric-key encryption algorithm. A symmetric-key algorithm, also known as a secret key algorithm, is a cryp­togra­phy algorithm that uses the same cryp­togra­phic key for both plaintext encryption and ciphertext decryption.

                                AES has a block size of 128 bits and can have a key size of 128, 192, or 256 bits. AES is defined in the U.S. Federal Information Processing Standard (FIPS) 197 PDF* and it is included in the ISO/IEC 18033-3 standard. It can be implemented in either software or hardware. Modern web browsers provide a low-level interface to cryp­togra­phy functions via the W3C Web Cryp­togra­phy API*. This web app uses a key size of 256 bits, which is currently considered strong enough to protect U.S. government sensitive and important data. In this app, the key is generated from a passphrase by running it through the Password-Based Key Derivation Function 2 (PBKDF2, defined in IETF's RFC 2898*) one million times.

                                AES in Galois/Counter Mode PDF* or GCM is an authenticated encryption algorithm (AEAD, authenticated encryption with associated data). It provides confidentiality and integrity protection by generating both the ciphertext and an authentication tag in a single pass. During decryption, the ciphertext and the authentication tag are passed through the algorithm. If the calculated and expected authentication tags do not match, decryption fails. Unlike the commonly used CBC mode, GCM is not susceptible to padding oracle attacks PDF*. Nor has it the problems of ECB mode, which can reveal structures in the plaintext*. However, NIST* recom­mends* we should not encrypt more than 232 plaintexts with the same key while using a randomly generated initialization vector IV, like this app does. If we restrict the number of plaintexts to 10000, the probability of an IV collision is less than 2-70.
                            </FieldDescription>

                            <FieldDescription className="font-bold text-foreground">SOURCE: <Link href="https://crypt-app.net/info/aes-256-gcm.html" target="_blank" rel="noopener noreferrer" className={`font-bold text-foreground hover:text-primary ${LineAnimationClass}`}>https://crypt-app.net/info/aes-256-gcm.html</Link></FieldDescription>
                        </Field>

                        <Field>
                            <FieldTitle className="text-xl text-foreground">What is General Data Protection Regulation (GDPR)?</FieldTitle>
                            <FieldSeparator className="mb-2" />
                            <FieldDescription>
                                This Regulation lays down rules relating to the protection of natural persons with regard to the processing of personal data and rules relating to the free movement of personal data.
                                This Regulation protects fundamental rights and freedoms of natural persons and in particular their right to the protection of personal data.
                                The free movement of personal data within the Union shall be neither restricted nor prohibited for reasons connected with the protection of natural persons with regard to the processing of personal data.
                            </FieldDescription>

                            <FieldDescription className="font-bold text-foreground">READ MORE AT: <Link href="https://gdpr-info.eu/" target="_blank" rel="noopener noreferrer" className={`font-bold text-foreground hover:text-primary ${LineAnimationClass}`}>https://gdpr-info.eu/</Link></FieldDescription>
                        </Field>
                    </FieldSet>
                </div>
                <Link href="/">
                    <Button size="lg" className="text-md p-8"><ArrowLeft /> Back to Home</Button>
                </Link>
            </div>
        </div>
    )
}