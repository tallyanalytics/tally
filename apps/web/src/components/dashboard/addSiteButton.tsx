"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateSite } from "../../app/actions/site";


const domainRegex = /([a-z0-9|-]+\.)*[a-z0-9|-]+\.[a-z]+/

const siteSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    domain: z.string().min(1, { message: "Domain is required" }).refine(
        (value) => domainRegex.test(value), {
        message: "Invalid domain. Must be a domain or subdomain (e.g., domain.com or api.domain.com)"
    }),
});


export default function AddSiteButton() {
    const form = useForm<z.infer<typeof siteSchema>>({
        resolver: zodResolver(siteSchema),
        defaultValues: {
            name: "",
            domain: "",
        },
    })

    async function onSubmit(values: z.infer<typeof siteSchema>) {
        CreateSite(values).then().catch();
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Add Site</Button>
                </DialogTrigger>
                <DialogContent className="bg-background">
                    <DialogHeader>
                        <DialogTitle>Add Website</DialogTitle>
                        <DialogDescription>
                            Provide website details such as name and domain to monitor users on your website
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-8 py-4">
                                <div className="grid grid-cols-2 w-full gap-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Mywebsite" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <div className="grid grid-cols-2 w-full gap-2">
                                    <FormField
                                        control={form.control}
                                        name="domain"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Domain</FormLabel>
                                                <FormControl >
                                                    <div className="flex w-100">
                                                        <div className="h-9 px-3 py-2 rounded-tl-md rounded-bl-md border border-input border-r-0 text-sm text-stone-400 bg-accent">https://</div>
                                                        <Input placeholder="domain.com or app.domain.com" {...field} className="rounded-tl-none rounded-bl-none" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Add</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}