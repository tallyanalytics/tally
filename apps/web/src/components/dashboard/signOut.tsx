"use server"

import { Button } from "@repo/ui/button"
import { signOut } from "../../../auth"



export async function SignOut() {
    return (
        <div className="hidden md:flex lg:flex">
            <form action={async () => {
                await signOut()
            }}>
                <Button type="submit" className="flex self-end w-full sm:hidden lg:flex md:flex">
                    Sign Out
                </Button>
            </form>
        </div>
    )
}