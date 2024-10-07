"use client"

import { CheckIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Slider } from "@repo/ui/slider";
import Link from "next/link";
import { useState } from "react";

export function Pricing() {
    const eventValues = [
        { price: 0.000035, events: 25000 },
        { price: 0.000035, events: 50000 },
        { price: 0.000035, events: 100000 },
        { price: 0.000035, events: 250000 },
        { price: 0.000035, events: 500000 },
        { price: 0.000035, events: 1000000 },
        { price: 0.000035, events: 5000000 },
    ];

    const [index, setIndex] = useState(0);

    return (
        <div id="pricing">
            <div className="px-3 py-24 flex flex-col justify-center items-center">
                <div className="container">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">Pricing</h2>
                        <span className="text-muted-foreground">Only pay for the events you use</span>
                    </div>
                    <div
                        className="my-12 flex justify-center items-center"
                    >
                        <Card
                            className="px-4 w-full max-w-md mx-5 bg-white shadow-sm"
                        >
                            <CardHeader className="text-center">
                                <div className="mb-4">
                                    <CardTitle className="text-3xl">
                                        Pay per event
                                    </CardTitle>
                                    <div className="text-muted-foreground">£{eventValues[index].price} / event</div>
                                    <div className="text-muted-foreground">£5.00 / month</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="">
                                        <CardTitle className="text-3xl">
                                            {eventValues[index].events.toLocaleString()}
                                        </CardTitle>
                                        <span className="text-sm text-gray-400"> events per month</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-3xl">£{(eventValues[index].price * eventValues[index].events + 5).toFixed(2)}</CardTitle>
                                        <span className="text-sm text-gray-400"> per month</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Slider
                                    value={[index]}
                                    min={0}
                                    max={eventValues.length - 1}
                                    step={1}
                                    onValueChange={(value) => setIndex(value[0])}
                                />
                                <section>
                                    <ul>
                                        <li className="my-3">
                                            <CheckIcon
                                                className="inline-block mr-2 text-primary-600"
                                            /> Only pay for what you use
                                        </li>
                                        <li className="my-3">
                                            <CheckIcon
                                                className="inline-block mr-2 text-primary-600"
                                            /> All features available
                                        </li>
                                        <li className="my-3">
                                            <CheckIcon
                                                className="inline-block mr-2 text-primary-600"
                                            /> Forever data retention
                                        </li>
                                    </ul>
                                </section>
                                <div className="flex items-center w-100 mt-3">
                                    <Link
                                        className={buttonVariants() + " w-full"}
                                        href="/checkout"
                                    >
                                        Try now!<PaperPlaneIcon className="ml-2" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
