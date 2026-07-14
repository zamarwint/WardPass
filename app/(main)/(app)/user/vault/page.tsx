import { prisma } from '../../../../../utils/db';
import { getUserSession } from '@/app/actions/getSession';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import Link from 'next/link';
import CreateVault from '../../_components/CreateVault';

import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";

export default async function VaultSelectionPage() {
    const session = await getUserSession();
    const vaults = await prisma.vault.findMany({
        where: {
            userId: session?.user.id
        },
        select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            iconColor: true,
        },
        orderBy: {
            name: "asc",
        }
    }).then((vaults) => {
        if (!vaults || vaults.length === 0) {
            return <FieldDescription>No vaults found. Create one above.</FieldDescription>
        }
        return vaults.map((vault) => (
            <Link key={vault.id} href={`/user/vault/${vault.id}`} className='w-full'>
                <Button size="lg" className="flex items-center p-5 w-full">
                    <DynamicIcon name={vault.icon as IconName} size={32} />
                    <span className="ml-2 text-md font-semibold">{vault.name}</span>
                </Button>
            </Link>
        ))
    }).catch((err) => {
        console.log(err)
        return <FieldDescription>Error loading vaults. Please try again later.</FieldDescription>
    })

    return (
        <Field className='w-full h-full'>
            <FieldContent className='font-geist flex flex-col items-center justify-center text-center w-full gap-12'>
                <FieldSet className='flex flex-col items-center justify-center w-full gap-3'>
                    <FieldTitle className='text-3xl font-bold'>Select Vault</FieldTitle>
                    <FieldDescription>Choose an existing vault or create a new one to continue.</FieldDescription>
                </FieldSet>
                <div className='flex flex-col items-center justify-center w-xl gap-3'>
                    <CreateVault />
                    {vaults}
                </div>
            </FieldContent>
        </Field>
    )
}