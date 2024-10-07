import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@repo/ui/accordion";
import { buttonVariants } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import Link from "next/link";
import Navbar from "../components/navbar";
import { Pricing } from "../components/pricing";



export default function Page(): JSX.Element {
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-3 sm:px-5 lg:px-6 py-24">
        <header className="text-center">
          <h1 className="h2 font-bold whitespace-pre-line text-4xl">
            Take control of your website’s data with
            <span className="text-primary-500"> Tally</span>
          </h1>
          <p className="my-6 whitespace-pre-line text-2xl text-muted-foreground">
            Tally is a privacy-first analytics solution, providing cookieless insights into your web traffic. Compliant with GDPR, CCPA, and PECR.
          </p>
          <Link href="/" className={buttonVariants()}>Get Started</Link>
          <div className="flex flex-row justify-center items-center">
            <img
              className="my-6 rounded-lg"
              src="https://placehold.co/600x400"
              alt="product screenshot" />
          </div>
        </header>
      </div>
      <Card id="features" className="mx-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-xl px-3 sm:px-5 lg:px-6 shadow-sm">
        <CardHeader className="mx-auto text-center md:w-4/5 lg:w-3/4 xl:w-2/3">
          <CardTitle className="text-3xl font-bold py-6">Features</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex-col">
            <div className="flex">
              <img className="mr-2" src="/lock.svg" alt="feature icon" />
              <div className="font-semibold text-2xl">Privacy friendly</div>
            </div>
            <div className="mt-2">
              <div className="mt-2 text-lg leading-6 text-gray-500 text-left">
                We respect your users privacy, no cookies, no personal data storage. Your data stays yours, with no sharing or selling to third parties.
              </div>
            </div>
          </div>
          <div className="flex-col">
            <div className="flex">
              <img className="mr-2" src="/codesandbox.svg" alt="feature icon" />
              <div className="font-semibold text-2xl">Easy integration</div>
            </div>
            <div className="mt-2">
              <div className="mt-2 text-lg leading-6 text-gray-500 text-left">
                Simply add our lightweight script to your website. Seamlessly integrates with popular platforms like Framer, Next.js, WordPress, and Webflow.
              </div>
            </div>
          </div>
          <div className="flex-col">
            <div className="flex">
              <img className="mr-2" src="/feather.svg" alt="feature icon" />
              <div className="font-semibold text-2xl">Lightweight</div>
            </div>
            <div className="mt-2">
              <div className="mt-2 text-lg leading-6 text-gray-500 text-left">
                Delivers great performance for visitors with a script that’s only ~4KB and 96% smaller than Google Analytics.
              </div>
            </div>
          </div>
          <div className="flex-col">
            <div className="flex">
              <img className="mr-2" src="/shield.svg" alt="feature icon" />
              <div className="font-semibold text-2xl">Secure</div>
            </div>
            <div className="mt-2">
              <div className="flex">
              </div>
              <div className="mt-2 text-lg leading-6 text-gray-500 text-left">
                All our servers and data are securely hosted in the EU. Every request is fully encrypted with HTTPS for added protection.
              </div>
            </div>
          </div>
          <div className="flex-col">
            <div className="flex">
              <img className="mr-2" src="/cloud.svg" alt="feature icon" />
              <div className="font-semibold text-2xl">Google Alternative</div>
            </div>
            <div className="mt-2">
              <div className="mt-2 text-lg leading-6 text-gray-500 text-left">
                Tally is a privacy focused alternative to Google Analytics
              </div>
            </div>
          </div>
          <div className="flex-col">
            <div className="flex">
              <img className="mr-2" src="/zap.svg" alt="feature icon" />
              <div className="font-semibold text-2xl">Fast</div>
            </div>
            <div className="mt-2">
              <div className="mt-2 text-lg leading-6 text-gray-500 text-left">
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Pricing />
      <div className="px-3 py-24 flex flex-col justify-center items-center container">
        <div className="text-center text-3xl font-bold py-6">Frequently Asked Questions</div>
        <Accordion type="single" collapsible className="w-full sm:max-w-[70%] md:max-w-[70%] lg:max-w-[40%]">
          <AccordionItem value="item-4">
            <AccordionTrigger>Is Tally GDPR Compliant?</AccordionTrigger>
            <AccordionContent>
              Yes, Tally complies with EU GDPR regulations and is hosted within the EU.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need to show a cookie or consent banner?</AccordionTrigger>
            <AccordionContent>
              No, Tally does not use cookies or store any personal data.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="accordion-trigger">Is it free?</AccordionTrigger>
            <AccordionContent>
              The first 30 days are free, after that you must add a credit card.
            </AccordionContent>
          </AccordionItem>
          {/* <AccordionItem value="item-3">
            <AccordionTrigger>Why not use tiered pricing?</AccordionTrigger>
            <AccordionContent>
              We want to provide flexibility and not lock you into a single plan,
            </AccordionContent>
          </AccordionItem> */}
        </Accordion>
      </div>

      <footer className="text-center p-10 grid gap-y-6">
        <aside className="grid grid-flow-row justify-center">
          <img
            src="https://placehold.co/50x50"
            alt="company logo"
            className="justify-self-center"
          />
          <p className="font-semibold">Tally</p>
        </aside>
        <nav>
          <div className="grid grid-flow-col gap-10 justify-center">
            <a className="btn-link" href="https://twitter.com/"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            ><path
              d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
            ></path></svg></a>
            <a className="btn-link" href="https://youtube.com/"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            ><path
              d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
            ></path></svg></a>
            <a className="btn-link" href="https://facebook.com/"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            ><path
              d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
            ></path></svg></a>
          </div>
        </nav>
        <span className="text-muted-foreground text-sm">Copyright © {new Date().getFullYear()} - All rights reserved</span>
      </footer>
    </div >
  );
}
