import Link from "next/link";
import Footer from "@/components/sections/Footer";

export default function NotFound() {
  return (
    <>
      <main id="main" className="on-ink flex min-h-[100svh] flex-col justify-between">
        <div className="grid-page" style={{ paddingTop: "calc(var(--nav-h) + 3rem)" }}>
          <span className="t-meta acc col-span-12">404</span>
        </div>
        <div className="grid-page pb-[8vh]">
          <div className="col-span-12 md:col-span-9">
            <h1 className="t-display m-0">Nothing here.</h1>
            <p className="t-body dim mt-6 max-w-[42ch]">
              That page does not exist. The work is on the front page.
            </p>
            <Link href="/" className="t-meta ul-link ul-static mt-8 inline-block" data-cursor="link" data-cursor-label="Home">
              Back to the index
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
