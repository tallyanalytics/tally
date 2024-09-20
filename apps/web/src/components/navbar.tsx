import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button, buttonVariants } from "@repo/ui/button";
import Link from 'next/link';
import { auth, signIn, signOut } from '../../auth';

export default async function Navbar() {
    const session = await auth();
    return (
        <div className="w-100 flex flex-row justify-between py-4 px-2">
            <div className="flex-col">
                <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                    MyApp
                </Link>
            </div>
            <div className="flex-row flex">
                <Link href="/pricing" className={buttonVariants({ variant: "ghost" })}>
                    Pricing
                </Link>
                <Link href="/docs" className={buttonVariants({ variant: "ghost" })}>
                    Docs
                </Link>
                <Link href="/about" className={buttonVariants({ variant: "ghost" })}>
                    About
                </Link>
                {
                    session?.user ?
                        <>
                            {/* <div>
                                <Avatar>
                                    {session?.user?.image ?
                                        <AvatarImage src={session?.user?.image} alt="User profile image" />
                                        :
                                        <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>}
                                </Avatar>
                            </div> */}
                            <div className="flex">
                                <form
                                    action={async () => {
                                        "use server";
                                        await signOut();
                                    }}
                                >
                                    <Button className="flex" variant="ghost" type="submit">Sign out <GitHubLogoIcon className="m-1" /></Button>
                                </form>
                            </div></>
                        :
                        <div className="flex">
                            <form
                                action={async () => {
                                    "use server"
                                    await signIn("github", { redirectTo: "/dashboard" })
                                }}
                            >
                                <Button className="flex" variant="ghost" type="submit">Sign in <GitHubLogoIcon className="m-1" /></Button>
                            </form>
                        </div>
                }
            </div>
        </div >
    );
};
